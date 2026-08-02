import os
import logging
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests

# Загружаем .env
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("kireeff-bot")

app = Flask(__name__)
CORS(app)

BOT_TOKEN = os.environ.get("BOT_TOKEN")
CHAT_ID = os.environ.get("CHAT_ID")

if not BOT_TOKEN or not CHAT_ID:
    if not ENV_PATH.exists():
        raise RuntimeError(
            f"Файл .env не найден по пути: {ENV_PATH}\n"
            f"Создай его: cp .env.example .env (внутри папки bot/)"
        )
    raise RuntimeError(
        f"Файл .env найден ({ENV_PATH}), но BOT_TOKEN или CHAT_ID пустые.\n"
        f"Проверь формат — без кавычек и без пробелов вокруг '=':\n"
        f"BOT_TOKEN=твой_токен\n"
        f"CHAT_ID=твой_chat_id"
    )

TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"


def send_telegram_message(text):
    try:
        response = requests.post(
            TELEGRAM_API_URL,
            json={"chat_id": CHAT_ID, "text": text},
            timeout=10
        )
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        logger.error("Telegram send failed: %s", e)
        return False


def format_order_message(customer, items, total):
    text = "🧾 НОВЫЙ ЗАКАЗ\n\n"

    for item in items:
        text += (
            f"🥩 {item['name']}\n"
            f"Количество: {item['quantity']}\n"
            f"Цена: {item['price']} ₽\n"
            f"Сумма: {item['price'] * item['quantity']} ₽\n\n"
        )

    text += (
        "──────────────\n"
        f"💰 Итого: {total} ₽\n\n"
        f"👤 {customer['name']}\n"
        f"📞 {customer['phone']}\n"
        f"📍 {customer['address']}\n"
        f"🕒 {customer['slot']}\n"
        f"💬 {customer.get('comment') or '-'}"
    )

    return text


@app.route("/order", methods=["POST"])
def order():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"success": False, "error": "invalid_json"}), 400

    customer = data.get("customer")
    items = data.get("items")
    total = data.get("total")

    if not customer or not items or total is None:
        return jsonify({"success": False, "error": "missing_fields"}), 400

    required_customer_fields = ("name", "phone", "address", "slot")
    if not all(customer.get(field) for field in required_customer_fields):
        return jsonify({"success": False, "error": "missing_customer_fields"}), 400

    text = format_order_message(customer, items, total)
    sent = send_telegram_message(text)

    return jsonify({"success": sent})


@app.route("/webhook", methods=["POST"])
def webhook():
    try:
        data = request.get_json()
        if data and "message" in data:
            chat_id = data["message"]["chat"]["id"]
            send_start_message(chat_id)
        return jsonify({"ok": True})
    except Exception as e:
        logger.error("Webhook error: %s", e)
        return jsonify({"ok": False}), 500


def send_start_message(chat_id):
    try:
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": "🍅 Добро пожаловать в KIREEFF!\n\nНастоящие фермерские продукты с доставкой по Бийску.\n\nНажми на кнопку ниже, чтобы открыть магазин.",
            "reply_markup": {
    "keyboard": [
        [{"text": "🛒 Открыть магазин", "web_app": {"url": "https://t.me/kireeff_farm_bot/Farm"}}]
    ],
    "resize_keyboard": True
}
        }
        requests.post(url, json=payload, timeout=10)
    except Exception as e:
        logger.error("Send start message failed: %s", e)


@app.route("/move_order/<int:order_id>", methods=["POST"])
def move_order(order_id):
    return jsonify({"success": True, "message": f"Заказ #{order_id} перенесён"}), 200


@app.route("/cancel_order/<int:order_id>", methods=["POST"])
def cancel_order(order_id):
    return jsonify({"success": True, "message": f"Заказ #{order_id} отменён"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))