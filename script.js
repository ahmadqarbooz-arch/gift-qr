import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLdoOE3Acurp2JSUrnEJuba-ZQL953sbs",
  authDomain: "gift-qr-e2142.firebaseapp.com",
  projectId: "gift-qr-e2142",
  storageBucket: "gift-qr-e2142.firebasestorage.app",
  messagingSenderId: "679349583021",
  appId: "1:679349583021:web:fbfb21b5be3f62f12fda24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loadingScreen = document.getElementById("loadingScreen");
const errorScreen = document.getElementById("errorScreen");
const errorMessage = document.getElementById("errorMessage");
const giftPage = document.getElementById("giftPage");
const cover = document.getElementById("cover");
const gift = document.getElementById("gift");
const openButton = document.getElementById("openGiftButton");
const recipient = document.getElementById("recipient");
const messageText = document.getElementById("messageText");
const photoContainer = document.getElementById("photoContainer");

function showError(message) {
  loadingScreen.classList.add("hidden");
  giftPage.classList.add("hidden");
  errorMessage.textContent = message;
  errorScreen.classList.remove("hidden");
}

async function loadGift() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      showError("رابط الهدية غير مكتمل.");
      return;
    }

    const giftRef = doc(db, "gifts", id);
    const giftSnap = await getDoc(giftRef);

    if (!giftSnap.exists()) {
      showError("لم نتمكن من العثور على هذه الهدية.");
      return;
    }

    const data = giftSnap.data();

    recipient.textContent = data.recipient || "إلك ❤️";
    messageText.textContent = data.message || "";

    if (data.photo) {
      photoContainer.innerHTML = "";
      const img = document.createElement("img");
      img.src = data.photo;
      img.alt = "صورة الهدية";
      photoContainer.appendChild(img);
    }

    loadingScreen.classList.add("hidden");
    giftPage.classList.remove("hidden");

  } catch (error) {
    console.error("Gift loading error:", error);
    showError("حدث خطأ أثناء تحميل الهدية.");
  }
}

function openGift() {
  cover.classList.add("hidden");
  gift.classList.remove("hidden");
}

openButton.addEventListener("click", openGift);

loadGift();
