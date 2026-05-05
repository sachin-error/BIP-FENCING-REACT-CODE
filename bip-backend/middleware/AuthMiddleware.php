<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {
    private static ?array $user = null;
    
    public static function authenticate(): array {
        if (self::$user !== null) {
            return self::$user;
        }
        
        // Get the Authorization header
        $header = getallheaders()['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;
        
        if (!$header) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authorization header missing']);
            exit;
        }
        
        // Extract token from "Bearer <token>"
        if (!preg_match('/Bearer\s+(.+)/', $header, $matches)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid authorization format']);
            exit;
        }
        
        $token = $matches[1];
        
        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
            self::$user = (array)$decoded;
            return self::$user;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
            exit;
        }
    }
    
    public static function getUser(): array {
        return self::$user ?? self::authenticate();
    }
    
    public static function getUserId(): int {
        $user = self::getUser();
        return $user['sub'] ?? 0;
    }
    
    public static function getUsername(): string {
        $user = self::getUser();
        return $user['username'] ?? '';
    }
    
    public static function getRole(): string {
        $user = self::getUser();
        return $user['role'] ?? '';
    }
}
