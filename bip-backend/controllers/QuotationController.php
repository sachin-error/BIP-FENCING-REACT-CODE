<?php

class QuotationController {
    private Quotation $quotationModel;
    
    public function __construct() {
        $this->quotationModel = new Quotation();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            $quotations = $this->quotationModel->getAll($perPage, $offset);
            $total = $this->quotationModel->getTotalCount();
            
            Response::paginated($quotations, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $quotation = $this->quotationModel->getById($id);
            if (!$quotation) {
                Response::notFound('Quotation not found');
            }
            
            Response::success($quotation);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function create() {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['quote_no'])) $errors['quote_no'] = 'Quote number is required';
            if (empty($input['client_name'])) $errors['client_name'] = 'Client name is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $this->quotationModel->beginTransaction();
            try {
                // Calculate totals
                if (!empty($input['items'])) {
                    $totals = $this->quotationModel->calculateTotals($input);
                    $input = array_merge($input, $totals);
                }
                
                $items = $input['items'] ?? [];
                unset($input['items']);
                
                $quotationId = $this->quotationModel->create($input);
                
                // Add items
                foreach ($items as $item) {
                    $this->quotationModel->addItem($quotationId, $item);
                }
                
                $this->quotationModel->commit();
                
                $quotation = $this->quotationModel->getById($quotationId);
                Response::created($quotation);
            } catch (Exception $e) {
                $this->quotationModel->rollback();
                throw $e;
            }
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $quotation = $this->quotationModel->getById($id);
            if (!$quotation) {
                Response::notFound('Quotation not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $this->quotationModel->beginTransaction();
            try {
                $items = $input['items'] ?? [];
                unset($input['items']);
                
                $input['updated_at'] = date('Y-m-d H:i:s');
                
                // Calculate totals
                $tempData = array_merge($quotation, $input);
                $tempData['items'] = $items;
                $totals = $this->quotationModel->calculateTotals($tempData);
                $input = array_merge($input, $totals);
                
                $this->quotationModel->updateQuotation($id, $input);
                
                // Delete existing items and add new ones
                $this->quotationModel->deleteAllItems($id);
                foreach ($items as $item) {
                    $this->quotationModel->addItem($id, $item);
                }
                
                $this->quotationModel->commit();
                
                $updated = $this->quotationModel->getById($id);
                Response::success($updated);
            } catch (Exception $e) {
                $this->quotationModel->rollback();
                throw $e;
            }
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $quotation = $this->quotationModel->getById($id);
            if (!$quotation) {
                Response::notFound('Quotation not found');
            }
            
            $this->quotationModel->deleteQuotation($id);
            Response::success(['message' => 'Quotation deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function updateStatus($id) {
        try {
            AuthMiddleware::authenticate();
            
            $quotation = $this->quotationModel->getById($id);
            if (!$quotation) {
                Response::notFound('Quotation not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['status'])) {
                Response::validationError(['status' => 'Status is required']);
            }
            
            $this->quotationModel->updateStatus($id, $input['status']);
            $updated = $this->quotationModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
