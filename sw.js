/* Ragnatela · service worker
   Serve a tre cose:
   - 16 · tenere leggibile l'ultimo stato quando non c'e rete
   - 8  · mettere i bottoni Approva e Rimanda dentro la notifica
   - 10 · aggiornare il numero sull'icona dell'app
*/
var CACHE = 'ragnatela-v1';
var ROBA = ['./', './index.html', './manifest.json'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ROBA); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== CACHE; })
                        .map(function (x) { return caches.delete(x); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;   // le chiamate a Supabase non si mettono in cache
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copia = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});

/* 6 · il suono dice gia cosa e successo, prima di guardare.
   Riusa i codici del Centro Notifiche: D5 solo per cio che scade. */
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {}; }
  var titolo = d.titolo || 'Ragnatela';
  var scade = d.tono === 'scaduto' || d.tono === 'urgente';
  e.waitUntil(
    self.registration.showNotification(titolo, {
      body: d.messaggio || 'Un agente aspetta il tuo si.',
      tag: 'ragnatela-' + (d.agente || 'x'),   // 7 · una notifica per agente, non tre
      renotify: scade,
      requireInteraction: scade,
      silent: false,
      data: { id: d.id, url: d.url || './index.html' },
      actions: [                                // 8 · si decide dalla notifica
        { action: 'approva',  title: 'Approva' },
        { action: 'rimanda',  title: 'Rimanda' },
        { action: 'apri',     title: 'Apri' }
      ]
    }).then(function () {
      if (self.registration.setAppBadge && typeof d.quanti === 'number') {
        return d.quanti > 0 ? self.registration.setAppBadge(d.quanti)
                            : self.registration.clearAppBadge();
      }
    })
  );
});

self.addEventListener('notificationclick', function (e) {
  var az = e.action, dati = e.notification.data || {};
  e.notification.close();
  if ((az === 'approva' || az === 'rimanda') && dati.id) {
    e.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (lista) {
        lista.forEach(function (c) {
          c.postMessage({ tipo: 'decidi', id: dati.id, esito: az === 'approva' ? 'approvato' : 'rimandato' });
        });
        if (!lista.length) return self.clients.openWindow(dati.url + '?decidi=' + dati.id + '&esito=' + az);
      })
    );
    return;
  }
  e.waitUntil(self.clients.openWindow(dati.url || './index.html'));
});
