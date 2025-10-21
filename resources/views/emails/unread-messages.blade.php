<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unread Messages on Nexscholar</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
        }
        .message-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .message-count {
            font-size: 36px;
            font-weight: 700;
            color: #667eea;
            margin: 0 0 10px 0;
        }
        .message-from {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }
        .sender-list {
            font-weight: 600;
            color: #333;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
            transform: translateY(-2px);
        }
        .info-text {
            font-size: 14px;
            color: #666;
            line-height: 1.8;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
            color: #666;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .icon {
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            margin-bottom: 15px;
        }
        .divider {
            height: 1px;
            background-color: #e9ecef;
            margin: 25px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="icon">💬</div>
            <h1>You have unread messages!</h1>
            <p>Someone is trying to reach you on Nexscholar</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hi {{ $user->full_name }},
            </div>

            <p class="info-text">
                We noticed you haven't logged in for a while. During your absence, you've received some messages from your network!
            </p>

            <!-- Message Box -->
            <div class="message-box">
                <div class="message-count">
                    {{ $unreadCount }}
                </div>
                <div class="message-from">
                    Unread {{ $unreadCount === 1 ? 'message' : 'messages' }} from <span class="sender-list">{{ $sendersList }}</span>
                </div>
            </div>

            <p class="info-text">
                Don't keep {{ count($senders) === 1 ? 'them' : 'them' }} waiting! Click the button below to view and respond to your messages:
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $messagesUrl }}" class="cta-button">
                    View My Messages
                </a>
            </div>

            <div class="divider"></div>

            <p class="info-text" style="font-size: 13px; color: #999;">
                <strong>Why am I receiving this?</strong><br>
                You're receiving this email because you have unread messages and haven't logged into Nexscholar recently. We send these notifications to help you stay connected with your academic network.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Nexscholar</strong></p>
            <p>Your Academic Networking Platform</p>
            <p style="margin-top: 15px;">
                <a href="{{ url('/') }}">Visit Nexscholar</a> • 
                <a href="{{ url('/profile/edit') }}">Notification Settings</a> • 
                <a href="{{ url('/help') }}">Help Center</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
                © {{ date('Y') }} Nexscholar. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>

