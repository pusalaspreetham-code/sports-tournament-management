import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdDQcCjzrD9rTB84nZXTPQGYHBCamKIfU",
  authDomain: "sports-tournament-management.firebaseapp.com",
  projectId: "sports-tournament-management",
  storageBucket: "sports-tournament-management.firebasestorage.app",
  messagingSenderId: "498700560165",
  appId: "1:498700560165:web:b31e6b51b387378ff41ccc",
  measurementId: "G-FCVYXBYKNF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);