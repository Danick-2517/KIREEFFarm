"use strict";

// ===== CONFIG =====
const CONFIG = {
    apiUrl: "http://127.0.0.1:5000/order"
};

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const WEEKDAYS = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];

// ===== PRODUCTS =====
const products = [
    { id: 1, name: "Колбаса Kireeff", category: "meat", weight: "1 кг", price: 450, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: "ХИТ", status: "in_stock" },
    { id: 2, name: "Козье молоко", category: "dairy", weight: "1 л", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "low_stock" },
    { id: 3, name: "Коровье молоко", category: "dairy", weight: "1 л", price: 150, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 5, name: "Сыр", category: "cheese", weight: "500 г", price: 400, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "out_of_stock" },
    { id: 6, name: "Яйца домашние", category: "eggs", weight: "10 шт", price: 180, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 7, name: "Сало солёное", category: "meat", weight: "1 кг", price: 500, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 8, name: "Сало копчёное", category: "meat", weight: "1 кг", price: 550, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 9, name: "Сало Kireeff Фирменное", category: "meat", weight: "1 кг", price: 650, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: "ХИТ", status: "in_stock" },
    { id: 10, name: "Малосольные огурцы", category: "seasonal", weight: "700 г", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: "ХИТ", status: "seasonal" },
    { id: 11, name: "Ягодный компот", category: "seasonal", weight: "1 л", price: 300, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 12, name: "Фруктовый компот", category: "seasonal", weight: "1 л", price: 280, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 13, name: "Масло сливочное", category: "dairy", weight: "200 г", price: 250, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 14, name: "Творог", category: "dairy", weight: "500 г", price: 320, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "low_stock" },
    { id: 15, name: "Варенье", category: "seasonal", weight: "500 г", price: 350, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
    { id: 16, name: "Мёд", category: "seasonal", weight: "1 кг", price: 700, images: ["images/products/Колбаса Premium_1.jpg","images/products/Колбаса Premium_2.jpg"], badge: null, status: "in_stock" },
];

// ===== ADMIN =====
let adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [...products];
let editingId = null;

function saveAdminProducts() {
    localStorage.setItem("adminProducts", JSON.stringify(adminProducts));
    // Обновляем основной массив
    products.length = 0;
    products.push(...adminProducts);
}

function renderAdminTable() {
    const tbody = document.getElementById("adminTableBody");
    if (!tbody) return;

    tbody.innerHTML = adminProducts.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.price} ₽</td>
            <td>${p.category || '-'}</td>
            <td><span class="status-badge status-${p.status || 'in_stock'}">${p.status || 'in_stock'}</span></td>
            <td>
                <div class="admin-actions">
                    <button class="edit-btn" onclick="editProduct(${p.id})">✎</button>
                    <button class="delete-btn" onclick="deleteProduct(${p.id})">🗑</button>
                    <button class="toggle-btn" onclick="toggleProduct(${p.id})">
                        ${p.hidden ? '🙈' : '👁'}
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

function editProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (!product) return;

    editingId = id;
    document.getElementById("adminName").value = product.name;
    document.getElementById("adminWeight").value = product.weight;
    document.getElementById("adminPrice").value = product.price;
    document.getElementById("adminCategory").value = product.category || 'meat';
    document.getElementById("adminStatus").value = product.status || 'in_stock';
    document.getElementById("adminBadge").value = product.badge || '';
    document.getElementById("adminImage").value = product.images?.[0] || '';
    document.getElementById("adminSaveBtn").textContent = "💾 Сохранить изменения";
}

function deleteProduct(id) {
    if (!confirm("Удалить товар?")) return;
    adminProducts = adminProducts.filter(p => p.id !== id);
    saveAdminProducts();
    renderAdminTable();
    renderProducts(currentCategory);
}

function toggleProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (!product) return;
    product.hidden = !product.hidden;
    saveAdminProducts();
    renderAdminTable();
    renderProducts(currentCategory);
}

