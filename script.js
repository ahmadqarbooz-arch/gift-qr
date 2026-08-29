const firebaseConfig = {
  apiKey: "AIzaSyCLdoOE3Acurp2JSUrnEJuba-ZQL953sbs",
  authDomain: "gift-qr-e2142.firebaseapp.com",
  projectId: "gift-qr-e2142",
  storageBucket: "gift-qr-e2142.firebasestorage.app",
  messagingSenderId: "679349583021",
  appId: "1:679349583021:web:fbfb21b5be3f62f12fda24"
};

let audio = null;

async function loadGift() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    const { initializeApp } =
      await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");

    const { getFirestore, doc, getDoc } =
      await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js");

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const giftDoc = await getDoc(doc(db, "gifts", id));

    if (!giftDoc.exists()) {
      console.error("Gift not found");
      return;
    }

    const data = giftDoc.data();

    const recipient = document.getElementById("recipient");
    const message = document.getElementById("messageText");
    const photo = document.querySelector(".photo-placeholder");

    if (recipient && data.recipient) {
      recipient.textContent = `إلى ${data.recipient} ❤️`;
    }

    if (message && data.message) {
      message.textContent = data.message;
    }

    if (photo && data.photo) {
      photo.innerHTML = `
        <img
          src="${data.photo}"
          alt="صورة الهدية"
          style="width:100%;height:100%;object-fit:cover;border-radius:20px"
        >
      `;
    }

  } catch (error) {
    console.error("Gift loading error:", error);
  }
}

function openGift() {
  const cover = document.getElementById("cover");
  const gift = document.getElementById("gift");

  if (cover) {
    cover.classList.add("hidden");
  }

  if (gift) {
    gift.classList.remove("hidden");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

const openBtn = document.getElementById("openGiftButton");

if (openBtn) {
  openBtn.addEventListener("click", openGift);
}

const musicBtn = document.getElementById("musicBtn");

if (musicBtn) {
  musicBtn.addEventListener("click", () => {

    if (!audio) {
      audio = new Audio(
        "https://cdn.pixabay.com/audio/2022/10/25/audio_946b7a0d2d.mp3"
      );

      audio.loop = true;
    }

    if (audio.paused) {
      audio.play().then(() => {
        musicBtn.textContent = "⏸️ إيقاف الموسيقى";
      }).catch(() => {
        alert("🎵 اضغط مرة ثانية للسماح بتشغيل الموسيقى");
      });
    } else {
      audio.pause();
      musicBtn.textContent = "🎵 تشغيل الموسيقى";
