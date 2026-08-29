const gift = document.getElementById('gift');
const openBtn = document.getElementById('openBtn');
const intro = document.getElementById('cover');
const card = document.getElementById('gift');
const params = new URLSearchParams(location.search);
const id = params.get('id');
let audio;

function loadGift(){
  if(!id) return;
  const raw=localStorage.getItem('gift_'+id); if(!raw) return;
  const data=JSON.parse(raw);
  document.getElementById('recipient').textContent=`إلى ${data.recipient} ❤️`;
  document.getElementById('messageText').textContent=data.message;
  const ph=document.querySelector('.photo-placeholder');
  if(data.photo) ph.innerHTML=`<img src="${data.photo}" alt="صورة الهدية" style="width:100%;height:100%;object-fit:cover;border-radius:20px">`;
function openGift(){
  intro.classList.add('hidden');
  card.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

if(openBtn){
  openBtn.addEventListener('click',openGift);
}

const musicBtn=document.getElementById('musicBtn');

if(musicBtn) musicBtn.addEventListener('click',()=>{
  if(!audio){
    audio=new Audio('https://cdn.pixabay.com/audio/2022/10/25/audio_946b7a0d2d.mp3');
    audio.loop=true;
  }

  if(audio.paused){
    audio.play().then(()=>{
      musicBtn.textContent='⏸️ إيقاف الموسيقى';
    }).catch(()=>{
      alert('اضغط مرة ثانية للسماح بتشغيل الموسيقى 🎵');
    });
  } else {
    audio.pause();
    musicBtn.textContent='🎵 تشغيل الموسيقى';
  }
});

loadGift();
