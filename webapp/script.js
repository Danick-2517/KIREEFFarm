"use strict";

const CONFIG = {
    apiUrl: "http://127.0.0.1:5000/order"
};

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const WEEKDAYS = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];

const products = [
    { id: 1, name: "Колбаса Kireeff", weight: "1 кг", price: 450, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: "ХИТ"},
    { id: 2, name: "Козье молоко", weight: "1 л", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 3, name: "Коровье молоко", weight: "1 л", price: 150, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 5, name: "Сыр", weight: "500 г", price: 400, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 6, name: "Яйца домашние", weight: "10 шт", price: 180, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 7, name: "Сало солёное", weight: "1 кг", price: 500, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 8, name: "Сало копчёное", weight: "1 кг", price: 550, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 9, name: "Сало Kireeff Фирменное", weight: "1 кг", price: 650, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: "ХИТ" },
    { id: 10, name: "Малосольные огурцы", weight: "700 г", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: "ХИТ"},
    { id: 11, name: "Ягодный компот", weight: "1 л", price: 300, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 12, name: "Фруктовый компот", weight: "1 л", price: 280, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 13, name: "Масло сливочное", weight: "200 г", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 14, name: "Творог", weight: "500 г", price: 320, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 15, name: "Варенье", weight: "500 г", price: 350, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 16, name: "Мёд", weight: "1 кг", price: 700, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 17, name: "Квашеная капуста", weight: "1 кг", price: 220, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 18, name: "Маринованные грибы", weight: "500 г", price: 300, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 19, name: "Грибы", weight: "по сезону", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 20, name: "Ягоды", weight: "по сезону", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
    { id: 21, name: "Фрукты", weight: "по сезону", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"] },
];

let cart = JSON.parse(localStorage.getItem("cart")) || {};
let selectedTime = "";

const productsContainer = document.getElementById("products");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartButton = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const orderModal = document.getElementById("orderModal");
const orderSummaryEl = document.getElementById("orderSummary");
const sendOrderButton = document.getElementById("sendOrder");
const toastEl = document.getElementById("toast");
const timeSlotsEl = document.getElementById("timeSlots");

const nameInput = document.getElementById("customerName");
const phoneInput = document.getElementById("customerPhone");
const addressInput = document.getElementById("customerAddress");
const commentInput = document.getElementById("customerComment");
const dateSelect = document.getElementById("deliveryDate");

/* ========================= */
/*          PRODUCTS           */
/* ========================= */

function renderProducts() {
    productsContainer.innerHTML = products.map(product => {
        let statusHTML = '';
        if (product.status === 'in_stock') {
            statusHTML = '<span class="status status-in">✅ Свежее, готово к отправке</span>';
        } else if (product.status === 'low_stock') {
            statusHTML = '<span class="status status-low">🐔 Девчонки уже почти всё разобрали</span>';
        } else if (product.status === 'out_of_stock') {
            statusHTML = '<span class="status status-out">🌿 Сезон закончился. Ждём следующего лета.</span>';
        } else if (product.status === 'seasonal') {
            statusHTML = '<span class="status status-seasonal">🌿 Сезонный товар</span>';
        } else if (product.status === 'coming_soon') {
            statusHTML = '<span class="status status-coming">🚀 Скоро появится</span>';
        }

        return `
            <div class="product-card">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                ${statusHTML}
                <div class="product-image" onclick="openPhotoModal(${product.id}, 0)">
                    <img src="${product.images[0]}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-weight">${product.weight}</p>
                    <div class="price-row">
                        <span class="price">${product.price} ₽</span>
                        ${product.status !== 'out_of_stock' ? `<button onclick="addToCart(${product.id})">+</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

/* ========================= */
/*             CART            */
/* ========================= */

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

function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
    saveCart();
}

/* ========================= */
/*      DELIVERY DATES          */
/* ========================= */

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
    const select = document.getElementById('deliveryDate');
    if (!select) {
        console.error('Элемент deliveryDate не найден!');
        return;
    }

    select.innerHTML = '';
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Выберите дату';
    select.appendChild(emptyOption);

    dates.forEach(function(d) {
        const option = document.createElement('option');
        option.value = d.toISOString().slice(0, 10);
        option.textContent = formatDate(d);
        select.appendChild(option);
    });

    if (select.options.length > 1) {
        select.selectedIndex = 1;
    }
}

/* ========================= */
/*          TIME SLOTS          */
/* ========================= */

timeSlotsEl.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        timeSlotsEl.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedTime = btn.dataset.time;
        timeSlotsEl.classList.remove("invalid");
    });
});

function resetTimeSlots() {
    selectedTime = "";
    timeSlotsEl.querySelectorAll("button").forEach(b => b.classList.remove("active"));
    timeSlotsEl.classList.remove("invalid");
}

