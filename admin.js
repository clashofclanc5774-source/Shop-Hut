// ===========================
// Imports
// ===========================
import { auth, db, storage, productCollection, orderCollection } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection, getDocs, addDoc, doc, deleteDoc, updateDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ===========================
// Helper
// ===========================
const $ = id => document.getElementById(id);

// Redirect if not logged in
function requireAuthRedirect() {
  onAuthStateChanged(auth, user => {
    if (!user) location.href = "admin-login.html";
  });
}

// ===========================
// Login
// ===========================
const loginBtn = $("adminLoginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = $("adminEmail").value.trim();
    const pass = $("adminPass").value.trim();
    if (!email || !pass) return alert("Enter credentials");

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      location.href = "admin-dashboard.html";
    } catch (e) {
      console.error(e);
      alert("Login failed: " + (e.message || e));
    }
  });
}

// ===========================
// Logout
// ===========================
document.querySelectorAll("#logoutBtn, #logoutBtnTop, #logoutBtnTop2").forEach(b => {
  if (!b) return;
  b.addEventListener("click", async () => {
    await signOut(auth);
    location.href = "admin-login.html";
  });
});

// ===========================
// Admin Dashboard Protect
// ===========================
if (location.pathname.includes("admin-dashboard.html")) requireAuthRedirect();

// ===========================
// Admin Products Page
// ===========================
if (location.pathname.includes("admin-products.html")) {
  requireAuthRedirect();

  const addBtn = $("addProductBtn");
  const pname = $("pName");
  const pprice = $("pPrice");
  const pdesc = $("pDesc");
  const pimage = $("pImage");
  const productsList = $("productsList");

  // Load Products
  async function loadProducts() {
    productsList.innerHTML = "";
    const snap = await getDocs(productCollection);
    snap.forEach(docSnap => {
      const p = { id: docSnap.id, ...docSnap.data() };
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          <img src="${p.image}" style="width:80px;height:80px;object-fit:cover;border-radius:8px">
          <div style="flex:1">
            <h3 style="margin:0">${p.name}</h3>
            <div class="small">${p.price} TK</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="button-ghost edit-btn" data-id="${p.id}">Edit</button>
            <button class="btn delete-btn" data-id="${p.id}">Delete</button>
          </div>
        </div>
      `;
      productsList.appendChild(div);
    });

    // Attach delete buttons
    document.querySelectorAll(".delete-btn").forEach(b => {
      b.addEventListener("click", async () => {
        if (!confirm("Delete product?")) return;
        await deleteDoc(doc(productCollection.firestore, "products", b.dataset.id));
        loadProducts();
      });
    });

    // Attach edit buttons
    document.querySelectorAll(".edit-btn").forEach(b => {
      b.addEventListener("click", async () => {
        const docSnap = await getDoc(doc(productCollection.firestore, "products", b.dataset.id));
        if (!docSnap.exists()) return alert("Missing product");
        const p = { id: docSnap.id, ...docSnap.data() };
        pname.value = p.name;
        pprice.value = p.price;
        pdesc.value = p.description || "";
        addBtn.dataset.editing = p.id;
        addBtn.textContent = "Save Changes";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  // Add / Edit Product
  addBtn.addEventListener("click", async () => {
    const name = pname.value.trim();
    const price = pprice.value.trim();
    const desc = pdesc.value.trim();
    const file = pimage.files[0];

    if (!name || !price) return alert("Name & price required");

    try {
      let imageUrl = "https://via.placeholder.com/600x400?text=No+Image";
      if (file) {
        const storageRef = sRef(storage, `products/${Date.now()}_${file.name}`);
        const snap = await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(snap.ref);
      }

      if (addBtn.dataset.editing) {
        // update existing
        await updateDoc(doc(productCollection.firestore, "products", addBtn.dataset.editing), {
          name, price, description: desc, image: imageUrl
        });
        delete addBtn.dataset.editing;
        addBtn.textContent = "Add Product";
      } else {
        await addDoc(productCollection, { name, price, description: desc, image: imageUrl, createdAt: Date.now() });
      }

      pname.value = ""; pprice.value = ""; pdesc.value = ""; pimage.value = "";
      loadProducts();
    } catch (e) {
      console.error(e);
      alert("Product add/update failed");
    }
  });

  // Initial load
  loadProducts();
}

// ===========================
// Admin Orders Page
// ===========================
if (location.pathname.includes("admin-orders.html")) {
  requireAuthRedirect();
  const ordersList = $("ordersList");

  async function loadOrders() {
    ordersList.innerHTML = "";
    const snap = await getDocs(orderCollection);
    snap.forEach(docSnap => {
      const o = { id: docSnap.id, ...docSnap.data() };
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>Order: ${o.id}</h3>
        <div class="small">Name: ${o.name} · Phone: ${o.phone}</div>
        <div class="small">Address: ${o.address}</div>
        <div class="small">Placed: ${o.createdAt || o.time || '—'}</div>
        <div style="margin-top:8px">
          ${(o.items || []).map(it => `
            <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
              <img src="${it.image}" style="width:48px;height:48px;object-fit:cover;border-radius:6px">
              <div>
                <div style="font-weight:600">${it.name}</div>
                <div class="small">${it.price} TK</div>
              </div>
            </div>
          `).join("")}
        </div>
      `;
      ordersList.appendChild(div);
    });
  }

  loadOrders();
}