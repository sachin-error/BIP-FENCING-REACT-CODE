<?php

class Response {
    public static function json($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }
    
    public static function success($data = [], int $statusCode = 200): void {
        self::json(['success' => true, 'data' => $data], $statusCode);
    }
    
    public static function created($data = []): void {
        self::json(['success' => true, 'data' => $data], 201);
    }
    
    public static function error(string $message, int $statusCode = 400): void {
        self::json(['success' => false, 'message' => $message], $statusCode);
    }
    
    public static function notFound(string $message = 'Resource not found'): void {
        self::json(['success' => false, 'message' => $message], 404);
    }
    
    public static function unauthorized(string $message = 'Unauthorized'): void {
        http_response_code(401);
        self::json(['success' => false, 'message' => $message], 401);
    }
    
    public static function forbidden(string $message = 'Forbidden'): void {
        http_response_code(403);
        self::json(['success' => false, 'message' => $message], 403);
    }
    
    public static function validationError(array $errors): void {
        self::json(
            ['success' => false, 'message' => 'Validation failed', 'errors' => $errors],
            422
        );
    }
    
    public static function serverError(string $message = 'Internal server error'): void {
        self::json(['success' => false, 'message' => $message], 500);
    }
    
    public static function paginated(array $data, int $total, int $page, int $perPage): void {
        $lastPage = ceil($total / $perPage);
        self::json([
            'success' => true,
            'data' => $data,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'per_page' => $perPage,
                'last_page' => $lastPage
            ]
        ]);
    }
}
