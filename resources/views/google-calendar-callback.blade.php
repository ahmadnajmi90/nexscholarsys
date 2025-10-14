<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connecting Google Calendar...</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .container {
            text-align: center;
            padding: 2rem;
            max-width: 400px;
        }

        .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s ease-in-out infinite;
        }

        .icon svg {
            width: 40px;
            height: 40px;
            fill: white;
        }

        h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        p {
            font-size: 1rem;
            opacity: 0.9;
            line-height: 1.5;
        }

        .success {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .error {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.8;
            }
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body class="{{ $status === 'success' ? 'success' : 'error' }}">
    <div class="container">
        <div class="icon">
            @if($status === 'success')
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            @else
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            @endif
        </div>
        
        <h1>{{ $status === 'success' ? 'Connected!' : 'Connection Failed' }}</h1>
        <p>{{ $message }}</p>
        <p style="margin-top: 1rem; font-size: 0.875rem; opacity: 0.8;">
            This window will close automatically...
        </p>
    </div>

    <script>
        // Notify parent window about the connection status
        if (window.opener) {
            window.opener.postMessage({
                type: 'google-calendar-oauth-complete',
                status: '{{ $status }}',
                message: '{{ $message }}'
            }, window.location.origin);
        }

        // Close the popup after a short delay
        setTimeout(() => {
            window.close();
        }, 2000);

        // Fallback: if window.close() doesn't work (some browsers block it)
        // show a message after 3 seconds
        setTimeout(() => {
            if (!window.closed) {
                document.querySelector('p:last-child').textContent = 'You can close this window now.';
            }
        }, 3000);
    </script>
</body>
</html>

