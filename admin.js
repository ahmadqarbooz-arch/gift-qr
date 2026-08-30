import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
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

const form = document.getElementById("giftForm");
const recipientInput = document.getElementById("recipient");
const messageInput = document.getElementById("message");
const photoInput = document.getElementById("photo");
const createButton = document.getElementById("createGiftButton");
const result = document.getElementById("result");
const giftLink = document.getElementById("giftLink");
const copyButton = document.getElementById("copyLinkButton");
const openLink = document.getElementById("openGiftLink");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  createButton.disabled = true;
  createButton.textContent = "جاري إنشاء الهدية...";

  try {
    const recipient = recipientInput.value.trim();
    const message = messageInput.value.trim();

    let photo = "";

    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];

      if (file.size > 800000) {
        throw new Error("حجم الصورة كبير جدًا. اختر صورة أصغر من 800KB.");
      }

      photo = await fileToBase64(file);
    }

    const giftData = {
      recipient,
      message,
      photo,
      createdAt: new Date().toISOString()
    };

    const giftRef = await addDoc(
      collection(db, "gifts"),
      giftData
    );

    const url =
      `${window.location.origin}${window.location.pathname.replace("admin.html", "index.html")}?id=${giftRef.id}`;

    giftLink.textContent = url;
    openLink.href = url;

    result.classList.remove("hidden");

    form.reset();

  } catch (error) {
    console.error(error);
    alert(error.message || "حدث خطأ أثناء إنشاء الهدية.");

  } finally {
    createButton.disabled = false;
    createButton.textContent = "إنشاء الهدية 🎁";
  }
});

copyButton.addEventListener("click", async () => {
  const url = giftLink.textContent;

  try {
    await navigator.clipboard.writeText(url);
    copyButton.textContent = "تم نسخ الرابط ✅";

    setTimeout(() => {
      copyButton.textContent = "📋 نسخ الرابط";
    }, 2000);

  } catch {
    alert("تعذر نسخ الرابط. انسخه يدويًا.");
  }
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(
      new Error("تعذر قراءة الصورة.")
    );

    reader.readAsDataURL(file);
  });
}