function saveProduct() {
    const name = document.getElementById("adminName").value.trim();
    const weight = document.getElementById("adminWeight").value.trim();
    const price = parseFloat(document.getElementById("adminPrice").value);
    const category = document.getElementById("adminCategory").value;
    const status = document.getElementById("adminStatus").value;
    const badge = document.getElementById("adminBadge").value.trim();
    const image = document.getElementById("adminImage").value.trim() || "images/products/Колбаса Premium_1.jpg";

    if (!name || !weight || isNaN(price) || price <= 0) {
        showToast("❌ Заполните все обязательные поля");
        return;
    }

    if (editingId) {
        // Редактирование
        const product = adminProducts.find(p => p.id === editingId);
        if (product) {
            product.name = name;
            product.weight = weight;
            product.price = price;
            product.category = category;
            product.status = status;
            product.badge = badge || null;
            product.images = [image];
        }
        editingId = null;
        document.getElementById("adminSaveBtn").textContent = "➕ Добавить товар";
        showToast("✅ Товар обновлён");
    } else {
        // Добавление
        const newId = Math.max(0, ...adminProducts.map(p => p.id)) + 1;
        adminProducts.push({
            id: newId,
            name,
            weight,
            price,
            category,
            status,
            badge: badge || null,
            images: [image],
            hidden: false
        });
        showToast("✅ Товар добавлен");
    }

    // Очищаем форму
    document.getElementById("adminName").value = "";
    document.getElementById("adminWeight").value = "";
    document.getElementById("adminPrice").value = "";
    document.getElementById("adminBadge").value = "";
    document.getElementById("adminImage").value = "";

    saveAdminProducts();
    renderAdminTable();
    renderProducts(currentCategory);
}

// ===== ADMIN TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById("adminToggle");
    const adminContent = document.getElementById("adminContent");
    const saveBtn = document.getElementById("adminSaveBtn");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isOpen = adminContent.style.display !== "none";
            adminContent.style.display = isOpen ? "none" : "block";
            toggleBtn.textContent = isOpen ? "Открыть админку" : "Закрыть админку";
            if (!isOpen) renderAdminTable();
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", saveProduct);
    }

    // Инициализация админки
    if (localStorage.getItem("adminProducts")) {
        adminProducts = JSON.parse(localStorage.getItem("adminProducts"));
        products.length = 0;
        products.push(...adminProducts);
    }



});

let cart = JSON.parse(localStorage.getItem("cart")) || {};
let selectedTime = "";
let currentCategory = "all";

// ===== DOM REFS =====
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

const burgerMenu = document.getElementById("burgerMenu");
const navMenu = document.getElementById("navMenu");

// ===== BURGER =====
burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("active");
    navMenu.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        burgerMenu.classList.remove("active");
        navMenu.classList.remove("open");
    });
});

// ===== RENDER PRODUCTS =====
function renderProducts(category = "all") {
    const filtered = category === "all"
        ? products
        : products.filter(p => p.category === category);

    productsContainer.innerHTML = filtered.map(product => {
        let statusHTML = '';
        if (product.status === 'in_stock') {
            statusHTML = '<span class="status status-in">✅ Свежее</span>';
        } else if (product.status === 'low_stock') {
            statusHTML = '<span class="status status-low">🐔 Почти разобрали</span>';
        } else if (product.status === 'out_of_stock') {
            statusHTML = '<span class="status status-out">🌿 Сезон закончился</span>';
        } else if (product.status === 'seasonal') {
            statusHTML = '<span class="status status-seasonal">🌿 Сезонное</span>';
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

// ===== FILTERS =====
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        renderProducts(currentCategory);
    });
});

// ===== CART =====
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
    showToast("Товар добавлен ✅");
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
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCountEl.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
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
                <strong>${item.name}</strong>
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

cartButton.onclick = openCart;
closeCartButton.onclick = closeCart;
cartOverlay.onclick = closeCart;

// ===== DATES =====
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
    if (!select) return;

    select.innerHTML = '';
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Выберите дату';
    select.appendChild(empty);

    dates.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.toISOString().slice(0, 10);
        opt.textContent = formatDate(d);
        select.appendChild(opt);
    });

    if (select.options.length > 1) select.selectedIndex = 1;
}

// ===== TIME SLOTS =====
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

// ===== PHONE MASK =====
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

// ===== VALIDATION =====
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

// ===== TOAST =====
function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastEl.timer);
    toastEl.timer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2500);
}

// ===== ORDER =====
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

    const hasActiveOrder = localStorage.getItem("activeOrder");
    if (hasActiveOrder) {
        showToast("🌿 У вас уже есть активный заказ. Девчонки уже собирают!");
        return;
    }

    if (result.success) {
    showToast("✅ Заказ принят! Девчонки уже собирают.");
    localStorage.setItem("activeOrder", JSON.stringify({
        id: Date.now(),
        date: new Date().toISOString()
    }));
    cart = {};
    updateCart();
    orderModal.classList.remove("open");
    resetOrderForm();
}

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
            showToast("✅ Заказ отправлен!");
            cart = {};
            updateCart();
            orderModal.classList.remove("open");
            resetOrderForm();
        } else {
            showToast("❌ Ошибка отправки");
        }
    } catch (e) {
        showToast("❌ Сервер недоступен");
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

// ===== PHOTO LIGHTBOX =====
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

// ===== TODAY DATE =====
function updateTodayDate() {
    const el = document.getElementById('todayDate');
    if (!el) return;
    const now = new Date();
    const days = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
    const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    el.textContent = `${now.getDate()} ${months[now.getMonth()]}, ${days[now.getDay()]}`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCart();
    populateDeliveryDates();
    updateTodayDate();
    console.log('✅ KIREEFFarm загружен!');
});

