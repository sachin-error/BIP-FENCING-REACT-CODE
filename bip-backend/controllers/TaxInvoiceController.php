<?php

class TaxInvoiceController {
    private TaxInvoice $invoiceModel;
    
    public function __construct() {
        $this->invoiceModel = new TaxInvoice();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            $invoices = $this->invoiceModel->getAll($perPage, $offset);
            $total = $this->invoiceModel->getTotalCount();
            
            Response::paginated($invoices, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $invoice = $this->invoiceModel->getById($id);
            if (!$invoice) {
                Response::notFound('Invoice not found');
            }
            
            Response::success($invoice);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function create() {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['invoice_no'])) $errors['invoice_no'] = 'Invoice number is required';
            if (empty($input['invoice_date'])) $errors['invoice_date'] = 'Invoice date is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            try {
                // Calculate totals
                if (!empty($input['items'])) {
                    $totals = $this->invoiceModel->calculateTotals($input);
                    $input = array_merge($input, $totals);
                }
                
                $items = $input['items'] ?? [];
                unset($input['items']);
                
                $invoiceId = $this->invoiceModel->create($input);
                
                // Add items
                foreach ($items as $item) {
                    $this->invoiceModel->addItem($invoiceId, $item);
                }
                
                $invoice = $this->invoiceModel->getById($invoiceId);
                Response::created($invoice);
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
            
            $invoice = $this->invoiceModel->getById($id);
            if (!$invoice) {
                Response::notFound('Invoice not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $items = $input['items'] ?? [];
            unset($input['items']);
            
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            // Calculate totals
            $tempData = array_merge($invoice, $input);
            $tempData['items'] = $items;
            $totals = $this->invoiceModel->calculateTotals($tempData);
            $input = array_merge($input, $totals);
            
            $this->invoiceModel->updateInvoice($id, $input);
            
            // Delete existing items and add new ones
            $this->invoiceModel->deleteAllItems($id);
            foreach ($items as $item) {
                $this->invoiceModel->addItem($id, $item);
            }
            
            $updated = $this->invoiceModel->getById($id);
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $invoice = $this->invoiceModel->getById($id);
            if (!$invoice) {
                Response::notFound('Invoice not found');
            }
            
            $this->invoiceModel->deleteInvoice($id);
            Response::success(['message' => 'Invoice deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
