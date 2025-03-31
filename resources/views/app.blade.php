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
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-483738680"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Only track if not on localhost
          if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            gtag('config', 'G-483738680');
          }
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>