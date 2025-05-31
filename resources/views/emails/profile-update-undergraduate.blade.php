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
            
            <p>Welcome to the NexScholar community! To help you make the most of the platform and start building your academic network, we encourage you to complete and update your profile. A clear profile can help you connect with mentors, find interesting projects, and explore future study or research paths.</p>
            
            <p>For undergraduates, an up-to-date profile is your first step to getting noticed and allows our AI tools to suggest useful connections. Here are a few key areas to focus on:</p>
            
            <p><strong>✅ Get Seen & Connect:</strong></p>
            <ul>
                <li>Upload a clear and friendly profile picture</li>
                <li>Write a Bio sharing what you're currently studying, your academic passions, and any areas you're curious about exploring for research</li>
                <li>Specify your <strong>Research Preferences</strong> or general areas of academic interest – this helps in finding peers or potential supervisors for projects (like your final year project)</li>
            </ul>
            
            <p><strong>🔍 Highlight Your Skills & Aspirations:</strong></p>
            <ul>
                <li>List any relevant coursework, skills, or mini-projects you've completed</li>
                <li><strong>Upload your CV</strong> – it's great practice and useful for future opportunities!</li>
                <li>If you have specific research interests you'd like to pursue, make sure they're noted</li>
            </ul>
            
            <p><strong>💡 Need a hand filling out your profile?</strong><br>
            Our AI Profile Generator is here to help! Just <strong>upload your CV</strong>, and the AI can extract key information to get your profile set up quickly.</p>
            
            <p>An updated profile on NexScholar can open doors to new learning experiences and connections.</p>
            
            <a href="{{ route('role.edit') }}" class="button">Update Your Profile Now</a>
            
            <p>Thank you for joining NexScholar!</p>
            
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