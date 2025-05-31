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
            
            <p>We noticed that your NexScholar profile could benefit from an update. A complete and accurate profile not only enhances your visibility but also increases your chances of connecting with the right collaborators, students, and research opportunities.</p>
            
            <p>As an academician, keeping your profile up to date helps ensure effective AI-powered matchmaking and research visibility. Please take a moment to review and update the following key areas:</p>
            
            <p><strong>✅ To get listed in search results:</strong></p>
            <ul>
                <li>Upload a professional profile picture</li>
                <li>Add a Short Bio summarizing your academic background and interests</li>
                <li>Specify your Research Expertise areas</li>
            </ul>
            
            <p><strong>🔍 To improve AI-driven matchmaking:</strong></p>
            <ul>
                <li>Update your Research Interests</li>
                <li>Add your Recent Publications</li>
                <li>List any Ongoing Projects</li>
                <li>Upload your CV</li>
                <li>Indicate your Availability for Supervision</li>
            </ul>
            
            <p><strong>💡 Need help?</strong><br>
            You can use the AI Profile Generator to quickly fill in your profile. The AI can search the internet, use provided URLs, or extract information from your uploaded CV to complete your details accurately.</p>
            
            <p>By maintaining a complete profile, NexScholar can help you connect with the right collaborators, postgraduate students, and funding opportunities — faster and smarter.</p>
            
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