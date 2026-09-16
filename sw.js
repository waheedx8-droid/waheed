self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const title = event.data.title || 'حجز جديد!';
        const options = {
            body: event.data.body || 'تمت إضافة حجز عرس جديد إلى النظام.',
            icon: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
            badge: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
            vibrate: [500, 110, 500, 110, 450],
            tag: 'new-booking-notification',
            renotify: true,
            requireInteraction: true
        };
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});
