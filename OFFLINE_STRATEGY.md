# Offline Strategy & Recovery Management

This document details the offline connection state handling, background loading overlays, error recoverability dialogs, and 503 maintenance page layers.

---

## Offline State Detection

1. **Zustand Network Store (`src/store/network.store.js`)**: Tracks `isOffline` and `activeRequests` variables.
2. **Window Listeners**: `App.jsx` registers event listeners for `online` and `offline` events to toggle Zustand states.
3. **Banner overlay (`src/components/NetworkIndicator.jsx`)**: Renders a floating, red alert badge to notify coaches when connectivity is lost.

---

## Global Progress Loading Bar

Whenever a network request begins, the custom Axios request interceptor increments the `activeRequests` counter, showing a top linear indicator. When the request resolves or fails, the counter decrements, hiding the progress bar.

---

## Error Center Recovery

* **401 Unauthorized**: Wipes local token states and routes users back to `/login`.
* **503 Service Unavailable**: Renders `<MaintenanceMode />` page wrapper immediately across all routes, preventing dashboard interactions until connectivity is verified.
* **Network Failures**: Displays localized toast alerts advising users that modifications might not be saved while offline.
