# Service Worker (sw.js)

The service worker is registered in the public root `/sw.js` and controls PWA assets precaching and dynamic routing.

## Features

### 1. Static Assets Pre-caching
Downloads and stores vital App Shell files (HTML, main bundle JS, CSS, icons, and fonts) during installation to provide immediate boot times.

### 2. Dynamic Asset Cache
Caches requested images (`.png`, `.svg`), styles, and icons dynamically using a cache-first approach.

### 3. Background Sync API
Registers the `sync-queue` tag. When the device returns online, the service worker broadcasts `SYNC_TRIGGER` to trigger immediate queue execution.

### 4. Push Alerts API
Listens for standard web push events to show OS-level system notifications in the background.
