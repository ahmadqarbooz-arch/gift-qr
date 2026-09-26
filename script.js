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
  // قراءة المعاملات من الرابط (URL Query Parameters)
  const urlParams = new URLSearchParams(window.location.search);
  const giftId = urlParams.get('id');       // المباشر للروابط القديمة الـ 100
  const shortCode = urlParams.get('c');     // الرمز القصير للروابط الجديدة الخفيفة

  // التأكد من وجود معرّف (إما ID قديم أو shortCode جديد)
  if (!giftId && !shortCode) {
    showError('عذرًا، رابط الهدية غير مكتمل.');
    return;
  }

  try {
    let data = null;

    // 1. التعامل مع الروابط القديمة (المعتمدة على id)
    if (giftId) {
      const docRef = db.collection('gifts').doc(giftId);
      const doc = await docRef.get();

      if (doc.exists) {
        data = doc.data();
      }
    } 
    // 2. التعامل مع الروابط الجديدة الخفيفة (المعتمدة على shortCode)
    else if (shortCode) {
      const snapshot = await db.collection('gifts').where('shortCode', '==', shortCode).limit(1).get();

      if (!snapshot.empty) {
        data = snapshot.docs[0].data();
      }
    }

    // التحقق من وجود بيانات الهدية
    if (!data) {
      showError('عذرًا، لم يتم العثور على هذه الهدية أو ربما تم حذفها.');
      return;
    }

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
