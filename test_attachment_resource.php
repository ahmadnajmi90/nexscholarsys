<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test the AttachmentResource
$attachment = new \App\Models\Messaging\MessageAttachment([
    'id' => 1,
    'message_id' => 1,
    'disk' => 'public',
    'path' => 'messaging/attachments/1/test.jpg',
    'mime' => 'image/jpeg',
    'bytes' => 1024,
    'filename' => 'test.jpg'
]);

$resource = new \App\Http\Resources\Messaging\AttachmentResource($attachment);
$result = $resource->toArray(app('request'));

echo "Public disk attachment URL test:\n";
echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";

// Test with private disk
$attachment2 = new \App\Models\Messaging\MessageAttachment([
    'id' => 2,
    'message_id' => 2,
    'disk' => 'local',
    'path' => 'messaging/attachments/2/test.pdf',
    'mime' => 'application/pdf',
    'bytes' => 2048,
    'filename' => 'test.pdf'
]);

$resource2 = new \App\Http\Resources\Messaging\AttachmentResource($attachment2);
$result2 = $resource2->toArray(app('request'));

echo "Private disk attachment URL test:\n";
echo json_encode($result2, JSON_PRETTY_PRINT) . "\n";
