// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDQy01MR2vRnYFZ0fE1zKvesusARWkmBg",
  authDomain: "online-shop-2da5a.firebaseapp.com",
  projectId: "online-shop-2da5a",
  storageBucket: "online-shop-2da5a.appspot.com",
  messagingSenderId: "393993677310",
  appId: "1:393993677310:web:c75874ec5c758a1f9938af",
  measurementId: "G-DRNC3QVDSY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Collections
export const productCollection = collection(db, "products");
export const orderCollection = collection(db, "orders");