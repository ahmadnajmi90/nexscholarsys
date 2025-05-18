<?php

/**
 * CV Upload Logger - Diagnostic Tool
 * 
 * This script helps troubleshoot file upload issues on production by logging
 * detailed information about uploads, focusing on file paths, permissions,
 * and temporary directories.
 */

// For safety, enable error reporting but disable displaying errors
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Create a log file in the same directory
$logFile = __DIR__ . '/upload_diagnostic_' . date('Y-m-d-H-i-s') . '.log';

// Simple function to log messages
function log_message($message) {
    global $logFile;
    $timestamp = date('[Y-m-d H:i:s]');
    file_put_contents($logFile, "{$timestamp} {$message}" . PHP_EOL, FILE_APPEND);
}

// Log basic server information
log_message('===== Upload Diagnostic Initiated =====');
log_message('PHP version: ' . phpversion());
log_message('Server software: ' . $_SERVER['SERVER_SOFTWARE']);
log_message('OS type: ' . PHP_OS);
log_message('Server name: ' . $_SERVER['SERVER_NAME']);
log_message('Current script: ' . $_SERVER['SCRIPT_FILENAME']);

// Log upload_max_filesize and post_max_size settings
log_message('upload_max_filesize: ' . ini_get('upload_max_filesize'));
log_message('post_max_size: ' . ini_get('post_max_size'));
log_message('max_file_uploads: ' . ini_get('max_file_uploads'));
log_message('max_input_time: ' . ini_get('max_input_time'));
log_message('max_execution_time: ' . ini_get('max_execution_time'));

// Log temporary directory configuration
log_message('sys_get_temp_dir(): ' . sys_get_temp_dir());
log_message('upload_tmp_dir (php.ini): ' . ini_get('upload_tmp_dir'));

// Check if temporary directories exist and are writable
$tempDirs = [
    sys_get_temp_dir(),
    ini_get('upload_tmp_dir'),
    '/tmp',
    '/var/tmp'
];

foreach (array_unique(array_filter($tempDirs)) as $dir) {
    log_message("Directory {$dir} exists: " . (file_exists($dir) ? 'Yes' : 'No'));
    log_message("Directory {$dir} is writable: " . (is_writable($dir) ? 'Yes' : 'No'));
    
    if (file_exists($dir) && is_readable($dir)) {
        $permissions = fileperms($dir);
        $octalPerms = substr(sprintf('%o', $permissions), -4);
        log_message("Directory {$dir} permissions: {$octalPerms}");
        
        // Try getting owner/group information
        $owner = posix_getpwuid(fileowner($dir));
        $group = posix_getgrgid(filegroup($dir));
        log_message("Directory {$dir} owner: " . ($owner ? $owner['name'] : 'unknown'));
        log_message("Directory {$dir} group: " . ($group ? $group['name'] : 'unknown'));
    }
}

// Check storage/app and storage/app/public directories if present
$storageDirectories = [
    __DIR__ . '/../storage/app',
    __DIR__ . '/../storage/app/public',
    __DIR__ . '/../storage/app/public/CV_files'
];

log_message('---- Storage Directories ----');
foreach ($storageDirectories as $dir) {
    if (file_exists($dir)) {
        log_message("Directory {$dir} exists: Yes");
        log_message("Directory {$dir} is writable: " . (is_writable($dir) ? 'Yes' : 'No'));
        
        $permissions = fileperms($dir);
        $octalPerms = substr(sprintf('%o', $permissions), -4);
        log_message("Directory {$dir} permissions: {$octalPerms}");
        
        // Try getting owner/group information if available
        if (function_exists('posix_getpwuid')) {
            $owner = posix_getpwuid(fileowner($dir));
            $group = posix_getgrgid(filegroup($dir));
            log_message("Directory {$dir} owner: " . ($owner ? $owner['name'] : 'unknown'));
            log_message("Directory {$dir} group: " . ($group ? $group['name'] : 'unknown'));
        }
    } else {
        log_message("Directory {$dir} exists: No");
    }
}