/* ========================= */
/*         PHONE MASK           */
/* ========================= */

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

/* ========================= */
/*         VALIDATION           */
/* ========================= */

function setFieldValidity(el, isValid) {
    el.classList.toggle("invalid", !isValid);
}

function validateOrderForm() {
    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    const checks = [
        [nameInput, nameInput.value.trim().length > 0],
        [phoneInput, phoneDigits.length === 11],
        [addressInput, addressInput.value.trim().length > 0],
        [dateSelect, dateSelect.value !== ""]
    ];

    checks.forEach(([el, isValid]) => setFieldValidity(el, isValid));
    setFieldValidity(timeSlotsEl, selectedTime !== "");

    return checks.every(([, isValid]) => isValid) && selectedTime !== "";
}

/* ========================= */
/*            TOAST             */
/* ========================= */

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastEl.timer);
    toastEl.timer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2500);
}

/* ========================= */
/*         ORDER MODAL          */
/* ========================= */

function renderOrderSummary() {
    const items = Object.values(cart);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    orderSummaryEl.innerHTML = items.map(item => `
        <div class="order-summary-row">
            <span>${item.name} × ${item.quantity}</span>
            <span>${item.price * item.quantity} ₽</span>
        </div>
    `).join("") + `
        <div class="order-summary-total">
            <span>Итого</span>
            <span>${total} ₽</span>
        </div>
    `;
}

function openOrderModal() {
    renderOrderSummary();
    orderModal.classList.add("open");
}

function resetOrderForm() {
    nameInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
    commentInput.value = "";
    populateDeliveryDates();
    resetTimeSlots();
    [nameInput, phoneInput, addressInput, dateSelect].forEach(el =>
        el.classList.remove("invalid")
    );
}

function setSendButtonState(disabled) {
    sendOrderButton.disabled = disabled;
    sendOrderButton.textContent = disabled ? "Отправка..." : "Подтвердить заказ";
}

/* ========================= */
/*         EVENT WIRING          */
/* ========================= */

cartButton.onclick = openCart;
closeCartButton.onclick = closeCart;
cartOverlay.onclick = closeCart;

checkoutButton.onclick = () => {
    if (Object.keys(cart).length === 0) {
        showToast("Корзина пуста");
        return;
    }
    closeCart();
    openOrderModal();
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
    const slot = `${dateLabel}, ${selectedTime}`;

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
        closeCart();
    }
});

document.querySelectorAll("#orderModal input").forEach(input => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendOrderButton.click();
        }
    });
});

/* ========================= */
/*        PHOTO LIGHTBOX        */
/* ========================= */

const photoModal = document.getElementById("photoModal");
const photoModalImage = document.getElementById("photoModalImage");
const closePhotoButton = document.getElementById("closePhoto");
const prevPhotoButton = document.getElementById("prevPhoto");
const nextPhotoButton = document.getElementById("nextPhoto");

let currentPhotoProductId = null;
let currentPhotoIndex = 0;

function openPhotoModal(productId, index) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentPhotoProductId = productId;
    currentPhotoIndex = index;

    photoModalImage.src = product.images[currentPhotoIndex];
    prevPhotoButton.style.display = product.images.length > 1 ? "block" : "none";
    nextPhotoButton.style.display = product.images.length > 1 ? "block" : "none";

    photoModal.classList.add("open");
}

function changePhoto(step) {
    const product = products.find(p => p.id === currentPhotoProductId);
    if (!product) return;

    currentPhotoIndex = (currentPhotoIndex + step + product.images.length) % product.images.length;
    photoModalImage.src = product.images[currentPhotoIndex];
}

closePhotoButton.onclick = () => photoModal.classList.remove("open");
prevPhotoButton.onclick = () => changePhoto(-1);
nextPhotoButton.onclick = () => changePhoto(1);

photoModal.onclick = (e) => {
    if (e.target === photoModal) {
        photoModal.classList.remove("open");
    }
};

document.addEventListener("keydown", (e) => {
    if (!photoModal.classList.contains("open")) return;
    if (e.key === "Escape") photoModal.classList.remove("open");
    if (e.key === "ArrowLeft") changePhoto(-1);
    if (e.key === "ArrowRight") changePhoto(1);
});

/* ========================= */
/*         TODAY DATE           */
/* ========================= */

function updateTodayDate() {
    const el = document.getElementById('todayDate');
    if (!el) return;
    const now = new Date();
    const days = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    el.textContent = `${now.getDate()} ${months[now.getMonth()]}, ${days[now.getDay()]}`;
}

/* ========================= */
/*             INIT            */
/* ========================= */

document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCart();
    populateDeliveryDates();
    updateTodayDate();
    console.log('✅ KIREEFFarm загружен!');
});