<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Profile Update Reminder</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3b82f6;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f8fafc;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 0.8em;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nexscholar</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $user->name }},</h2>
            
            <p>We noticed that your Nexscholar profile could use some updates. A complete profile helps you connect with other academics and showcase your work effectively.</p>
            
            <p>As a {{ ucfirst($role) }}, it's important to maintain an up-to-date profile with your current:</p>
            
            <ul>
                @if($role == 'academician')
                <li>Research interests</li>
                <li>Publications</li>
                <li>Ongoing projects</li>
                <li>Teaching areas</li>
                <li>Availability for supervision</li>
                @elseif($role == 'postgraduate')
                <li>Research focus</li>
                <li>Academic background</li>
                <li>Skills and expertise</li>
                <li>Current research projects</li>
                @elseif($role == 'undergraduate')
                <li>Areas of interest</li>
                <li>Academic achievements</li>
                <li>Skills and expertise</li>
                <li>Projects and activities</li>
                @endif
            </ul>
            
            <p>Please take a moment to review and update your profile information.</p>
            
            <a href="{{ url('/role') }}" class="button">Update My Profile</a>
            
            <p>Thank you for being part of the Nexscholar community!</p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Nexscholar. All rights reserved.</p>
            <p>This email was sent because you are registered on the Nexscholar platform.</p>
        </div>
    </div>
</body>
</html> 