const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const openBtn = document.getElementById("openBtn");
const musicBtn = document.getElementById("musicBtn");
const cover = document.getElementById("cover");
const gift = document.getElementById("gift");

let giftData = null;

if (id) {
  try {
    giftData = JSON.parse(localStorage.getItem("gift_" + id));
  } catch (e) {
    console.error("خطأ بقراءة بيانات الهدية:", e);
  }
}

if (giftData) {
  const title = document.querySelector("#gift h2");
  const message = document.querySelector("#gift .message");
  const image = document.querySelector("#gift img");

  if (title && giftData.recipient) {
    title.textContent = "إلى " + giftData.recipient + " ❤️";
  }

  if (message) {
    message.textContent = giftData.message || "";
  }

  if (image && giftData.photo) {
    image.src = giftData.photo;
  }
}if (openBtn) {
  openBtn.addEventListener("click", () => {
    if (cover) {
      cover.classList.add("hidden");
    }

    if (gift) {
      gift.classList.remove("hidden");
    }
  });
}

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    console.log("زر الموسيقى");
  });
}
