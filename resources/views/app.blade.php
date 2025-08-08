@php
    use Illuminate\Support\Facades\Session;
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $meta = Session::get('meta', [
                'title' => config('app.name'),
                'description' => 'Discover the latest articles and resources on NexScholar.',
                'image' => url('storage/default.jpg'),
                'type' => 'website',
                'url' => url()->current(),
                'site_name' => 'NexScholar',
                'locale' => 'en_US'
            ]);
        @endphp

        <title>{{ $meta['title'] }}</title>
        <meta name="description" content="{{ $meta['description'] }}">

        <!-- Open Graph / Facebook Meta Tags -->
        <meta property="og:title" content="{{ $meta['title'] }}">
        <meta property="og:description" content="{{ $meta['description'] }}">
        <meta property="og:url" content="{{ $meta['url'] }}">
        <meta property="og:type" content="{{ $meta['type'] }}">
        <meta property="og:image" content="{{ $meta['image'] }}">
        <meta property="og:image:secure_url" content="{{ $meta['image'] }}">
        <meta property="og:image:width" content="{{ $meta['image_width'] ?? 1200 }}">
        <meta property="og:image:height" content="{{ $meta['image_height'] ?? 630 }}">
        <meta property="og:image:type" content="image/jpeg">
        <meta property="og:image:alt" content="{{ $meta['title'] }}">
        <meta property="og:site_name" content="{{ $meta['site_name'] }}">
        <meta property="og:locale" content="{{ $meta['locale'] }}">
        
        <!-- Facebook Additional Tags -->
        <meta property="fb:app_id" content="{{ config('services.facebook.client_id', '') }}">
        
        <!-- Ensure immediate image loading -->
        <link rel="preload" as="image" href="{{ $meta['image'] }}">
        
        <!-- Force Facebook to fetch new image -->
        <meta property="og:image:url" content="{{ $meta['image'] }}">
        <meta property="og:updated_time" content="{{ now()->toIso8601String() }}">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $meta['title'] }}">
        <meta name="twitter:description" content="{{ $meta['description'] }}">
        <meta name="twitter:image" content="{{ $meta['image'] }}">
        <meta name="twitter:image:alt" content="{{ $meta['title'] }}">
        
        <!-- LinkedIn Meta Tags -->
        <meta property="linkedin:title" content="{{ $meta['title'] }}">
        <meta property="linkedin:description" content="{{ $meta['description'] }}">
        <meta property="linkedin:image" content="{{ $meta['image'] }}">
        <meta property="linkedin:url" content="{{ $meta['url'] }}">
        
        <!-- WhatsApp Meta Tags -->
        <meta property="og:site_name" content="{{ $meta['site_name'] }}">
        <meta property="og:image:type" content="image/jpeg">
        
        @if(isset($meta['type']) && $meta['type'] === 'article')
            <meta property="article:published_time" content="{{ $meta['published_time'] }}">
            <meta property="article:section" content="{{ $meta['category'] }}">
        @endif

        <!-- Debug Meta Tags -->
        @if(config('app.debug'))
            <!--
            Meta Tags Debug:
            Title: {{ $meta['title'] }}
            Description: {{ $meta['description'] }}
            Image: {{ $meta['image'] }}
            URL: {{ $meta['url'] }}
            Type: {{ $meta['type'] }}
            -->
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes(['web', 'api'])
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        
        <!-- Google tag (gtag.js) -->
        <script>
          // Create global config for GA measurement ID
          window.gaConfig = {
            measurementId: '{{ config('analytics.measurement_id', 'G-Q6VXXF3B0T') }}'
          };
        </script>
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('analytics.measurement_id', 'G-Q6VXXF3B0T') }}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          // Set up debugging for easier troubleshooting
          const hostname = window.location.hostname;
          const isProduction = (hostname === 'nexscholar.com' || hostname.endsWith('.nexscholar.com'));
          const isDevelopment = (
            hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            hostname.includes('.test') || 
            hostname.includes('.local')
          );
          
          if (isProduction) {
            console.log('[GA] Initializing GA tracking for production');
            
            // Configure GA4 with these SPA-specific settings
            gtag('config', '{{ config('analytics.measurement_id', 'G-Q6VXXF3B0T') }}', {
              send_page_view: false, // Disable automatic page view on initialization
              transport_type: 'beacon', // Use navigator.sendBeacon to help ensure events are sent
              debug_mode: true, // Enable debug mode temporarily to help troubleshoot
              link_attribution: true, // Track link clicks automatically
              cookie_flags: 'samesite=none;secure', // Ensure cookies work correctly
              custom_map: {
                dimension1: 'page_title',
                dimension2: 'page_path'
              }
            });
            
            // Initial page view will be handled by the React components
            // We don't use gtag('event', 'page_view') here to avoid duplicate initial page view
          } else {
            console.log('[GA] Skipping GA tracking on non-production environment: ' + hostname);
          }
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia

        <div id="modal-portal"></div>
    </body>
</html>