// Check for file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    log_message('==== File Upload Detected ====');
    
    if (empty($_FILES)) {
        log_message('No files were uploaded or $_FILES is empty');
        log_message('Raw POST data size: ' . strlen(file_get_contents('php://input')) . ' bytes');
    } else {
        log_message('$_FILES array contents: ' . json_encode($_FILES));
        
        foreach ($_FILES as $inputName => $fileInfo) {
            log_message("Processing file input: {$inputName}");
            
            if (is_array($fileInfo['error'])) {
                // Multiple files uploaded with this input name
                log_message("Multiple files detected for input {$inputName}");
                
                for ($i = 0; $i < count($fileInfo['error']); $i++) {
                    log_message("File #{$i} details:");
                    log_message("  Original name: {$fileInfo['name'][$i]}");
                    log_message("  Type: {$fileInfo['type'][$i]}");
                    log_message("  Temporary file: {$fileInfo['tmp_name'][$i]}");
                    log_message("  Error code: {$fileInfo['error'][$i]}");
                    log_message("  Size: {$fileInfo['size'][$i]} bytes");
                    
                    // Check temporary file
                    if (!empty($fileInfo['tmp_name'][$i]) && $fileInfo['error'][$i] === UPLOAD_ERR_OK) {
                        processTemporaryFile($fileInfo['tmp_name'][$i]);
                    } else {
                        // Log error message
                        $errorMessage = getUploadErrorMessage($fileInfo['error'][$i]);
                        log_message("  Upload error: {$errorMessage}");
                    }
                }
            } else {
                // Single file
                log_message("Single file for input {$inputName}:");
                log_message("  Original name: {$fileInfo['name']}");
                log_message("  Type: {$fileInfo['type']}");
                log_message("  Temporary file: {$fileInfo['tmp_name']}");
                log_message("  Error code: {$fileInfo['error']}");
                log_message("  Size: {$fileInfo['size']} bytes");
                
                // Check temporary file
                if (!empty($fileInfo['tmp_name']) && $fileInfo['error'] === UPLOAD_ERR_OK) {
                    processTemporaryFile($fileInfo['tmp_name']);
                } else {
                    // Log error message
                    $errorMessage = getUploadErrorMessage($fileInfo['error']);
                    log_message("  Upload error: {$errorMessage}");
                }
            }
        }
    }
    
    // Log raw POST data if no files were detected or there was an error
    if (empty($_FILES) || isset($_FILES['CV_file']['error']) && $_FILES['CV_file']['error'] !== UPLOAD_ERR_OK) {
        $rawPostSize = strlen(file_get_contents('php://input'));
        log_message("Raw POST data size: {$rawPostSize} bytes");
        
        if ($rawPostSize > 0 && $rawPostSize < 10000) {
            // Only log raw POST data if it's reasonably small
            log_message("Raw POST data: " . file_get_contents('php://input'));
        }
    }
    
    log_message('==== End of File Upload Processing ====');
    
    // Try to move the file to a successful location
    if (!empty($_FILES['CV_file']['tmp_name']) && $_FILES['CV_file']['error'] === UPLOAD_ERR_OK) {
        $targetDir = __DIR__ . '/cv_uploads';
        
        // Create directory if it doesn't exist
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
            log_message("Created upload directory: {$targetDir}");
        }
        
        $targetFile = $targetDir . '/' . time() . '_' . basename($_FILES['CV_file']['name']);
        
        try {
            if (move_uploaded_file($_FILES['CV_file']['tmp_name'], $targetFile)) {
                log_message("File successfully moved to: {$targetFile}");
                log_message("Final file exists: " . (file_exists($targetFile) ? 'Yes' : 'No'));
                log_message("Final file size: " . filesize($targetFile) . " bytes");
            } else {
                log_message("Failed to move uploaded file to: {$targetFile}");
            }
        } catch (Exception $e) {
            log_message("Exception moving file: " . $e->getMessage());
        }
    }
}

