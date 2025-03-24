// 1. تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCYBnbqpmD1b-nBD7QRYRU-db2H2UCRkuQ",
    authDomain: "gel-elforkan.firebaseapp.com",
    databaseURL: "https://gel-elforkan-default-rtdb.firebaseio.com",
    projectId: "gel-elforkan",
    storageBucket: "gel-elforkan.firebasestorage.app",
    messagingSenderId: "381296993043",
    appId: "1:381296993043:web:f736911a8c33c79d0930e6"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. دالة تنسيق النص لإزالة الفروقات المحتملة
function normalizeText(input) {
    input = input.toLowerCase().trim(); // تحويل النص إلى حروف صغيرة وإزالة المسافات الزائدة من الأطراف
    input = input.replace(/\s+/g, " "); // توحيد المسافات بين الكلمات
    input = input.replace(/[أإآا]/g, "ا"); // توحيد الألف
    input = input.replace(/[يى]/g, "ي"); // توحيد الياء
    input = input.replace(/ة$/g, "ه"); // استبدال التاء المربوطة بالهاء في نهاية الكلمة
    input = input.replace(/\s+/g, ""); // إزالة جميع المسافات بين الكلمات (لحل مشكلة "ابو الحجاج" و "ابوالحجاج")
    return input;
}

function searchData() {
    const searchTerm = document.getElementById('search').value.trim();
    const normalizedSearchTerm = normalizeText(searchTerm);

    // التحقق من أن المستخدم أدخل الاسم ثلاثيًا
    const nameParts = searchTerm.split(" ");
    if (nameParts.length < 3) {
        alert("يجب إدخال الاسم ثلاثي على الاقل!");
        return;
    }

    const resultsRef = database.ref('results');
    resultsRef.once('value').then(snapshot => {
        const results = snapshot.val();
        let found = false;
        let resultHTML = `
            <table>
                <tr>
                    <th>الاسم</th>
                    <th>الفئة</th>
                    <th>الحفظ</th>
                    <th>التجويد</th>
                    <th>الأداء العام</th>
                    <th>النتيجة</th>
                    <th>الملاحظات</th>
                </tr>`;

        for (let resultId in results) {
            const result = results[resultId];
            const normalizedName = normalizeText(result.name);

            if (normalizedName.includes(normalizedSearchTerm)) {
                found = true;
                resultHTML += `
                    <tr>
                        <td>${result.name}</td>
                        <td>${result.category}</td>
                        <td>${result.hifz || "-"}</td>
                        <td>${result.tajweed || "-"}</td>
                        <td>${result.performance || "-"}</td>
                        <td>${result.result}</td>
                        <td>${result.notes || "لا يوجد ملاحظات"}</td>
                    </tr>`;
            }
        }

        resultHTML += "</table>";

        const resultBox = document.getElementById('result');
        if (found) {
            resultBox.style.display = 'block';
            resultBox.innerHTML = resultHTML;
        } else {
            resultBox.style.display = 'block';
            resultBox.innerHTML = "<p>لم يتم العثور على نتائج</p>";
        }
    });
}




// تعطيل الزر الأيمن
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

// تعطيل اختصارات F12 و Ctrl+Shift+I و Ctrl+Shift+J و Ctrl+U
document.addEventListener("keydown", function (e) {
    if (e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) || 
        (e.ctrlKey && e.key === "U")) {
        e.preventDefault();
    }
});