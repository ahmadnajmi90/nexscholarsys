// resources/js/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Get CSRF token for authenticated broadcasting
function getCsrfToken() {
    return document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || "6eafd4f834d2307e0213",
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap1',
  forceTLS: true,
  encrypted: true,
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      'X-CSRF-TOKEN': getCsrfToken(),
    },
  },
});
