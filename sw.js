// sw.js - Service Worker للإشعارات الفورية والصوت والاهتزاز

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// استقبال حدث الـ Push وإظهار الإشعار مع الصوت والاهتزاز وتفاصيل الحجز
self.addEventListener('push', (event) => {
    let data = {
        title: 'تنبيه حجز جديد 💍',
        body: 'لديك حجز جديد مسجل في النظام',
        url: '/'
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [300, 100, 300, 100, 300], // نمط اهتزاز واضح وقوي
        sound: 'default', // تفعيل الصوت الافتراضي للنظام
        requireInteraction: true, // يظل الإشعار ظاهراً حتى يتفاعل معه المستخدم
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// التعامل مع النقر على الإشعار لفتح الصفحة مباشرة
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});