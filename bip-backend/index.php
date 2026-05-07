<?php

require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/Response.php';
require_once __DIR__ . '/middleware/CorsMiddleware.php';
require_once __DIR__ . '/middleware/AuthMiddleware.php';
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
require_once __DIR__ . '/vendor/autoload.php';

class Router {
    private array $routes = [];
    private string $requestMethod;
    private string $requestUri;
    private array $params = [];

    public function __construct() {
        $this->requestMethod = $_SERVER['REQUEST_METHOD'];
        $this->requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $this->routes = require __DIR__ . '/routes/api.php';
    }

    public function dispatch(): void {
        CorsMiddleware::handle();

        $route = $this->matchRoute();

        if (!$route) {
            Response::notFound('Endpoint not found');
        }

        list($controllerName, $actionName) = explode('@', $route);

        // Single clean auth check — protect all /api/* except login
        if (strpos($this->requestUri, '/api/') === 0 && $this->requestUri !== '/api/auth/login') {
            AuthMiddleware::authenticate();
        }

        try {
            $controller = new $controllerName();

            if (!method_exists($controller, $actionName)) {
                Response::notFound("Action $actionName not found in controller $controllerName");
            }

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

            $regex = $this->pathToRegex($path);

            if (preg_match($regex, $this->requestUri, $matches)) {
                array_shift($matches);
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