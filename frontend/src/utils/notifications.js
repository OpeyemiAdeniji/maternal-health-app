import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import api from '../services/api';

export const firebaseConfig = {
  apiKey: 'AIzaSyBLUkzZM5w3t4Dcfq38wgPzsdvzQdiCKHs',
  authDomain: 'modacare-f8fd0.firebaseapp.com',
  projectId: 'modacare-f8fd0',
  storageBucket: 'modacare-f8fd0.firebasestorage.app',
  messagingSenderId: '460515807123',
  appId: '1:460515807123:web:26bf5ab27c532b786a6266',
  measurementId: 'G-FVSXWJ1M8G',
  vapidKey: 'BBLXrrcjauo6hcJlxjsFIEeILj7s3nw90RcBPiOAlbr7kNGUUj4GLkBqEEQ4zOc0c1yFupEKQ341AloN4-tRkQ8',
};

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  try {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
    if (!token) return null;

    await api.post('/api/auth/fcm-token/', { token });
    return token;
  } catch {
    // permission was granted but getting/saving the token failed — not fatal
    return null;
  }
}
