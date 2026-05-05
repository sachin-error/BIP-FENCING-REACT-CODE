<?php

class ProductController {
    private Product $productModel;
    
    public function __construct() {
        $this->productModel = new Product();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            $products = $this->productModel->getAll($perPage, $offset);
            $total = $this->productModel->getTotalCount();
            
            Response::paginated($products, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $product = $this->productModel->getById($id);
            if (!$product) {
                Response::notFound('Product not found');
            }
            
            Response::success($product);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function create() {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['product_name'])) $errors['product_name'] = 'Product name is required';
            if (empty($input['sku'])) $errors['sku'] = 'SKU is required';
            if (!isset($input['cost_price'])) $errors['cost_price'] = 'Cost price is required';
            if (!isset($input['selling_price'])) $errors['selling_price'] = 'Selling price is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $productId = $this->productModel->create($input);
            $product = $this->productModel->getById($productId);
            
            Response::created($product);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $product = $this->productModel->getById($id);
            if (!$product) {
                Response::notFound('Product not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $this->productModel->updateProduct($id, $input);
            $updated = $this->productModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $product = $this->productModel->getById($id);
            if (!$product) {
                Response::notFound('Product not found');
            }
            
            $this->productModel->deleteProduct($id);
            Response::success(['message' => 'Product deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getLowStock() {
        try {
            AuthMiddleware::authenticate();
            
            $products = $this->productModel->getLowStockProducts();
            Response::success($products);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function search() {
        try {
            AuthMiddleware::authenticate();
            
            $search = $_GET['q'] ?? '';
            
            if (empty($search)) {
                Response::validationError(['q' => 'Search term is required']);
            }
            
            $products = $this->productModel->searchProducts($search);
            Response::success($products);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
