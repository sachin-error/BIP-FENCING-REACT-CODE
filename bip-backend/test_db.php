<?php

require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';

try {
    $pdo = Database::connect();
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "Database connected. Users count: " . $result['count'] . "\n";
} catch (Exception $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}