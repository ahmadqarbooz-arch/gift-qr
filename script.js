// إعدادات Firebase
const firebaseConfig = {
  projectId: "gift-qr-e2142"
};

// تهيئة Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// عناصر الصفحة
const loader = document.getElementById('loader');
const errorScreen = document.getElementById('errorScreen');
const errorMessage = document.getElementById('errorMessage');
const coverScreen = document.getElementById('coverScreen');
const giftScreen = document.getElementById('giftScreen');

const recipientGreeting = document.getElementById('recipientGreeting');
const giftRecipient = document.getElementById('giftRecipient');
const giftMessage = document.getElementById('giftMessage');
const imageContainer = document.getElementById('imageContainer');
const giftImage = document.getElementById('giftImage');
const openBtn = document.getElementById('openBtn');

// وظيفة المساعدة لإخفاء كل الشاشات
function hideAllScreens() {
  loader.classList.add('hidden');
  errorScreen.classList.add('hidden');
  coverScreen.classList.add('hidden');
  giftScreen.classList.add('hidden');
}

// إظهار الخطأ
function showError(msg) {
  hideAllScreens();
  if (msg) errorMessage.textContent = msg;
  errorScreen.classList.remove('hidden');
}

// بدء التشغيل عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', async () => {
  // قراءة الـ ID من معامِلات الرابط (URL Query Parameters)
  const urlParams = new URLSearchParams(window.location.search);
  const giftId = urlParams.get('id');

  // التأكد من وجود ID في الرابط
  if (!giftId) {
    showError('عذرًا، رابط الهدية غير مكتمل.');
    return;
  }

  try {
    // جلب الهدية من Firestore باستخدام الـ ID
    const docRef = db.collection('gifts').doc(giftId);
    const doc = await docRef.get();

    if (!doc.exists) {
      showError('عذرًا، لم يتم العثور على هذه الهدية أو ربما تم حذفها.');
      return;
    }

    const data = doc.data();

    // تعبئة البيانات في الشاشات
    recipientGreeting.textContent = `وصلتك هدية خاصة يا ${data.recipient}! 🎁`;
    giftRecipient.textContent = data.recipient;
    giftMessage.textContent = data.message;

    if (data.imageUrl) {
      giftImage.src = data.imageUrl;
      imageContainer.classList.remove('hidden');
    } else {
      imageContainer.classList.add('hidden');
    }

    // إخفاء شاشة التحميل وإظهار شاشة الغلاف المغلق
    hideAllScreens();
    coverScreen.classList.remove('hidden');

  } catch (error) {
    console.error("خطأ أثناء جلب الهدية:", error);
    showError('حدث خطأ أثناء تحميل الهدية. يرجى التحقق من الاتصال بالإنترنت.');
  }
});

// عند الضغط على زر "افتح الهدية ✨"
openBtn.addEventListener('click', () => {
  coverScreen.classList.add('hidden');
  giftScreen.classList.remove('hidden');
});
