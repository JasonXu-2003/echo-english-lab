const CACHE = "echo-english-lab-v14";
const ASSETS = ["./", "./index.html", "./questions.js", "./question-factory.js", "./supabase-config.js", "./cloud-sync.js", "./review.js", "./vocabulary.js", "./vocabulary-data.js", "./vocabulary.css", "./vendor/supabase.min.js", "./manifest.webmanifest"];
ASSETS.push('./vocabulary-expanded.js','./vocabulary-sources.html','./vocabulary-audit.json');
const assetURLs = new Set(ASSETS.map(path => new URL(path, self.registration.scope).href));

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("echo-english-lab-") && key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  url.search = "";
  // Authentication and database responses must never enter the offline cache.
  if (event.request.method !== "GET" || !assetURLs.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch(event.request, { signal: controller.signal });
      if (!response.ok) throw new Error("Asset unavailable");
      event.waitUntil(cache.put(url.href, response.clone()));
      return response;
    } catch (_) {
      return await cache.match(url.href) || new Response("暂时无法加载，请检查网络后刷新。", {
        status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    } finally { clearTimeout(timeout); }
  })());
});
