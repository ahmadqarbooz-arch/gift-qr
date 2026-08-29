const photo = document.getElementById('photo');
const preview = document.getElementById('preview');

let photoData = '';

photo.addEventListener('change', () => {
  const file = photo.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    photoData = e.target.result;

    preview.innerHTML =
      `<img src="${photoData}" alt="معاينة الصورة">`;
  };

  reader.readAsDataURL(file);
});

document.getElementById('create').addEventListener('click', () => {

  const order =
    document.getElementById('order').value.trim();

  const recipient =
    document.getElementById('recipient').value.trim() ||
    'الشخص المميز';

  const message =
    document.getElementById('message').value.trim();

  if (!order || !message || !photoData) {
    alert('أدخل رقم الطلب والرسالة وارفع الصورة أولًا ❤️');
    return;
  }

  const id = `${order}-${Date.now()}`;

  localStorage.setItem(
    'gift_' + id,
    JSON.stringify({
      order,
      recipient,
      message,
      photo: photoData,
      music: ''
    })
  );

  const url = new URL('index.html', location.href);
  url.searchParams.set('id', id);

  const link = document.getElementById('link');

  link.href = url.href;
  link.textContent = url.href;

  const qr = document.getElementById('qr');

  qr.innerHTML = `
    <img
      src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url.href)}"
      alt="QR Code"
      width="220"
      height="220"
    >
  `;

  document.getElementById('open').onclick = () => {
    window.open(url.href, '_blank');
  };

  document.getElementById('result').style.display = 'block';
});
