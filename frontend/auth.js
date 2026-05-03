import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ================= REGISTER =================
window.register = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMsg("Please fill all fields", "error");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);

    // 🔥 THIS IS THE MISSING LINE
    await signOut(auth);

    showMsg("Registered successfully! Please login.", "success");

    document.getElementById("tab-login").click();

  } catch (err) {
    showMsg(err.message, "error");
  }
};

// ================= LOGIN =================
window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMsg("Please fill all fields", "error");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    showMsg("Login successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } catch (err) {
    showMsg(err.message, "error");
  }
};


// ================= GOOGLE LOGIN =================
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    const isNewUser = result._tokenResponse?.isNewUser;

    // 🔥 BLOCK NEW USERS
    if (isNewUser) {
      await signOut(auth);

      showMsg("Account not registered. Please register first.", "error");
      return;
    }

    // ✔ Existing user → allow
    window.location.href = "index.html";

  } catch (err) {
    showMsg(err.message, "error");
  }
};
// ================= MESSAGE UI =================
function showMsg(msg, type) {
  const el = document.getElementById("msg");
  if (!el) return;

  el.textContent = msg;
  el.className = "msg " + type;
  el.style.display = "block";
}