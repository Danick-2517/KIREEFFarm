#BOT_TOKEN = "8862554581:AAEfcuRi14Lzs4KIfmMjrAzpwoXG81VMUoM"
#CHAT_ID = 6684691811
from flask import Flask, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

BOT_TOKEN = "8862554581:AAEfcuRi14Lzs4KIfmMjrAzpwoXG81VMUoM"
CHAT_ID = 6684691811

def send(text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    requests.post(url, data={"chat_id": CHAT_ID, "text": text})

@app.route("/order", methods=["POST"])
def order():
    data = request.json

    text = f"""
🧾 НОВЫЙ ЗАКАЗ

👤 {data.get('name')}
📞 {data.get('phone')}
📍 {data.get('address')}
⏰ Окно: {data.get('slot')}

────────────

"""

    for item in data.get("items", []):
        text += f"{item['name']} ×{item['qty']} = {item['price'] * item['qty']} ₽\n"

    text += f"\n💰 ИТОГО: {data.get('total')} ₽"

    send(text)

    return {"ok": True}

if __name__ == "__main__":
    app.run(port=5000)