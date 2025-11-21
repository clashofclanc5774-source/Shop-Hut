// main.js
import { db, productsRefName, ordersRefName } from "./firebase.js";
import {
  collection, getDocs, doc, getDoc, query, where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productListEl = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const cartCountEl = document.getElementById("cartCount");

function readLocalCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function writeLocalCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const c = readLocalCart().length;
  if (cartCountEl) cartCountEl.textContent = c;
}
updateCartCount();

async function renderProducts(products) {
  if (!productListEl) return;
  productListEl.innerHTML = "";
  products.forEach(p => {
    const el = document.createElement("div");
    el.className = "card product-card";
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price} TK</p>
      <div style="display:flex;gap:8px">
        <a class="btn" href="product.html?id=${p.id}">View</a>
        <button class="button-ghost" data-id="${p.id}">Add</button>
      </div>
    `;
    productListEl.appendChild(el);
  });

  // attach add buttons
  document.querySelectorAll(".button-ghost[data-id]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const id = btn.getAttribute("data-id");
      const p = products.find(x=>x.id===id);
      const cart = readLocalCart();
      cart.push({ id:p.id, name:p.name, price:p.price, image:p.image });
      writeLocalCart(cart);
      alert("Added to cart");
    });
  });
}

async function loadAndShowProducts() {
  const q = collection(db, productsRefName);
  const snap = await getDocs(q);
  const products = [];
  snap.forEach(doc=>products.push({ id: doc.id, ...doc.data() }));
  renderProducts(products);
}
if (productListEl) loadAndShowProducts();

if (searchInput) {
  searchInput.addEventListener("input", async ()=>{
    const term = searchInput.value.trim().toLowerCase();
    // simple client-side filter: re-fetch and filter
    const q = collection(db, productsRefName);
    const snap = await getDocs(q);
    const products = [];
    snap.forEach(doc=>products.push({ id: doc.id, ...doc.data() }));
    const filtered = products.filter(p=>p.name.toLowerCase().includes(term) || (p.description||"").toLowerCase().includes(term));
    renderProducts(filtered);
  });
}

/* Single product page */
async function loadSingleProduct() {
  const area = document.getElementById("productArea");
  if (!area) return;
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) { area.textContent = "Product ID missing"; return; }
  const docRef = doc(db, productsRefName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) { area.textContent = "Not found"; return; }
  const p = { id: docSnap.id, ...docSnap.data() };
  area.innerHTML = `
    <img src="${p.image}" alt="${p.name}">
    <h2>${p.name}</h2>
    <p class="small">${p.description || ""}</p>
    <h3>${p.price} TK</h3>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button id="addBtn" class="btn">Add to Cart</button>
      <a href="cart.html" class="button-ghost">View Cart</a>
    </div>
  `;
  document.getElementById("addBtn").onclick = ()=>{
    const cart = readLocalCart();
    cart.push({ id:p.id, name:p.name, price:p.price, image:p.image });
    writeLocalCart(cart);
    alert("Added to cart");
  };
}
loadSingleProduct();

/* Cart page rendering */
function renderCartPage(){
  const area = document.getElementById("cartItems");
  if (!area) return;
  const cart = readLocalCart();
  area.innerHTML = "";
  if (!cart.length) { area.innerHTML = '<div class="card center">Your cart is empty</div>'; document.getElementById("cartSummary")?.style.display = "none"; return; }
  cart.forEach((it, idx)=>{
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${it.image}" style="width:80px;height:80px;border-radius:10px;object-fit:cover">
        <div style="flex:1">
          <h3 style="margin:0">${it.name}</h3>
          <div class="small">${it.price} TK</div>
        </div>
        <div>
          <button class="button-ghost remove-btn" data-idx="${idx}">Remove</button>
        </div>
      </div>
    `;
    area.appendChild(div);
  });
  document.querySelectorAll(".remove-btn").forEach(b=>{
    b.addEventListener("click", ()=>{
      const i = parseInt(b.dataset.idx);
      const c = readLocalCart();
      c.splice(i,1);
      writeLocalCart(c);
      renderCartPage();
    });
  });
  const total = cart.reduce((s,a)=>s+Number(a.price||0),0);
  document.getElementById("totalText").innerText = `Total: ${total} TK`;
  document.getElementById("cartSummary").style.display = "block";
}
renderCartPage();

/* Checkout handling */
const placeOrderBtn = document.getElementById("placeOrderBtn");
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", async ()=>{
    const name = document.getElementById("cName").value.trim();
    const phone = document.getElementById("cPhone").value.trim();
    const address = document.getElementById("cAddress").value.trim();
    const cart = readLocalCart();
    if (!name || !phone || !address) { alert("Fill all fields"); return; }
    if (!cart.length) { alert("Cart empty"); return; }

    // Save order to Firestore
    const { addDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
    const ordersCol = collection(db, ordersRefName);
    try {
      await addDoc(ordersCol, {
        name, phone, address, items: cart, createdAt: new Date().toISOString()
      });
      localStorage.removeItem("cart");
      updateCartCount();
      alert("Order placed! Thank you.");
      location.href = "index.html";
    } catch (e) {
      console.error(e);
      alert("Order failed. Try again.");
    }
  });
}

/* Init for all pages */
(function init(){
  updateCartCount();
  renderCartPage();
})();