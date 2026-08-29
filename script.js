const gift = document.getElementById('gift');
const openBtn = document.getElementById('openBtn');
const cover = document.getElementById('cover');

const params = new URLSearchParams(location.search);
const id = params.get('id');

let audio = null;

function loadGift() {
  if (!id) return;

  const raw = localStorage.getItem('gift_' + id);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    const recipient = document.getElementById('recipient');
    const message = document.getElementById('messageText');
    const photo = document.querySelector('.photo-placeholder');

    if (recipient) {
      recipient.textContent = `إلى ${data.recipient} ❤️`;
    }

    if (message) {
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
    console.error('Gift loading error:', error);
  }
}

function openGift() {
  if (cover) {
    cover.classList.add('hidden');
  }

  if (gift) {
    gift.classList.remove('hidden');
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

if (openBtn) {
  openBtn.addEventListener('click', openGift);
}

const musicBtn = document.getElementById('musicBtn');

if (musicBtn) {
  musicBtn.addEventListener('click', () => {

    if (!audio) {
      audio = new Audio(
        'https://cdn.pixabay.com/audio/2022/10/25/audio_946b7a0d2d.mp3'
      );

      audio.loop = true;
    }

    if (audio.paused) {
      audio.play().then(() => {
        musicBtn.textContent = '⏸️ إيقاف الموسيقى';
      }).catch(() => {
        alert('اضغط مرة ثانية للسماح بتشغيل الموسيقى 🎵');
      });
    } else {
      audio.pause();
      musicBtn.textContent = '🎵 تشغيل الموسيقى';
    }

  });
}

loadGift();
