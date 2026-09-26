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

// دالة توليد كود قصير مكون من 6 أحرف وأرقام للطلبات الجديدة
function generateShortCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
    // توليد كود قصير محلي فريد للطلب الجديد
    const shortCode = generateShortCode(6);

    // إضافة الهدية إلى مجموعة gifts في Firestore
    const docRef = await db.collection('gifts').add({
      recipient: recipient,
      message: message,
      imageUrl: imageUrl || null,
      shortCode: shortCode,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // بناء الرابط القصير المباشر
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
    const giftUrl = `${baseUrl}/index.html?c=${shortCode}`;

    // عرض النتيجة والرابط
    giftUrlInput.value = giftUrl;
    
    // تفريغ الحاوية وتنسيق الهامش الأبيض الصافي للحفر والطباعة
    qrcodeDiv.innerHTML = '';
    qrcodeDiv.style.padding = "20px";
    qrcodeDiv.style.backgroundColor = "#ffffff";
    qrcodeDiv.style.display = "inline-block";
    qrcodeDiv.style.borderRadius = "8px";

    // إنشاء كود الـ QR النقي جداً وبمربعات كبيرة واضحة (Low Error Correction Level)
    new QRCode(qrcodeDiv, {
      text: giftUrl,
      width: 350,                          // حجم ممتاز ودقة عالية
      height: 350,
      colorDark: "#000000",               // أسود صريح لتباين عالٍ
      colorLight: "#ffffff",              // خلفية بيضاء نقية
      correctLevel: QRCode.CorrectLevel.L  // مستوى L يقلل التعقيد ويعطي مربعات كبيرة ونقية
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
