<?php

require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';

try {
    $pdo = Database::connect();
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM salary_records");
    $result = $stmt->fetch();
    echo "Salary records count: " . $result['count'] . "\n";
    
    if ($result['count'] > 0) {
        $stmt = $pdo->query("SELECT sr.*, e.name FROM salary_records sr JOIN employees e ON sr.employee_id = e.id LIMIT 5");
        $records = $stmt->fetchAll();
        foreach ($records as $record) {
            echo "ID: {$record['id']}, Employee: {$record['name']}, Month: {$record['month']}, Year: {$record['year']}, Net: {$record['net_salary']}\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}