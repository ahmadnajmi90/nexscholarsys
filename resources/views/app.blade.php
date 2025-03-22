<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ $meta['title'] ?? config('app.name') }}</title>
        <meta name="description" content="{{ $meta['description'] ?? config('app.description') }}">

        <!-- Open Graph / Facebook Meta Tags -->
        <meta property="og:title" content="{{ $meta['title'] ?? config('app.name') }}">
        <meta property="og:description" content="{{ $meta['description'] ?? 'Discover the latest articles and resources on NexScholar.' }}">
        <meta property="og:url" content="{{ $meta['url'] ?? Request::url() }}">
        <meta property="og:type" content="{{ $meta['type'] ?? 'website' }}">
        <meta property="og:image" content="{{ $meta['image'] ?? asset('images/default.jpg') }}">
        <meta property="og:image:secure_url" content="{{ $meta['image'] ?? asset('images/default.jpg') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $meta['title'] ?? config('app.name') }}">
        <meta property="og:site_name" content="{{ config('app.name') }}">
        <meta property="og:locale" content="en_US">
        
        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $meta['title'] ?? config('app.name') }}">
        <meta name="twitter:description" content="{{ $meta['description'] ?? 'Discover the latest articles and resources on NexScholar.' }}">
        <meta name="twitter:image" content="{{ $meta['image'] ?? asset('images/default.jpg') }}">
        <meta name="twitter:image:alt" content="{{ $meta['title'] ?? config('app.name') }}">
        
        <!-- LinkedIn Meta Tags -->
        <meta property="linkedin:title" content="{{ $meta['title'] ?? config('app.name') }}">
        <meta property="linkedin:description" content="{{ $meta['description'] ?? 'Discover the latest articles and resources on NexScholar.' }}">
        <meta property="linkedin:image" content="{{ $meta['image'] ?? asset('images/default.jpg') }}">
        <meta property="linkedin:url" content="{{ $meta['url'] ?? Request::url() }}">
        
        <!-- WhatsApp Meta Tags -->
        <meta property="og:site_name" content="{{ config('app.name') }}">
        <meta property="og:image:type" content="image/jpeg">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        
        @if(isset($meta['type']) && $meta['type'] === 'article')
            <meta property="article:published_time" content="{{ $meta['published_time'] ?? '' }}">
            @if(isset($meta['category']))
                <meta property="article:section" content="{{ $meta['category'] }}">
            @endif
        @endif

        <!-- Default image fallback for testing -->
        <link rel="image_src" href="{{ $meta['image'] ?? asset('images/default.jpg') }}" />

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