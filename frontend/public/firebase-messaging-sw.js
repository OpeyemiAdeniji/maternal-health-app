importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const swParams = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: swParams.get('apiKey'),
  authDomain: swParams.get('authDomain'),
  projectId: swParams.get('projectId'),
  storageBucket: swParams.get('storageBucket'),
  messagingSenderId: swParams.get('messagingSenderId'),
  appId: swParams.get('appId'),
  measurementId: swParams.get('measurementId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Modacare', {
    body: body || '',
    icon: '/icons/icon.svg',
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = new URL('/notifications', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
