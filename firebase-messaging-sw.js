
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD9EK2IkOHZ7-tehImQnyhf2lN-MfmztjI",
  authDomain: "movies-app-153a7.firebaseapp.com",
  projectId: "movies-app-153a7",
  storageBucket: "movies-app-153a7.firebasestorage.app",
  messagingSenderId: "939001203503",
  appId: "1:939001203503:web:d3a51e3183682fa791efda"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || 'https://iili.io/f6WKiPV.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
