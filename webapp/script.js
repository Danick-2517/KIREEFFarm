"use strict";

const CONFIG = {
    apiUrl: "http://127.0.0.1:5000/order"
};

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const WEEKDAYS = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];

const products = [
    { id: 1, name: "Домашняя колбаса", weight: "2 кг", price: 450, image: "images/products/placeholder.jpg" },
    { id: 2, name: "Сало домашнее", weight: "1 кг", price: 650, image: "images/products/placeholder.jpg" },
    { id: 3, name: "Копчёная грудинка", weight: "1 кг", price: 720, image: "images/products/placeholder.jpg" },
    { id: 4, name: "Домашние сосиски", weight: "1 кг", price: 580, image: "images/products/placeholder.jpg" },
    { id: 5, name: "Пельмени", weight: "1 кг", price: 430, image: "images/products/placeholder.jpg" },
    { id: 6, name: "Фарш", weight: "1 кг", price: 390, image: "images/products/placeholder.jpg" },
    { id: 7, name: "Тушёнка", weight: "500 г", price: 320, image: "images/products/placeholder.jpg" },
    { id: 8, name: "Домашние яйца", weight: "10 шт", price: 180, image: "images/products/placeholder.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || {};

const productsContainer = document.getElementById("products");
const cartButton = document.getElementById("cartButton");
const cartModal = document.getElementById("cartModal");
const closeCartButton = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const orderModal = document.getElementById("orderModal");
const sendOrderButton = document.getElementById("sendOrder");
const toastEl = document.getElementById("toast");

const nameInput = document.getElementById("customerName");
const phoneInput = document.getElementById("customerPhone");
const addressInput = document.getElementById("customerAddress");
const commentInput = document.getElementById("customerComment");
const dateSelect = document.getElementById("deliveryDate");
const timeSelect = document.getElementById("deliveryTimeSlot");

function renderProducts() {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>${product.weight}</p>
                <div class="price-row">
                    <span class="price">${product.price} ₽</span>
                    <button onclick="addToCart(${product.id})">+</button>
                </div>
            </div>
        </div>
    `).join("");
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
    if (cart[id]) {
        cart[id].quantity++;
    } else {
        const product = products.find(item => item.id === id);
        if (!product) return;
        cart[id] = { ...product, quantity: 1 };
    }
    updateCart();
}

function increaseQuantity(id) {
    if (!cart[id]) return;
    cart[id].quantity++;
    updateCart();
}

function decreaseQuantity(id) {
    if (!cart[id]) return;
    cart[id].quantity--;
    if (cart[id].quantity <= 0) {
        delete cart[id];
    }
    updateCart();
}

function updateCart() {
    const items = Object.values(cart);

    cartCountEl.textContent = items.reduce((sum, item) => sum + item.quantity, 0);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalEl.textContent = `${total} ₽`;

    if (items.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🧺</div>
                <p>Корзина пуста</p>
                <p>Добавьте товары из каталога</p>
            </div>
        `;
    } else {
        cartItemsEl.innerHTML = items.map(item => `
            <div class="cart-item">
                <strong>${item.name}</strong><br>
                <div class="cart-controls">
                    <button onclick="decreaseQuantity(${item.id})">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <div class="cart-price">${item.price * item.quantity} ₽</div>
            </div>
        `).join("");
    }

    saveCart();
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function nextDateForWeekday(targetDay) {
    const today = startOfDay(new Date());
    const diff = (targetDay - today.getDay() + 7) % 7;
    const result = new Date(today);
    result.setDate(today.getDate() + diff);
    return result;
}

function formatDate(date) {
    return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function getUpcomingWeekendDates() {
    const saturday = nextDateForWeekday(6);
    const sunday = nextDateForWeekday(0);
    return [saturday, sunday].sort((a, b) => a - b);
}

function populateDeliveryDates() {
    const dates = getUpcomingWeekendDates();
    dateSelect.innerHTML = '<option value="">Выберите дату</option>' +
        dates.map(d => `<option value="${d.toISOString().slice(0, 10)}">${formatDate(d)}</option>`).join("");
}

function formatPhoneInput(e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.startsWith("8")) value = "7" + value.slice(1);
    if (!value.startsWith("7")) value = "7" + value;
    value = value.slice(0, 11);

    let formatted = "+7";
    if (value.length > 1) formatted += " (" + value.slice(1, 4);
    if (value.length >= 4) formatted += ") " + value.slice(4, 7);
    if (value.length >= 7) formatted += "-" + value.slice(7, 9);
    if (value.length >= 9) formatted += "-" + value.slice(9, 11);

    e.target.value = formatted;
}

phoneInput.addEventListener("input", formatPhoneInput);
phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value) phoneInput.value = "+7 ";
});

function setFieldValidity(el, isValid) {
    el.classList.toggle("invalid", !isValid);
}

function validateOrderForm() {
    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    const checks = [
        [nameInput, nameInput.value.trim().length > 0],
        [phoneInput, phoneDigits.length === 11],
        [addressInput, addressInput.value.trim().length > 0],
        [dateSelect, dateSelect.value !== ""],
        [timeSelect, timeSelect.value !== ""]
    ];

    checks.forEach(([el, isValid]) => setFieldValidity(el, isValid));

    return checks.every(([, isValid]) => isValid);
}

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastEl.timer);
    toastEl.timer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2500);
}

function resetOrderForm() {
    nameInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
    commentInput.value = "";
    populateDeliveryDates();
    timeSelect.selectedIndex = 0;
    [nameInput, phoneInput, addressInput, dateSelect, timeSelect].forEach(el =>
        el.classList.remove("invalid")
    );
}

function setSendButtonState(disabled) {
    sendOrderButton.disabled = disabled;
    sendOrderButton.textContent = disabled ? "Отправка..." : "Подтвердить заказ";
}

cartButton.onclick = () => {
    cartModal.classList.add("open");
};

closeCartButton.onclick = () => {
    cartModal.classList.remove("open");
    saveCart();
};

cartModal.onclick = (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove("open");
    }
};

checkoutButton.onclick = () => {
    if (Object.keys(cart).length === 0) {
        showToast("Корзина пуста");
        return;
    }
    cartModal.classList.remove("open");
    orderModal.classList.add("open");
};

sendOrderButton.onclick = async () => {
    if (!validateOrderForm()) {
        showToast("Заполните поля корректно");
        return;
    }

    setSendButtonState(true);

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const comment = commentInput.value.trim();
    const dateLabel = dateSelect.options[dateSelect.selectedIndex].text;
    const timeLabel = timeSelect.value;
    const slot = `${dateLabel}, ${timeLabel}`;

    const items = Object.values(cart);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = {
        customer: { name, phone, address, comment, slot },
        items,
        total
    };

    try {
        const response = await fetch(CONFIG.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        const result = await response.json();

        if (result.success) {
            showToast("Заказ отправлен");
            cart = {};
            updateCart();
            orderModal.classList.remove("open");
            resetOrderForm();
        } else {
            showToast("Ошибка отправки");
        }
    } catch (e) {
        showToast("Сервер недоступен");
    } finally {
        setSendButtonState(false);
    }
};

orderModal.onclick = (e) => {
    if (e.target === orderModal) {
        orderModal.classList.remove("open");
    }
};

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        orderModal.classList.remove("open");
        cartModal.classList.remove("open");
    }
});

document.querySelectorAll("#orderModal input").forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendOrderButton.click();
        }
    });
});

renderProducts();
updateCart();
populateDeliveryDates();