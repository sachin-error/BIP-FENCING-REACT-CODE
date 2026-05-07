<?php

require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/BaseModel.php';
require_once __DIR__ . '/models/User.php';

try {
    $pdo = Database::connect();
    
    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute(['admin']);
    $exists = $stmt->fetch();
    
    if (!$exists) {
        // Insert admin user
        $password = password_hash('admin123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)");
        $stmt->execute(['admin', $password, 'Admin User', 'admin']);
        echo "Admin user created successfully.\n";
    } else {
        // Update password
        $password = password_hash('admin123', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = ?");
        $stmt->execute([$password, 'admin']);
        echo "Admin user password updated.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}