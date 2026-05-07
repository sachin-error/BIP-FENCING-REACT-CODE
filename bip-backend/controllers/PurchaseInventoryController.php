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
            if (empty($input['po_no']))    $errors['po_no']    = 'PO number is required';
            if (empty($input['supplier'])) $errors['supplier'] = 'Supplier is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $items = $input['items'] ?? [];
            unset($input['items']);
            
            // Calculate total cost
            $totalCost = 0;
            foreach ($items as $item) {
                $totalCost += ($item['qty'] ?? 0) * ($item['cost_price'] ?? 0);
            }
            $input['total_cost']      = $totalCost;
            $input['amount_paid']     = $input['amount_paid']    ?? 0;
            $input['payment_method']  = $input['payment_method'] ?? null;
            $input['payment_ref']     = $input['payment_ref']    ?? null;
            $input['payment_date']    = $input['payment_date']   ?? null;
            $input['created_at']      = date('Y-m-d H:i:s');
            $input['updated_at']      = date('Y-m-d H:i:s');
            
            $invId = $this->inventoryModel->create($input);
            
            foreach ($items as $item) {
                $this->inventoryModel->addItem($invId, $item);
            }
            
            $inv = $this->inventoryModel->getById($invId);
            Response::created($inv);
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
            
            // Calculate total cost
            $totalCost = 0;
            foreach ($items as $item) {
                $totalCost += ($item['qty'] ?? 0) * ($item['cost_price'] ?? 0);
            }
            $input['total_cost']  = $totalCost;
            $input['updated_at']  = date('Y-m-d H:i:s');
            
            // FIX: was ->update(), correct method is ->updateInventory()
            $this->inventoryModel->updateInventory($id, $input);
            
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
            
            // FIX: was ->delete(), correct method is ->deleteInventory()
            $this->inventoryModel->deleteInventory($id);
            Response::success(['message' => 'Inventory deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}