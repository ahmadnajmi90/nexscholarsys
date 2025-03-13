<!DOCTYPE html>
<html>
<head>
    <title>{{ $subject }}</title>
</head>
<body>
    <p>You have received a new message from {{ $sender->name }} ({{ $sender->email }}):</p>
    <p>{{ $messageContent }}</p>
</body>
</html>
