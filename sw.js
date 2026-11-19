// Günlük Arapça Konuşma — internetsiz çalışma
// Kabuk (sayfa, veri, simgeler, yazı tipi) her sürümde yenilenir; ses paketleri ayrı ve kalıcı önbellekte durur,
// adlarında içerik özeti olduğu için yalnızca değişen paketler yeniden iner. Sesleri sayfa tek tek indirir.
const KABUK = 'arapca-kabuk-8bb938571a';
const SES = 'arapca-ses';
const KABUK_DOSYALAR = ["./", "ikon-180.png", "ikon-192.png", "ikon-512.png", "ikon-maskable-512.png", "manifest.webmanifest", "veri.js", "yazitipi/0bf419550c9f.woff2", "yazitipi/202e96cd7287.woff2", "yazitipi/5ed9bd83f2a7.woff2", "yazitipi/64a948bf1bc3.woff2", "yazitipi/7a3188b65975.woff2", "yazitipi/967a6925cf99.woff2", "yazitipi/9fecae86b15d.woff2", "yazitipi/b2ed8126498d.woff2", "yazitipi/c0dd90c78986.woff2", "yazitipi/yazitipi.css"];
const SES_DOSYALAR = new Set(["ses/acil-e.9d39117f.js", "ses/acil.9798558b.js", "ses/alisveris-e.d2bbeabc.js", "ses/alisveris.22e70dcc.js", "ses/banka-e.404dd6af.js", "ses/banka.c1fbfa9c.js", "ses/berber-e.520e1ec8.js", "ses/berber.7ce1fea9.js", "ses/bulusma-e.a706c380.js", "ses/bulusma.28a9ba5b.js", "ses/duygular-e.1f0f6aa3.js", "ses/duygular.76dd730b.js", "ses/ev-e.53e503de.js", "ses/ev.690a0ed8.js", "ses/hacsaglik-e.2a6d19f2.js", "ses/hacsaglik.8958dbbe.js", "ses/harem-e.91645ea8.js", "ses/harem.a54d37a1.js", "ses/harfler-e.77e28e23.js", "ses/harfler.2ad9d938.js", "ses/hediyelik-e.5133605b.js", "ses/hediyelik.bf08d4bd.js", "ses/ihram-e.5104efba.js", "ses/ihram.2316ad77.js", "ses/is-e.89fd2351.js", "ses/is.1e974558.js", "ses/kafe-e.1e9606a7.js", "ses/kafe.44eba5a0.js", "ses/kendim-e.da5c0330.js", "ses/kendim.a1d3a045.js", "ses/komsu-e.7ee05846.js", "ses/komsu.3156afdf.js", "ses/kutuphane-e.0a3487a4.js", "ses/kutuphane.1e58f6fc.js", "ses/lokanta-e.17bd8e82.js", "ses/lokanta.6e4a5529.js", "ses/manav-e.ccc585ba.js", "ses/manav.c22530d6.js", "ses/market-e.8225df3e.js", "ses/market.cd749a7f.js", "ses/medine-e.28a9c357.js", "ses/medine.365c5ae3.js", "ses/menasik-e.23b2609e.js", "ses/menasik.47741463.js", "ses/nezaket-e.94c4adac.js", "ses/nezaket.17c0ee5f.js", "ses/okul-e.23627a74.js", "ses/okul.7b48697c.js", "ses/otel-e.3f8aefcd.js", "ses/otel.aaf1c1a1.js", "ses/saglik-e.69958c54.js", "ses/saglik.56aee5f6.js", "ses/sayilar-e.5aa14d38.js", "ses/sayilar.b06185b4.js", "ses/sohbet-e.625246f9.js", "ses/sohbet.6fd4dbb2.js", "ses/stratejiler-e.5843b342.js", "ses/stratejiler.c9d2ad66.js", "ses/tanisma-e.74afd83d.js", "ses/tanisma.2b78799b.js", "ses/tavaf-e.356f9282.js", "ses/tavaf.b9b6f31e.js", "ses/tebrik-e.9842148f.js", "ses/tebrik.118b7a84.js", "ses/telefon-e.92bbedb7.js", "ses/telefon.70c7492f.js", "ses/ulasim-e.ae821afb.js", "ses/ulasim.57b3e212.js", "ses/yol-e.497e047a.js", "ses/yol.e7bd73a7.js", "ses/zaman-e.cee61b51.js", "ses/zaman.1b095e83.js"]);
self.addEventListener('install', e => {
  // tarayıcının kendi önbelleğindeki eski kopyalar değil, sunucudaki yeni dosyalar alınsın
  e.waitUntil(caches.open(KABUK).then(c => c.addAll(KABUK_DOSYALAR.map(d => new Request(d, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('arapca-') && k !== KABUK && k !== SES) await caches.delete(k);  // yalnızca bu programın eski önbellekleri
    const c = await caches.open(SES);   // artık kullanılmayan eski ses paketlerini temizle
    for (const r of await c.keys()) { const p = new URL(r.url).pathname.split('/').slice(-2).join('/'); if (!SES_DOSYALAR.has(p)) await c.delete(r); }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.includes('/ses/')) {
    e.respondWith(caches.open(SES).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r ||
      fetch(e.request).then(y => { if (y.ok) c.put(e.request, y.clone()); return y; }))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r ||
    (e.request.mode === 'navigate' ? caches.match('./') : null)).then(r => r || fetch(e.request)));
});
