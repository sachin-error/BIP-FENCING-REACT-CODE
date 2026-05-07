<?php

class PurchaseBillController {
    private PurchaseBill $billModel;
    
    public function __construct() {
        $this->billModel = new PurchaseBill();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            $bills = $this->billModel->getAll($perPage, $offset);
            $total = $this->billModel->getTotalCount();
            
            Response::paginated($bills, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $bill = $this->billModel->getById($id);
            if (!$bill) {
                Response::notFound('Bill not found');
            }
            
            Response::success($bill);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function create() {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['bill_no'])) $errors['bill_no'] = 'Bill number is required';
            if (empty($input['supplier_name'])) $errors['supplier_name'] = 'Supplier name is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            try {
                // Calculate totals
                if (!empty($input['items'])) {
                    $totals = $this->billModel->calculateTotals($input);
                    $input = array_merge($input, $totals);
                }
                
                $items = $input['items'] ?? [];
                unset($input['items']);
                
                $billId = $this->billModel->create($input);
                
                // Add items
                foreach ($items as $item) {
                    $this->billModel->addItem($billId, $item);
                }
                
                $bill = $this->billModel->getById($billId);
                Response::created($bill);
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
            
            $bill = $this->billModel->getById($id);
            if (!$bill) {
                Response::notFound('Bill not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $items = $input['items'] ?? [];
            unset($input['items']);
            
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            // Calculate totals
            $tempData = array_merge($bill, $input);
            $tempData['items'] = $items;
            $totals = $this->billModel->calculateTotals($tempData);
            $input = array_merge($input, $totals);
            
            $this->billModel->updateBill($id, $input);
            
            // Delete existing items and add new ones
            $this->billModel->deleteAllItems($id);
            foreach ($items as $item) {
                $this->billModel->addItem($id, $item);
            }
            
            $updated = $this->billModel->getById($id);
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $bill = $this->billModel->getById($id);
            if (!$bill) {
                Response::notFound('Bill not found');
            }
            
            $this->billModel->deleteBill($id);
            Response::success(['message' => 'Bill deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
