const CACHE_NAME = 'nasobilka-delilka-v1'

const ASSETS_TO_CACHE = [
	'./',
	'./index.html',
	'./manifest.json',
	'./icons/icon.svg',
	'./icons/icon-192.png',
	'./icons/icon-512.png',
	'./css/variables.css',
	'./css/main.css',
	'./css/components/headerApp.css',
	'./css/components/homeScreen.css',
	'./css/components/gameScreen.css',
	'./css/components/learningTableScreen.css',
	'./css/components/newGameSettingsScreen.css',
	'./css/components/resultScreen.css',
	'./js/main.js',
	'./js/components/headerApp.js',
	'./js/components/homeScreen.js',
	'./js/components/learningTableScreen.js',
	'./js/components/newGameSettingsScreen.js',
	'./js/components/gameScreen.js',
	'./js/components/resultScreen.js'
]

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(ASSETS_TO_CACHE)
		})
	)
	self.skipWaiting()
})

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(
				keys
					.filter(key => key !== CACHE_NAME)
					.map(key => caches.delete(key))
			)
		})
	)
	self.clients.claim()
})

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') return

	event.respondWith(
		fetch(event.request)
			.then(networkResponse => {
				const responseClone = networkResponse.clone()
				caches.open(CACHE_NAME).then(cache => {
					cache.put(event.request, responseClone)
				})
				return networkResponse
			})
			.catch(() => {
				return caches.match(event.request).then(cachedResponse => {
					return cachedResponse || caches.match('./index.html')
				})
			})
	)
})
