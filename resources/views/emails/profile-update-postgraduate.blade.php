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
            <h2>Dear {{ $user->name }},</h2>
            
            <p>We've noticed your NexScholar profile could use an update! As a postgraduate student, a complete and current profile is key to showcasing your developing research expertise, connecting with potential collaborators or mentors, and discovering opportunities aligned with your studies.</p>
            
            <p>An active and detailed profile helps you get noticed within the academic community and allows NexScholar's AI to make more relevant connections for you. Please take a moment to review and update these important sections:</p>
            
            <p><strong>✅ Boost Your Visibility & Network:</strong></p>
            <ul>
                <li>Upload a professional profile picture</li>
                <li>Craft a Bio that highlights your academic journey, current research focus (e.g., thesis topic), and key skills</li>
                <li>Clearly define your <strong>Field of Research</strong> – this is crucial for matching with relevant projects, researchers, and discussions</li>
            </ul>
            
            <p><strong>🔍 Showcase Your Progress & Interests:</strong></p>
            <ul>
                <li>Add details about any ongoing research projects or your thesis</li>
                <li>List any specific methodologies or technical skills you are proficient in</li>
                <li>Ensure your <strong>CV is uploaded</strong> – this provides a comprehensive overview for potential connections</li>
            </ul>
            
            <p><strong>💡 Need help updating your details?</strong><br>
            NexScholar's AI Profile Generator can assist you! Simply <strong>upload your latest CV</strong>, and the AI can help extract and fill in relevant information to complete your profile quickly and accurately.</p>
            
            <p>By keeping your profile fresh, NexScholar can better support your postgraduate journey by connecting you with the right people and resources.</p>
            
            <a href="{{ route('role.edit') }}" class="button">Update Your Profile Now</a>
            
            <p>Thank you for being part of the NexScholar community.</p>
            
            <p>Best regards,<br>
            The NexScholar Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Nexscholar. All rights reserved.</p>
            <p>This email was sent because you are registered on the Nexscholar platform.</p>
        </div>
    </div>
</body>
</html>