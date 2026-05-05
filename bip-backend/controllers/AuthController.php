<?php

use Firebase\JWT\JWT;

class AuthController {
    private User $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (empty($input['username'])) {
            Response::validationError(['username' => 'Username is required']);
        }
        if (empty($input['password'])) {
            Response::validationError(['password' => 'Password is required']);
        }
        
        try {
            // Find user
            $user = $this->userModel->findByUsername($input['username']);
            
            if (!$user || !password_verify($input['password'], $user['password'])) {
                Response::error('Invalid credentials', 401);
            }
            
            // Generate JWT token
            $issued_at = time();
            $expire = $issued_at + JWT_EXPIRY;
            
            $payload = [
                'sub' => $user['id'],
                'username' => $user['username'],
                'name' => $user['name'],
                'role' => $user['role'],
                'iat' => $issued_at,
                'exp' => $expire
            ];
            
            $token = JWT::encode($payload, JWT_SECRET, 'HS256');
            
            // Remove sensitive data
            unset($user['password']);
            
            Response::success([
                'user' => $user,
                'token' => $token,
                'expires_in' => JWT_EXPIRY
            ]);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function logout() {
        // Stateless logout - client just drops the token
        Response::success(['message' => 'Logged out successfully']);
    }
    
    public function me() {
        try {
            $user = AuthMiddleware::getUser();
            $userData = $this->userModel->getById($user['sub']);
            
            if (!$userData) {
                Response::notFound('User not found');
            }
            
            unset($userData['password']);
            Response::success($userData);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
