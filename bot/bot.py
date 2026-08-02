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


@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    if data and "message" in data:
        chat_id = data["message"]["chat"]["id"]
        text = data["message"].get("text", "")

        if text == "/start":
            send_start_message(chat_id)

    return jsonify({"ok": True})

BOT_TOKEN = os.environ.get("BOT_TOKEN")
CHAT_ID = os.environ.get("CHAT_ID")

# Проверка переменных
if not BOT_TOKEN or not CHAT_ID:
    raise RuntimeError(
        "BOT_TOKEN или CHAT_ID не заданы. Проверь .env файл."
    )

TELEGRAM_API_URL = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

def send_start_message(chat_id):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": "🍅 Добро пожаловать в KIREEFF!\n\nЗдесь можно заказать фермерские продукты с доставкой по Бийску.\n\n🛒 Открыть магазин: t.me/kireeff_farm_bot/Farm",
        "reply_markup": {
            "inline_keyboard": [
                [{"text": "🛒 Открыть магазин", "web_app": {"url": "https://t.me/kireeff_farm_bot/Farm"}}]
            ]
        }
    }
    requests.post(url, json=payload)


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

    required = ("name", "phone", "address", "slot")
    if not all(customer.get(field) for field in required):
        return jsonify({"success": False, "error": "missing_customer_fields"}), 400

    text = format_order_message(customer, items, total)
    sent = send_telegram_message(text)

    return jsonify({"success": sent})


@app.route("/move_order/<int:order_id>", methods=["POST"])
def move_order(order_id):
    return jsonify({"success": True, "message": "Заказ перенесён"}), 200


@app.route("/cancel_order/<int:order_id>", methods=["POST"])
def cancel_order(order_id):
    return jsonify({"success": True, "message": "Заказ отменён"}), 200


# ТОЛЬКО ДЛЯ ЛОКАЛЬНОГО ЗАПУСКА (не для Render)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

