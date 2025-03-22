<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ $meta['title'] ?? config('app.name') }}</title>
        <meta name="description" content="{{ $meta['description'] ?? config('app.description') }}">

        <!-- Open Graph / Facebook Meta Tags -->
        <meta property="og:title" content="{{ $meta['title'] }}">
        <meta property="og:description" content="{{ $meta['description'] }}">
        <meta property="og:url" content="{{ $meta['url'] }}">
        <meta property="og:type" content="{{ $meta['type'] }}">
        <meta property="og:image" content="{{ $meta['image'] }}">
        <meta property="og:image:secure_url" content="{{ $meta['image'] }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $meta['title'] }}">
        <meta property="og:site_name" content="{{ $meta['site_name'] }}">
        <meta property="og:locale" content="{{ $meta['locale'] }}">
        
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
            Title: {{ $meta['title'] ?? 'Not set' }}
            Description: {{ $meta['description'] ?? 'Not set' }}
            Image: {{ $meta['image'] ?? 'Not set' }}
            URL: {{ $meta['url'] ?? 'Not set' }}
            Type: {{ $meta['type'] ?? 'Not set' }}
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
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>