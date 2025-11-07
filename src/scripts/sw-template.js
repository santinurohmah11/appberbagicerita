// src/scripts/sw-template.js
/* eslint-disable no-restricted-globals */

// Import library yang diperlukan
import 'regenerator-runtime';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';


precacheAndRoute(self.__WB_MANIFEST);


registerRoute(
  ({ url }) => url.href.includes('/stories'), // Sesuaikan dengan pola URL API data Anda
  new StaleWhileRevalidate({
    cacheName: 'story-data-cache',
  }),
);

// Opsional: Caching gambar dari API atau sumber luar (jika ada)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    // Batasan cache agar tidak terlalu besar (misalnya, maks 60 gambar)
    plugins: [
      {
        maxEntries: 60, 
      },
    ],
  }),
);

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'Pemberitahuan Baru';
  
  // Konten notifikasi dinamis dari payload data
  const options = {
    body: data.message || 'Anda punya notifikasi baru.',
    icon: '/public/images/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/', // URL untuk navigasi
      id: data.id // Opsional: ID data yang terkait
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 💡 Kriteria Advanced: Action Notifikasi (Navigasi)
self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Ambil URL dari data yang kita sisipkan
  const urlToOpen = clickedNotification.data.url;

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Cek apakah tab aplikasi sudah terbuka
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.endsWith(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika belum, buka tab baru
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    }),
  );
});