/**
 * Process and check a temporary uploaded file
 */
function processTemporaryFile($tmpFilePath) {
    log_message("  Checking temporary file: {$tmpFilePath}");
    
    if (file_exists($tmpFilePath)) {
        log_message("  Temporary file exists: Yes");
        log_message("  Temporary file size: " . filesize($tmpFilePath) . " bytes");
        log_message("  Temporary file is readable: " . (is_readable($tmpFilePath) ? 'Yes' : 'No'));
        
        $permissions = fileperms($tmpFilePath);
        $octalPerms = substr(sprintf('%o', $permissions), -4);
        log_message("  Temporary file permissions: {$octalPerms}");
        
        // Get temp file directory
        $tmpDir = dirname($tmpFilePath);
        log_message("  Temporary file directory: {$tmpDir}");
        log_message("  Directory is writable: " . (is_writable($tmpDir) ? 'Yes' : 'No'));
        
        // Try opening the file to verify content
        $handle = @fopen($tmpFilePath, 'r');
        if ($handle) {
            $fileStart = fread($handle, min(filesize($tmpFilePath), 100));
            fclose($handle);
            log_message("  File starting bytes (hex): " . bin2hex(substr($fileStart, 0, 20)));
        } else {
            log_message("  Failed to open temporary file for reading");
        }
    } else {
        log_message("  Temporary file does not exist or is not accessible");
        
        // Check the parent directory
        $tmpDir = dirname($tmpFilePath);
        log_message("  Parent directory: {$tmpDir}");
        log_message("  Parent directory exists: " . (file_exists($tmpDir) ? 'Yes' : 'No'));
        log_message("  Parent directory is writable: " . (is_writable($tmpDir) ? 'Yes' : 'No'));
        
        // List files in the temporary directory
        if (file_exists($tmpDir) && is_readable($tmpDir)) {
            $files = scandir($tmpDir);
            log_message("  Files in directory: " . implode(", ", array_slice($files, 0, 10)) . (count($files) > 10 ? "... and " . (count($files) - 10) . " more" : ""));
        }
    }
}

/**
 * Get human-readable message for upload error code
 */
function getUploadErrorMessage($errorCode) {
    $errors = [
        UPLOAD_ERR_OK => 'No error, file upload successful',
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive in php.ini',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive in HTML form',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder for uploads',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write uploaded file to disk',
        UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
    ];
    
    return isset($errors[$errorCode]) ? $errors[$errorCode] : "Unknown error ({$errorCode})";
}

// Return a diagnostic message to the user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Upload diagnostic complete. Check the server logs for details.',
        'log_file' => basename($logFile)
    ]);
} else {
    // Display a form for testing uploads
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV Upload Diagnostic</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        button {
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        pre {
            background-color: #f5f5f5;
            padding: 10px;
            border: 1px solid #ddd;
            overflow: auto;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>CV Upload Diagnostic Tool</h1>
    <p>This tool logs detailed information about file uploads to help troubleshoot issues in production.</p>
    
    <form method="post" enctype="multipart/form-data">
        <div class="form-group">
            <label for="cv_file">Select CV File:</label>
            <input type="file" id="cv_file" name="CV_file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
        </div>
        <button type="submit">Upload & Diagnose</button>
    </form>
    
    <div class="log-info">
        <h2>Diagnostic Information</h2>
        <p>System information and upload parameters are being logged to: <code><?php echo basename($logFile); ?></code></p>
        <pre><?php 
            // Display the first few log lines to show system info
            if (file_exists($logFile)) {
                $logs = file($logFile, FILE_IGNORE_NEW_LINES);
                foreach (array_slice($logs, 0, 15) as $line) {
                    echo htmlspecialchars($line) . "\n";
                }
                if (count($logs) > 15) {
                    echo "... (see log file for complete information)";
                }
            }
        ?></pre>
    </div>
</body>
</html>
<?php
}
?> 