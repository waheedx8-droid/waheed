// استقبال الأوامر من الصفحة الرئيسية لإظهار الإشعار في شريط الإشعارات العلوي
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const title = event.data.title || 'حجز جديد';
        const options = {
            body: event.data.body || 'تمت إضافة حجز عرس جديد إلى النظام.',
            icon: 'icon.png', // يمكنك استبدالها برابط أيقونة إذا أردت
            badge: 'icon.png',
            vibrate: [200, 100, 200], // اهتزاز الهاتف عند وصول الإشعار
            tag: 'new-booking',
            renotify: true,
            requireInteraction: true
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

// التعامل مع الضغط على الإشعار لفتح أو إعادة تركيز التطبيق مباشرة
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (let client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
