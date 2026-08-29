const photo = document.getElementById("photo");
const preview = document.getElementById("preview");

let photoData = "";

photo.addEventListener("change", () => {
  const file = photo.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    photoData = e.target.result;

    preview.innerHTML =
      `<img src="${photoData}" alt="صورة الهدية">`;
  };

  reader.readAsDataURL(file);
});

document.getElementById("create").addEventListener("click", () => {

  const order = document.getElementById("order").value.trim();
  const recipient = document.getElementById("recipient").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!order || !recipient || !message || !photoData) {
    alert("رجاءً املأ جميع الخانات واختر الصورة ❤️");
    return;
  }

  const data = {
    order: order,
    recipient: recipient,
    message: message,
    photo: photoData
  };

  const encoded = btoa(
    encodeURIComponent(JSON.stringify(data))
  );

  const url =
    new URL("index.html", window.location.href);

  url.searchParams.set("gift", encoded);

  const link = document.getElementById("link");
  link.href = url.href;
  link.textContent = url.href;

  const qr = document.getElementById("qr");

  qr.innerHTML = `
    <img
      src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url.href)}"
      width="220"
      height="220"
      alt="QR Code"
    >
  `;

  document.getElementById("open").onclick = () => {
    window.location.href = url.href;
  };

  document.getElementById("result").style.display = "block";
});
