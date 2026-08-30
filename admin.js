// إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
  projectId: "gift-qr-e2142"
};

// تهيئة Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// العناصر من الصفحة
const giftForm = document.getElementById('giftForm');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');
const giftUrlInput = document.getElementById('giftUrlInput');
const copyBtn = document.getElementById('copyBtn');
const qrcodeDiv = document.getElementById('qrcode');

// عند تقديم النموذج
giftForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const recipient = document.getElementById('recipient').value.trim();
  const message = document.getElementById('message').value.trim();
  const imageUrl = document.getElementById('imageUrl').value.trim();

  if (!recipient || !message) {
    alert('يرجى ملء جميع الحقول المطلوبة');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'جاري إنشاء الهدية... ⏳';

  try {
    // إضافة الهدية إلى مجموعة gifts في Firestore
    const docRef = await db.collection('gifts').add({
      recipient: recipient,
      message: message,
      imageUrl: imageUrl || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // بناء الرابط المباشر للهدية مع الـ ID
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    const giftUrl = `${baseUrl}/index.html?id=${docRef.id}`;

    // عرض النتيجة والرابط
    giftUrlInput.value = giftUrl;
    
    // إنشاء الـ QR Code
    qrcodeDiv.innerHTML = '';
    new QRCode(qrcodeDiv, {
      text: giftUrl,
      width: 180,
      height: 180,
      colorDark: "#2b2b2b",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    resultDiv.classList.remove('hidden');
    submitBtn.textContent = 'تم إنشاء الهدية بنجاح! 🎉';

  } catch (error) {
    console.error("خطأ في حفظ الهدية:", error);
    alert("حدث خطأ أثناء حفظ الهدية. يرجى التأكد من إعدادات القواعد (Rules) في Firebase Firestore.");
    submitBtn.disabled = false;
    submitBtn.textContent = 'إنشاء الهدية 🚀';
  }
});

// نسخ الرابط
copyBtn.addEventListener('click', () => {
  giftUrlInput.select();
  giftUrlInput.setSelectionRange(0, 99999); // للهواتف
  navigator.clipboard.writeText(giftUrlInput.value).then(() => {
    copyBtn.textContent = 'تم النسخ! ✓';
    setTimeout(() => {
      copyBtn.textContent = 'نسخ الرابط';
    }, 2000);
  }).catch(() => {
    document.execCommand('copy');
    alert('تم نسخ الرابط');
  });
});
