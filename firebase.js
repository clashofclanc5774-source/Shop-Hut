// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { 
    getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your Firebase Configuration (YOUR OWN CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyCDQy01MR2vRnYFZ0fE1zKvesusARWkmBg",
  authDomain: "online-shop-2da5a.firebaseapp.com",
  projectId: "online-shop-2da5a",
  storageBucket: "online-shop-2da5a.firebasestorage.app",
  messagingSenderId: "393993677310",
  appId: "1:393993677310:web:c75874ec5c758a1f9938af",
  measurementId: "G-DRNC3QVDSY"
};

// Initialize App
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Firestore
export const db = getFirestore(app);
export const productCollection = collection(db, "products");
export const orderCollection = collection(db, "orders");

// Auth
export const auth = getAuth(app);

// Storage
export const storage = getStorage(app);