// ===== КАРТА ЗАКАЗОВ =====
let mapInstance = null;
let markers = [];

function initMap() {
    // Это временная заглушка, пока нет ключа
    console.log("⏳ Ожидание ключа Яндекс Карт...");

    // Проверяем, загрузилась ли Яндекс Карта
    if (typeof ymaps === 'undefined') {
        console.warn("⚠️ Яндекс Карты не загружены. Проверь ключ API.");
        return;
    }

    ymaps.ready(function() {
        // Создаем карту с центром на Бийске
        mapInstance = new ymaps.Map('map', {
            center: [52.5385, 85.2060],
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl']
        });

        // Загружаем заказы
        loadOrdersOnMap();
    });
}

function loadOrdersOnMap() {
    if (!mapInstance) return;

    // Очищаем старые метки
    markers.forEach(marker => mapInstance.geoObjects.remove(marker));
    markers = [];

    // Получаем заказы из localStorage (временное хранилище)
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Если заказов нет — показываем тестовую метку
    if (orders.length === 0) {
        addTestMarker();
        return;
    }

    // Добавляем метки для каждого заказа
    orders.forEach(order => {
        if (order.lat && order.lng) {
            const color = getColorBySlot(order.slot);
            addMarker(order.lat, order.lng, order.customer.name, color, order.id);
        }
    });
}

function addMarker(lat, lng, name, color, orderId) {
    if (!mapInstance) return;

    const marker = new ymaps.Placemark(
        [lat, lng],
        {
            balloonContent: `
                <strong>${name}</strong><br>
                Заказ #${orderId}<br>
                <button onclick="cancelOrder(${orderId})" style="margin-top:8px; padding:4px 12px; border:none; background:#f44336; color:white; border-radius:6px; cursor:pointer;">
                    ❌ Отменить заказ
                </button>
            `,
            iconCaption: name
        },
        {
            preset: 'islands#circleIcon',
            iconColor: color,
            iconCaptionMaxWidth: 200,
            balloonCloseButton: true,
            hideIconOnBalloonOpen: false,
            balloonPanelMaxMapArea: 0
        }
    );

    mapInstance.geoObjects.add(marker);
    markers.push(marker);

    // Если это первая метка — центрируем карту на ней
    if (markers.length === 1) {
        mapInstance.setCenter([lat, lng], 13);
    }
}

function getColorBySlot(slot) {
    if (!slot) return '#FFC107'; // желтый по умолчанию

    if (slot.includes('11:00')) return '#4CAF50';  // зеленый
    if (slot.includes('15:00')) return '#FFC107';  // желтый
    if (slot.includes('19:00')) return '#F44336';  // красный

    return '#FFC107';
}

function addTestMarker() {
    if (!mapInstance) return;

    // Тестовые метки для Бийска
    const testOrders = [
        { lat: 52.5385, lng: 85.2060, name: "Тестовый заказ #1", slot: "11:00–15:00", id: 1 },
        { lat: 52.5485, lng: 85.2160, name: "Тестовый заказ #2", slot: "15:00–19:00", id: 2 },
        { lat: 52.5285, lng: 85.1960, name: "Тестовый заказ #3", slot: "19:00–23:00", id: 3 },
    ];

    testOrders.forEach(order => {
        const color = getColorBySlot(order.slot);
        addMarker(order.lat, order.lng, order.name, color, order.id);
    });

    // Центрируем карту
    mapInstance.setCenter([52.5385, 85.2060], 13);
}

// Функция отмены заказа
function cancelOrder(orderId) {
    if (!confirm(`Отменить заказ #${orderId}?`)) return;

    // Удаляем из хранилища
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Обновляем карту
    loadOrdersOnMap();

    // Отправляем уведомление в Telegram (опционально)
    showToast(`❌ Заказ #${orderId} отменён`);
}

