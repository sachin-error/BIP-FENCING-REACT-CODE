<?php

class PurchaseInventoryController {
    private PurchaseInventory $inventoryModel;
    
    public function __construct() {
        $this->inventoryModel = new PurchaseInventory();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            $inventory = $this->inventoryModel->getAll($perPage, $offset);
            $total = $this->inventoryModel->getTotalCount();
            
            Response::paginated($inventory, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $inv = $this->inventoryModel->getById($id);
            if (!$inv) {
                Response::notFound('Inventory not found');
            }
            
            Response::success($inv);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function create() {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['po_no'])) $errors['po_no'] = 'PO number is required';
            if (empty($input['supplier'])) $errors['supplier'] = 'Supplier is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            try {
                $items = $input['items'] ?? [];
                unset($input['items']);
                
                // Calculate total cost
                $totalCost = 0;
                foreach ($items as $item) {
                    $totalCost += ($item['qty'] ?? 0) * ($item['cost_price'] ?? 0);
                }
                $input['total_cost'] = $totalCost;
                
                $invId = $this->inventoryModel->create($input);
                
                // Add items
                foreach ($items as $item) {
                    $this->inventoryModel->addItem($invId, $item);
                }
                
                $inv = $this->inventoryModel->getById($invId);
                Response::created($inv);
            } catch (Exception $e) {
                throw $e;
            }
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $inv = $this->inventoryModel->getById($id);
            if (!$inv) {
                Response::notFound('Inventory not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $items = $input['items'] ?? [];
            unset($input['items']);
            
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            // Calculate total cost
            $totalCost = 0;
            foreach ($items as $item) {
                $totalCost += ($item['qty'] ?? 0) * ($item['cost_price'] ?? 0);
            }
            $input['total_cost'] = $totalCost;
            
            $this->inventoryModel->update($id, $input);
            
            // Delete existing items and add new ones
            $this->inventoryModel->deleteAllItems($id);
            foreach ($items as $item) {
                $this->inventoryModel->addItem($id, $item);
            }
            
            $updated = $this->inventoryModel->getById($id);
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $inv = $this->inventoryModel->getById($id);
            if (!$inv) {
                Response::notFound('Inventory not found');
            }
            
            $this->inventoryModel->delete($id);
            Response::success(['message' => 'Inventory deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
