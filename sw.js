// الاستماع للرسائل القادمة من الصفحة الرئيسية لعرض الإشعارات
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body } = event.data;
        
        const options = {
            body: body || 'يوجد تحديث جديد في نظام الحجوزات',
            icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png', // أيقونة افتراضية للإشعار
            badge: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
            vibrate: [200, 100, 200],
            tag: 'wedding-booking-alert',
            renotify: true
        };

        event.waitUntil(
            self.registration.showNotification(title || 'تنبيه حجز جديد', options)
        );
    }
});

// التعامل مع حدث النقر على الإشعار لفتح التطبيق مباشرة
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // إذا كان التطبيق مفتوحاً مسبقاً، قم بعمل التركيز عليه (Focus)
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList.clicked;
                client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // إذا لم يكن مفتوحاً، افتح صفحة الموقع الرئيسية
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
