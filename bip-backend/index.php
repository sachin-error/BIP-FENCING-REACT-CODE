<?php

// ============================================
// BIP Fencing Admin Panel - API Entry Point
// ============================================

// Load configuration
require_once __DIR__ . '/config/app.php';

// Load database connection
require_once __DIR__ . '/config/database.php';

// Load helpers
require_once __DIR__ . '/helpers/Response.php';

// Load middleware
require_once __DIR__ . '/middleware/CorsMiddleware.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';

// Load models
require_once __DIR__ . '/models/BaseModel.php';
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/Client.php';
require_once __DIR__ . '/models/Product.php';
require_once __DIR__ . '/models/Quotation.php';
require_once __DIR__ . '/models/TaxInvoice.php';
require_once __DIR__ . '/models/PurchaseBill.php';
require_once __DIR__ . '/models/PurchaseInventory.php';
require_once __DIR__ . '/models/Employee.php';
require_once __DIR__ . '/models/Salary.php';
require_once __DIR__ . '/models/Attendance.php';
require_once __DIR__ . '/models/OT.php';

// Load controllers
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/DashboardController.php';
require_once __DIR__ . '/controllers/ClientController.php';
require_once __DIR__ . '/controllers/ProductController.php';
require_once __DIR__ . '/controllers/QuotationController.php';
require_once __DIR__ . '/controllers/TaxInvoiceController.php';
require_once __DIR__ . '/controllers/PurchaseBillController.php';
require_once __DIR__ . '/controllers/PurchaseInventoryController.php';
require_once __DIR__ . '/controllers/EmployeeController.php';
require_once __DIR__ . '/controllers/SalaryController.php';
require_once __DIR__ . '/controllers/AttendanceController.php';
require_once __DIR__ . '/controllers/OTController.php';

// Load firebase JWT
require_once __DIR__ . '/vendor/autoload.php';

// ============================================
// Router
// ============================================

class Router {
    private array $routes = [];
    private string $requestMethod;
    private string $requestUri;
    private array $params = [];
    
    public function __construct() {
        $this->requestMethod = $_SERVER['REQUEST_METHOD'];
        $this->requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Load routes
        $this->routes = require __DIR__ . '/routes/api.php';
    }
    
    public function dispatch(): void {
        // Run CORS middleware first
        CorsMiddleware::handle();
        
        // Match route
        $route = $this->matchRoute();
        
        if (!$route) {
            Response::notFound('Endpoint not found');
        }
        
        // Parse controller and action
        list($controllerName, $actionName) = explode('@', $route);
        
        // Check if route requires authentication (all protected routes start with /api)
        if (!in_array($this->requestUri, ['/api/auth/login'])) {
            if (strpos($this->requestUri, '/api/') === 0 && $this->requestUri !== '/api/auth/login') {
                AuthMiddleware::authenticate();
            }
        }
        
        // Instantiate controller and call action
        try {
            $controller = new $controllerName();
            
            if (!method_exists($controller, $actionName)) {
                Response::notFound("Action $actionName not found in controller $controllerName");
            }
            
            // Call action with params
            if (empty($this->params)) {
                $controller->$actionName();
            } else {
                call_user_func_array([$controller, $actionName], array_values($this->params));
            }
        } catch (Exception $e) {
            if (DEBUG) {
                Response::serverError($e->getMessage());
            } else {
                Response::serverError('Internal server error');
            }
        }
    }
    
    private function matchRoute(): ?string {
        foreach ($this->routes as $routePattern => $controllerAction) {
            list($method, $path) = explode('|', $routePattern);
            
            if ($method !== $this->requestMethod) {
                continue;
            }
            
            // Convert path pattern to regex
            $regex = $this->pathToRegex($path);
            
            if (preg_match($regex, $this->requestUri, $matches)) {
                // Extract params
                array_shift($matches); // Remove the full match
                $paramNames = $this->extractParamNames($path);
                
                foreach ($paramNames as $index => $name) {
                    $this->params[$name] = $matches[$index] ?? null;
                }
                
                return $controllerAction;
            }
        }
        
        return null;
    }
    
    private function pathToRegex(string $path): string {
        $regex = preg_quote($path, '#');
        $regex = preg_replace('#\\\{([a-zA-Z_][a-zA-Z0-9_]*)\\\}#', '([a-zA-Z0-9_-]+)', $regex);
        return '#^' . $regex . '$#';
    }
    
    private function extractParamNames(string $path): array {
        $names = [];
        if (preg_match_all('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', $path, $matches)) {
            $names = $matches[1];
        }
        return $names;
    }
}

// ============================================
// Run Application
// ============================================

try {
    $router = new Router();
    $router->dispatch();
} catch (Exception $e) {
    if (DEBUG) {
        Response::serverError($e->getMessage());
    } else {
        Response::serverError('Internal server error');
    }
}
