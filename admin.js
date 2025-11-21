// admin.js
import { auth, db, storage, productsRefName, ordersRefName } from "./firebase.js";
import {
  signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, getDocs, addDoc, doc, deleteDoc, updateDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* Helpers */
function qSel(id){ return document.getElementById(id); }
function requireAuthRedirect() {
  // if not authenticated -> go to login
  onAuthStateChanged(auth, user=>{
    if (!user) location.href = "admin-login.html";
  });
}

/* Login page */
const loginBtn = qSel("adminLoginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async ()=>{
    const email = qSel("adminEmail").value.trim();
    const pass = qSel("adminPass").value.trim();
    if (!email || !pass) { alert("Enter credentials"); return; }
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      location.href = "admin-dashboard.html";
    } catch (e) {
      console.error(e);
      alert("Login failed: " + (e.message || e));
    }
  });
}

/* Logout (on admin pages) */
const logoutBtns = document.querySelectorAll("#logoutBtn, #logoutBtnTop, #logoutBtnTop2");
logoutBtns.forEach(b=>{
  if (!b) return;
  b.addEventListener("click", async ()=>{
    await signOut(auth);
    location.href = "admin-login.html";
  });
});

/* Admin dashboard protect */
if (location.pathname.includes("admin-dashboard.html")) {
  onAuthStateChanged(auth, user=>{
    if (!user) location.href = "admin-login.html";
    // else fine
  });
}

/* Products: add, list, edit, delete */
if (location.pathname.includes("admin-products.html")) {
  onAuthStateChanged(auth, async user=>{
    if (!user) { location.href = "admin-login.html"; return; }
    const addBtn = qSel("addProductBtn");
    const pname = qSel("pName");
    const pprice = qSel("pPrice");
    const pdesc = qSel("pDesc");
    const pimage = qSel("pImage");
    const productsList = qSel("productsList");

    async function loadProducts() {
      productsList.innerHTML = "";
      const snap = await getDocs(collection(db, productsRefName));
      snap.forEach(docSnap=>{
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

      // attach listeners
      document.querySelectorAll(".delete-btn").forEach(b=>{
        b.addEventListener("click", async ()=>{
          const id = b.dataset.id;
          if (!confirm("Delete product?")) return;
          await deleteDoc(doc(db, productsRefName, id));
          loadProducts();
        });
      });

      document.querySelectorAll(".edit-btn").forEach(b=>{
        b.addEventListener("click", async ()=>{
          const id = b.dataset.id;
          const docSnap = await getDoc(doc(db, productsRefName, id));
          if (!docSnap.exists()) return alert("Missing");
          const p = { id: docSnap.id, ...docSnap.data() };
          // prefill fields, then delete original to simplify edit flow
          pname.value = p.name;
          pprice.value = p.price;
          pdesc.value = p.description || "";
          // store editing id on add button
          addBtn.dataset.editing = p.id;
          addBtn.textContent = "Save Changes";
          window.scrollTo({top:0,behavior:"smooth"});
        });
      });
    }

    addBtn.addEventListener("click", async ()=>{
      const name = pname.value.trim();
      const price = pprice.value.trim();
      const desc = pdesc.value.trim();
      const file = pimage.files[0];

      if (!name || !price) { alert("Name & price required"); return; }

      try {
        let imageUrl = "";
        if (file) {
          // upload
          const storageRef = sRef(storage, `products/${Date.now()}_${file.name}`);
          const snap = await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(snap.ref);
        } else {
          // default placeholder if no image uploaded
          imageUrl = "https://via.placeholder.com/600x400?text=No+Image";
        }

        if (addBtn.dataset.editing) {
          // update existing
          const id = addBtn.dataset.editing;
          const docRef = doc(db, productsRefName, id);
          await updateDoc(docRef, { name, price, description: desc, image: imageUrl });
          delete addBtn.dataset.editing;
          addBtn.textContent = "Add Product";
        } else {
          await addDoc(collection(db, productsRefName), { name, price, description: desc, image: imageUrl });
        }

        pname.value = ""; pprice.value = ""; pdesc.value = ""; pimage.value = "";
        loadProducts();
      } catch (e) {
        console.error(e); alert("Product add/update failed");
      }
    });

    // initial load
    loadProducts();
  });
}

/* Orders: list */
if (location.pathname.includes("admin-orders.html")) {
  onAuthStateChanged(auth, async user=>{
    if (!user) { location.href = "admin-login.html"; return; }
    const ordersList = qSel("ordersList");
    async function loadOrders() {
      ordersList.innerHTML = "";
      const snap = await getDocs(collection(db, ordersRefName));
      snap.forEach(docSnap=>{
        const o = { id: docSnap.id, ...docSnap.data() };
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <h3>Order: ${o.id}</h3>
          <div class="small">Name: ${o.name} · Phone: ${o.phone}</div>
          <div class="small">Address: ${o.address}</div>
          <div class="small">Placed: ${o.createdAt || o.time || '—'}</div>
          <div style="margin-top:8px">
            ${ (o.items||[]).map(it=>`<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
              <img src="${it.image}" style="width:48px;height:48px;object-fit:cover;border-radius:6px">
              <div>
                <div style="font-weight:600">${it.name}</div>
                <div class="small">${it.price} TK</div>
              </div>
            </div>`).join("")}
          </div>
        `;
        ordersList.appendChild(div);
      });
    }
    loadOrders();
  });
}
import { db, storage, productCollection } from "./firebase.js";
import {
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ADD PRODUCT
document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let file = document.getElementById("productImage").files[0];

    if (!file) {
        alert("Please select an image!");
        return;
    }

    // Upload image to Firebase Storage
    const imageRef = ref(storage, "product-images/" + file.name);

    await uploadBytes(imageRef, file);

    let imageURL = await getDownloadURL(imageRef);

    // Save product to Firestore
    await addDoc(productCollection, {
        name: name,
        price: Number(price),
        image: imageURL,
        createdAt: Date.now()
    });

    alert("Product Added Successfully!");
    document.getElementById("productForm").reset();
});