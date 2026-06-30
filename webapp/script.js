let cart = {};
const products = [

{
    id: 1,
    name: "Домашняя колбаса",
    weight: "2 кг",
    price: 450,
    image: "images/products/placeholder.jpg"
},

{
    id: 2,
    name: "Сало домашнее",
    weight: "1 кг",
    price: 650,
    image: "images/products/placeholder.jpg"
},

{
    id: 3,
    name: "Копчёная грудинка",
    weight: "1 кг",
    price: 720,
    image: "images/products/placeholder.jpg"
},

{
    id: 4,
    name: "Домашние сосиски",
    weight: "1 кг",
    price: 580,
    image: "images/products/placeholder.jpg"
},

{
    id: 5,
    name: "Пельмени",
    weight: "1 кг",
    price: 430,
    image: "images/products/placeholder.jpg"
},

{
    id: 6,
    name: "Фарш",
    weight: "1 кг",
    price: 390,
    image: "images/products/placeholder.jpg"
},

{
    id: 7,
    name: "Тушёнка",
    weight: "500 г",
    price: 320,
    image: "images/products/placeholder.jpg"
},

{
    id: 8,
    name: "Домашние яйца",
    weight: "10 шт",
    price: 180,
    image: "images/products/placeholder.jpg"
}

];

const productsContainer = document.getElementById("products");

products.forEach(product => {

productsContainer.innerHTML += `

<div class="product-card">

<div class="product-image">

<img src="${product.image}" alt="${product.name}">

</div>

<div class="product-info">

<h4>${product.name}</h4>

<p>${product.weight}</p>

<div class="price-row">

<span class="price">

${product.price} ₽

</span>

<button onclick="addToCart(${product.id})">

+

</button>

</div>

</div>

</div>

`;

});

function addToCart(id) {

    if (cart[id]) {

        cart[id].quantity++;

    } else {

        const product = products.find(item => item.id === id);

        cart[id] = {

            ...product,

            quantity: 1

        };

    }

    updateCart();

}

function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const items = Object.values(cart);

    cartCount.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
);

cartTotal.textContent = `${total} ₽`;

    if (items.length === 0) {

        cartItems.innerHTML = "<p>Корзина пуста</p>";

        cartTotal.textContent = "0 ₽";
        return;

    }

    cartItems.innerHTML = "";

    items.forEach(item => {

        cartItems.innerHTML += `

        <div class="cart-item">

            <strong>${item.name}</strong><br>

            <div class="cart-controls">

<button onclick="decreaseQuantity(${item.id})">−</button>

<span>${item.quantity}</span>

<button onclick="increaseQuantity(${item.id})">+</button>

</div>

<div class="cart-price">

${item.price * item.quantity} ₽

</div>

        </div>

        `;

    });

}

const cartButton = document.getElementById("cartButton");

const cartPanel = document.getElementById("cartPanel");

const closeCart = document.getElementById("closeCart");

cartButton.onclick = () => {

    cartPanel.classList.add("open");

};

closeCart.onclick = () => {

    cartPanel.classList.remove("open");

};

function increaseQuantity(id){

    cart[id].quantity++;

    updateCart();

}

function decreaseQuantity(id){

    cart[id].quantity--;

    if(cart[id].quantity <= 0){

        delete cart[id];

    }

    updateCart();

}

const checkoutButton = document.getElementById("checkoutButton");
const orderModal = document.getElementById("orderModal");

checkoutButton.onclick = () => {

    if(Object.keys(cart).length === 0){

        alert("Корзина пуста");

        return;

    }

    orderModal.classList.add("open");

};