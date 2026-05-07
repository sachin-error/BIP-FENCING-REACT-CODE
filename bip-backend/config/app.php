<?php

// Load environment variables
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
}

// Define app constants
define('APP_ENV', $_ENV['APP_ENV'] ?? 'production');
define('APP_URL', $_ENV['APP_URL'] ?? 'http://localhost:8000');
define('FRONTEND_URL', $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173');
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'secret-key-change-this');
define('JWT_EXPIRY', $_ENV['JWT_EXPIRY'] ?? 28800);
define('DEBUG', APP_ENV === 'development');

// Error reporting
if (DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
}

// Set timezone
date_default_timezone_set('Asia/Kolkata');
