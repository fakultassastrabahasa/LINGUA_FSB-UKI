// Service worker sederhana untuk aplikasi Lab Bahasa FSB UKI.
// Menyimpan halaman pembuka & ikon agar aplikasi tetap terbuka walau sinyal lemah.
// Jika file-file ini diubah, naikkan nomor versi di bawah (v1 → v2, dst).
const CACHE = "labbahasa-v5";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Utamakan internet; jika gagal, pakai salinan tersimpan.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((r) => r || caches.match("./index.html"))
    )
  );
});
