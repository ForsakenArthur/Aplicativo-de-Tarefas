// Define um nome e versão para o cache. Mude a versão para forçar a atualização do cache.
const CACHE_NAME = 'tarefas-app-v1.0';

// Lista de arquivos essenciais para o app funcionar offline
const urlsToCache = [
  '/',
  'index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
  'icon-192.png',
  'icon-512.png'
];

// Evento 'install': chamado quando o Service Worker é instalado
self.addEventListener('install', event => {
  // O navegador espera até que a promessa dentro de waitUntil seja resolvida.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e arquivos sendo adicionados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': chamado toda vez que o app tenta buscar um recurso (arquivo, imagem, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Tenta encontrar o recurso no cache primeiro
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna a versão em cache
        if (response) {
          return response;
        }
        // Se não encontrar, busca na rede
        return fetch(event.request);
      })
  );
});

// Evento 'activate': limpa caches antigos para evitar conflitos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Retorna true para todos os caches que não são o nosso cache atual
          return cacheName.startsWith('tarefas-app-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          // Deleta os caches antigos
          return caches.delete(cacheName);
        })
      );
    })
  );
});
