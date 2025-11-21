// main.js
import { db, orderCollection, productCollection } from "./firebase.js";
import { getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Load Products from Firestore
async function loadProducts() {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    const snap = await getDocs(productCollection);
    productList.innerHTML = "";
    
    snap.forEach((doc) => {
        const p = doc.data();
        productList.innerHTML += `
        <div class="product-card">
            <img src="${p.image}" />
            <h3>${p.name}</h3>
            <p>${p.price} TK</p>
            <a href="product.html?id=${doc.id}" class="btn">View</a>
        </div>`;
    });
}
loadProducts();

// Load Single Product
async function loadSingleProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    const snap = await getDocs(productCollection);
    snap.forEach(doc => {
        if (doc.id === id) {
            const p = doc.data();
            document.getElementById("p-img").src = p.image;
            document.getElementById("p-name").innerText = p.name;
            document.getElementById("p-price").innerText = p.price + " TK";
            document.getElementById("buy-btn").onclick = () => addToCart(id, p);
        }
    });
}
loadSingleProduct();

// Add To Cart
function addToCart(id, product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ id, ...product });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to Cart!");
}

// Show Cart Items
function showCart() {
    const cartBox = document.getElementById("cart-items");
    if (!cartBox) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartBox.innerHTML = "";

    cart.forEach((item, i) => {
        cartBox.innerHTML += `
        <div class="cart-item">
            <img src="${item.image}">
            <h4>${item.name}</h4>
            <p>${item.price} TK</p>
            <button onclick="removeItem(${i})">Remove</button>
        </div>`;
    });
}
showCart();

window.removeItem = function(i) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
};

// Save Order to Firebase
window.placeOrder = async function () {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let cart = JSON.parse(localStorage.getItem("cart"));

    await addDoc(orderCollection, {
        name, phone, address,
        items: cart,
        time: new Date()
    });

    localStorage.removeItem("cart");
    alert("Order Placed!");
    window.location = "index.html";
};