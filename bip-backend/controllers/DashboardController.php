<?php

class DashboardController {
    private Client $clientModel;
    private Quotation $quotationModel;
    private TaxInvoice $invoiceModel;
    
    public function __construct() {
        $this->clientModel = new Client();
        $this->quotationModel = new Quotation();
        $this->invoiceModel = new TaxInvoice();
    }
    
    public function getStats() {
        try {
            AuthMiddleware::authenticate();
            
            // Get today's date
            $today = date('Y-m-d');
            
            // Get statistics - simplified version
            $db = Database::getInstance();
            
            // Invoices today
            $stmt = $db->prepare("SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as total FROM tax_invoices WHERE DATE(created_at) = ?");
            $stmt->execute([$today]);
            $invoicesToday = $stmt->fetch();
            
            // Quotations sent
            $stmt = $db->prepare("SELECT COUNT(*) as count FROM quotations WHERE status IN ('sent', 'accepted')");
            $stmt->execute();
            $quotationsSent = $stmt->fetch();
            
            // Total clients
            $clientCount = $this->clientModel->getTotalCount();
            
            // Total products
            $stmt = $db->prepare("SELECT COUNT(*) as count FROM products");
            $stmt->execute();
            $productCount = $stmt->fetch();
            
            Response::success([
                'invoices_today' => (int)$invoicesToday['count'],
                'invoices_total_today' => (float)$invoicesToday['total'],
                'quotations_sent' => (int)$quotationsSent['count'],
                'total_clients' => $clientCount,
                'total_products' => (int)$productCount['count']
            ]);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getChart() {
        try {
            AuthMiddleware::authenticate();
            
            // Get sales data for last 7 days
            $db = Database::getInstance();
            $data = [];
            
            for ($i = 6; $i >= 0; $i--) {
                $date = date('Y-m-d', strtotime("-$i days"));
                $dayName = date('D', strtotime($date));
                
                $stmt = $db->prepare("SELECT COALESCE(SUM(total), 0) as total FROM tax_invoices WHERE DATE(created_at) = ?");
                $stmt->execute([$date]);
                $result = $stmt->fetch();
                
                $data[] = [
                    'date' => $dayName,
                    'sales' => (float)$result['total']
                ];
            }
            
            Response::success(['chart' => $data]);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getTargets() {
        try {
            AuthMiddleware::authenticate();
            
            Response::success([
                'income_target' => 500000,
                'income_current' => 250000,
                'expense_target' => 100000,
                'expense_current' => 50000,
                'sales_target' => 50,
                'sales_current' => 25,
                'invoices_target' => 20,
                'invoices_current' => 10
            ]);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
