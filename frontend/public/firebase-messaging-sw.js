importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBLUkzZM5w3t4Dcfq38wgPzsdvzQdiCKHs',
  authDomain: 'modacare-f8fd0.firebaseapp.com',
  projectId: 'modacare-f8fd0',
  storageBucket: 'modacare-f8fd0.firebasestorage.app',
  messagingSenderId: '460515807123',
  appId: '1:460515807123:web:26bf5ab27c532b786a6266',
  measurementId: 'G-FVSXWJ1M8G',
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
