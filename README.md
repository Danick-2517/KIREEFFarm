# KIREEFF

Интернет-магазин домашних фермерских продуктов с доставкой по Бийску.

## Структура

```
.
├── README.md
├── .gitignore
├── bot/
│   ├── bot.py
│   ├── .env.example
│   ├── .env              (не коммитится, создаётся локально)
│   └── requirements.txt
└── webapp/
    ├── index.html
    ├── style.css
    ├── script.js
    └── images/
        ├── backgrounds/
        ├── logo/
        ├── products/
        └── ui/
```

## Запуск бэкенда (bot/)

1. Перейти в папку:
   ```
   cd bot
   ```
2. Создать виртуальное окружение и установить зависимости:
   ```
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Создать `.env` на основе `.env.example`:
   ```
   cp .env.example .env
   ```
   и вписать туда реальные `BOT_TOKEN` и `CHAT_ID`.
4. Запустить сервер:
   ```
   python bot.py
   ```
   Сервер поднимется на `http://127.0.0.1:5000`.

## Запуск фронтенда (webapp/)

Открыть `webapp/index.html` в браузере, либо поднять локальный сервер, например:
```
cd webapp
python -m http.server 8000
```

## Этап 1 — статус

- [x] каталог
- [x] корзина (модальное окно)
- [x] оформление заказа
- [x] Telegram
- [x] Flask
- [x] автоматический выбор ближайших выходных
- [x] три окна доставки (11–15 / 15–19 / 19–23)
- [x] маска телефона
- [x] проверка полей
- [ ] фотографии товаров (нужны реальные файлы в webapp/images/products/)
- [x] пустое состояние корзины

## Важно про секреты

- `bot/.env` никогда не коммитится (уже в `.gitignore`).
- Если токен бота когда-либо оказывался в публичном месте (GitHub, чат, скриншот) — считать его скомпрометированным и немедленно отозвать через `@BotFather` → `Bot Settings` → `Revoke current token`.
