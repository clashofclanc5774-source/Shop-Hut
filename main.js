// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase config (use your own)
const firebaseConfig = {
  apiKey: "AIzaSyCDQy01MR2vRnYFZ0fE1zKvesusARWkmBg",
  authDomain: "online-shop-2da5a.firebaseapp.com",
  projectId: "online-shop-2da5a",
  storageBucket: "online-shop-2da5a.firebasestorage.app",
  messagingSenderId: "393993677310",
  appId: "1:393993677310:web:c75874ec5c758a1f9938af",
  measurementId: "G-DRNC3QVDSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get product list container
const productList = document.getElementById('product-list');

// Fetch products from Firestore
async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
            const product = doc.data();

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.imageURL}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <p>${product.description}</p>
            `;
            // Click to product detail page (future)
            card.addEventListener('click', () => {
                window.location.href = `product.html?id=${doc.id}`;
            });
            productList.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching products: ", error);
    }
}

loadProducts();