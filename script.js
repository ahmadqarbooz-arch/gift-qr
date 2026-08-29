const gift = document.getElementById("gift");
const openBtn = document.getElementById("openBtn");
const intro = document.getElementById("cover");
const card = document.getElementById("gift");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let audio = null;


// تحميل بيانات الهدية
function loadGift() {
    if (!id) return;

    const raw = localStorage.getItem("gift_" + id);

    if (!raw) return;

    try {
        const data = JSON.parse(raw);

        const recipient = document.getElementById("recipient");
        const messageText = document.getElementById("messageText");
        const photo = document.querySelector(".photo-placeholder");

        if (recipient && data.recipient) {
            recipient.textContent = "إلى " + data.recipient + " ❤️";
        }

        if (messageText && data.message) {
            messageText.textContent = data.message;
        }

        if (photo && data.photo) {
            photo.innerHTML =
                '<img src="' +
                data.photo +
                '" alt="صورة الهدية" style="width:100%;height:100%;object-fit:cover;">';
        }

    } catch (error) {
        console.log("خطأ في بيانات الهدية:", error);
    }
}


// فتح الهدية
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


// زر فتح الهدية
if (openBtn) {
    openBtn.addEventListener("click", function () {
        openGift();
    });
}


// فتح الهدية بالضغط على Enter أو Space
if (openBtn) {
    openBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openGift();
        }
    });
}


// تشغيل الموسيقى
const musicBtn = document.getElementById("musicBtn");

if (musicBtn) {
    musicBtn.addEventListener("click", function () {

        if (!audio) {
            audio = new Audio(
                "https://cdn.pixabay.com/audio/2022/10/25/audio_946b7a0d2d.mp3"
            );

            audio.loop = true;
        }

        if (audio.paused) {
            audio.play()
                .then(function () {
                    musicBtn.textContent = "⏸️ إيقاف الموسيقى";
                })
                .catch(function () {
                    alert("اضغط مرة ثانية للسماح بتشغيل الموسيقى 🎵");
                });

        } else {
            audio.pause();
            musicBtn.textContent = "🎵 تشغيل الموسيقى";
        }
    });
}


// تحميل الهدية عند فتح الصفحة
loadGift();
