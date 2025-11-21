import { productCollection } from "./firebase.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const productListEl = document.getElementById("productList");

async function loadProducts() {
  if (!productListEl) return;

  productListEl.innerHTML = "Loading products...";

  try {
    const snap = await getDocs(productCollection);
    if (snap.empty) {
      productListEl.innerHTML = "<p>No products found.</p>";
      return;
    }

    productListEl.innerHTML = "";
    snap.forEach(doc => {
      const p = { id: doc.id, ...doc.data() };
      const div = document.createElement("div");
      div.className = "card product-card";
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.price} TK</p>
        <div style="display:flex;gap:8px">
          <a class="btn" href="product.html?id=${p.id}">View</a>
          <button class="button-ghost add-btn" data-id="${p.id}">Add</button>
        </div>
      `;
      productListEl.appendChild(div);

      div.querySelector(".add-btn").addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push({ id: p.id, name: p.name, price: p.price, image: p.image });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Added to cart");
      });
    });
  } catch (e) {
    console.error(e);
    productListEl.innerHTML = "<p>Error loading products.</p>";
  }
}

loadProducts();