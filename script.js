const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let giftData = null;

if (id) {
  try {
    giftData = JSON.parse(localStorage.getItem("gift_" + id));
  } catch (e) {
    console.error(e);
  }
}

const audio = new Audio(audioData);
audio.loop = true;
audio.volume = 0.55;

const openBtn = document.getElementById("openBtn");
const musicBtn = document.getElementById("musicBtn");
const cover = document.getElementById("cover");
const gift = document.getElementById("gift");

if (giftData) {
  const title = document.querySelector("#gift h2");
  const message = document.querySelector("#gift p");
  const image = document.querySelector("#gift img");

  if (title) {
    title.textContent = "إلى " + giftData.recipient;
  }

  if (message) {
    message.textContent = giftData.message;
  }

  if (image && giftData.photo) {
    image.src = giftData.photo;
  }
}openBtn.addEventListener("click", async () => {
  cover.classList.add("hidden");
  gift.classList.remove("hidden");

  try {
    await audio.play();
    musicBtn.textContent = "🔊 إيقاف الموسيقى";
  } catch (e) {
    musicBtn.textContent = "🎵 تشغيل الموسيقى";
  }
});

musicBtn.addEventListener("click", async () => {
  if (audio.paused) {
    await audio.play();
    musicBtn.textContent = "🔊 إيقاف الموسيقى";
  } else {
    audio.pause();
    musicBtn.textContent = "🎵 تشغيل الموسيقى";
  }
});
