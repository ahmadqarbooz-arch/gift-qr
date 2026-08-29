const gift = document.getElementById("gift");
const openBtn = document.getElementById("openBtn");
const intro = document.getElementById("cover");
const card = document.getElementById("gift");

function openGift() {
  if (intro) {
    intro.classList.add("hidden");
  }

  if (card) {
    card.classList.remove("hidden");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function loadGift() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("gift");

  if (!encoded) {
    return;
  }

  try {
    const json = decodeURIComponent(atob(encoded));
    const data = JSON.parse(json);

    const recipient = document.getElementById("recipient");
    const message = document.getElementById("messageText");
    const photo = document.querySelector(".memory");

    if (recipient) {
      recipient.textContent = "إلى " + data.recipient;
    }

    if (message) {
      message.innerHTML = data.message;
    }

    if (photo && data.photo) {
      photo.src = data.photo;
    }

  } catch (error) {
    console.error("Gift loading error:", error);
  }
}

if (openBtn) {
  openBtn.addEventListener("click", openGift);
}

if (gift) {
  gift.addEventListener("click", openGift);

  gift.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      openGift();
    }
  });
}

const musicBtn = document.getElementById("musicBtn");

let audio = null;

if (musicBtn) {
  musicBtn.addEventListener("click", () => {

    if (!audio) {
      audio = new Audio(
        "https://cdn.pixabay.com/audio/2022/10/25/audio_946b"
      );

      audio.loop = true;
    }

    if (audio.paused) {
      audio.play()
        .then(() => {
          musicBtn.textContent = "⏸️ إيقاف الموسيقى";
        })
        .catch(() => {
          alert("اضغط مرة ثانية لتشغيل الموسيقى 🎵");
        });
    } else {
      audio.pause();
      musicBtn.textContent = "🎵 تشغيل الموسيقى";
    }

  });
}

loadGift();
