// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase config (same as main.js)
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

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const productDetail = document.getElementById('product-detail');

// Fetch product data from Firestore
async function loadProduct() {
    if (!productId) return;

    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const product = docSnap.data();

            productDetail.innerHTML = `
                <img src="${product.imageURL}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>$${product.price}</p>
                <p>${product.description}</p>
                <button id="add-to-cart">Add to Cart</button>
            `;

            // Add to cart functionality
            document.getElementById('add-to-cart').addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    imageURL: product.imageURL
                });
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Product added to cart!');
            });

        } else {
            productDetail.innerHTML = '<p>Product not found!</p>';
        }

    } catch (error) {
        console.error("Error fetching product: ", error);
    }
}

loadProduct();