// Сохранение заказа с координатами (вызывается при оформлении)
function saveOrderWithCoords(orderData) {
    // Получаем координаты из адреса (заглушка, потом заменим на геокодер)
    // Пока ставим случайные координаты в центре Бийска
    const lat = 52.5385 + (Math.random() - 0.5) * 0.02;
    const lng = 85.2060 + (Math.random() - 0.5) * 0.02;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
        ...orderData,
        id: Date.now(),
        lat: lat,
        lng: lng,
        created_at: new Date().toISOString()
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Обновляем карту, если она открыта
    if (mapInstance) {
        loadOrdersOnMap();
    }
}

// Загружаем карту при открытии админки
document.addEventListener('DOMContentLoaded', function() {
    // Наблюдаем за открытием админки
    const toggleBtn = document.getElementById('adminToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            setTimeout(function() {
                // Если карта не инициализирована и Яндекс Карты загружены
                if (typeof ymaps !== 'undefined' && !mapInstance) {
                    initMap();
                }
            }, 500);
        });
    }
});

// Загружаем карту, если она уже видна при загрузке
setTimeout(function() {
    const mapContainer = document.getElementById('map');
    if (mapContainer && mapContainer.offsetParent !== null) {
        if (typeof ymaps !== 'undefined' && !mapInstance) {
            initMap();
        }
    }
}, 1000);

document.getElementById("cancelOrderBtn")?.addEventListener("click", function() {
    if (!confirm("Точно отменяем? Девчонки уже могли начать собирать.")) return;
    localStorage.removeItem("activeOrder");
    this.style.display = "none";
    showToast("🌿 Заказ отменён. Ждём вас снова!");
});

// ===== РЕДАКТИРОВАНИЕ ЗАКАЗА =====
document.getElementById("editOrderBtn")?.addEventListener("click", function() {
    const activeOrder = JSON.parse(localStorage.getItem("activeOrder"));
    if (!activeOrder) {
        showToast("🌿 Нет активного заказа для редактирования");
        return;
    }

    // Открываем модалку корзины с текущими товарами
    openCart();

    // Показываем уведомление
    showToast("✎ Измените корзину и оформите заказ заново");

    // После оформления — старый заказ заменяется новым
});

// ===== ОБНОВЛЯЕМ ОТПРАВКУ ЗАКАЗА (с поддержкой редактирования) =====
sendOrderButton.onclick = async () => {
    // Проверяем, есть ли активный заказ
    const existingOrder = localStorage.getItem("activeOrder");

    if (existingOrder) {
        // Если заказ есть — это редактирование
        if (!confirm("✎ Вы уже оформили заказ. Заменить его новым?")) {
            return;
        }
        // Удаляем старый заказ
        localStorage.removeItem("activeOrder");
    }

    if (!validateOrderForm()) {
        showToast("🌿 Что-то пропустили. Проверьте поля.");
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
            // Сохраняем заказ как активный
            localStorage.setItem("activeOrder", JSON.stringify({
                id: Date.now(),
                date: new Date().toISOString(),
                order: order
            }));

            showToast("✅ Заказ принят! Девчонки уже собирают.");
            cart = {};
            updateCart();
            orderModal.classList.remove("open");
            resetOrderForm();

            // Показываем кнопки управления заказом
            document.getElementById("cancelOrderBtn").style.display = "inline-block";
            document.getElementById("editOrderBtn").style.display = "inline-block";
        } else {
            showToast("❌ Что-то пошло не так. Попробуйте позже.");
        }
    } catch (e) {
        showToast("❌ Сервер недоступен. Попробуйте позже.");
    } finally {
        setSendButtonState(false);
    }
};

// ===== СЧЁТЧИК ПРОСМОТРОВ =====
(function trackVisit() {
    const key = 'kireeff_visits';
    let visits = parseInt(localStorage.getItem(key)) || 0;
    const today = new Date().toDateString();

    // Проверяем, был ли визит сегодня
    const lastVisit = localStorage.getItem('kireeff_last_visit');
    if (lastVisit !== today) {
        visits += 1;
        localStorage.setItem(key, visits);
        localStorage.setItem('kireeff_last_visit', today);
    }

    // Скрытый вывод в консоль (для тебя)
    console.log(`👀 KIREEFF просмотров за всё время: ${visits}`);

    // Можно вывести на сайт (скрыто, только для админа)
    const adminOnly = document.createElement('div');
    adminOnly.style.display = 'none';
    adminOnly.id = 'visitCounter';
    adminOnly.textContent = visits;
    document.body.appendChild(adminOnly);
})();

// Функция для получения числа просмотров (для админки)
function getVisits() {
    return parseInt(localStorage.getItem('kireeff_visits')) || 0;
}