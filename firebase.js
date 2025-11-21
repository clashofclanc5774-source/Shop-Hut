// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);