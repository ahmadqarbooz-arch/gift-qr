const gift = document.getElementById("gift");
const openBtn = document.getElementById("openBtn");
const intro = document.getElementById("intro");
const card = document.getElementById("card");

function openGift() {
  intro.classList.add("hidden");
  card.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

gift.addEventListener("click", openGift);
gift.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openGift();
});
openBtn.addEventListener("click", openGift);

document.getElementById("musicBtn").addEventListener("click", () => {
  alert("الموسيقى سنربطها في الخطوة القادمة 🎵❤️");
});
