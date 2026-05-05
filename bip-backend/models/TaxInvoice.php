<?php

class TaxInvoice extends BaseModel {
    protected string $table = 'tax_invoices';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        $invoices = $this->findAll('tax_invoices', [], 'created_at DESC', $limit, $offset);
        
        foreach ($invoices as &$inv) {
            $inv['items'] = $this->getItems($inv['id']);
        }
        
        return $invoices;
    }
    
    public function getById(int $id): ?array {
        $invoice = $this->findOne('tax_invoices', ['id' => $id]);
        
        if ($invoice) {
            $invoice['items'] = $this->getItems($id);
        }
        
        return $invoice;
    }
    
    public function create(array $data): int {
        return $this->insert('tax_invoices', $data);
    }
    
    public function updateInvoice(int $id, array $data): bool {
        unset($data['items']);
        return parent::update('tax_invoices', $data, ['id' => $id]);
    }
    
    public function deleteInvoice(int $id): bool {
        return parent::delete('tax_invoices', ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('tax_invoices');
    }
    
    public function getItems(int $invoiceId): array {
        return $this->findAll('tax_invoice_items', ['invoice_id' => $invoiceId]);
    }
    
    public function addItem(int $invoiceId, array $itemData): int {
        $itemData['invoice_id'] = $invoiceId;
        return $this->insert('tax_invoice_items', $itemData);
    }
    
    public function deleteItem(int $itemId): bool {
        return $this->delete('tax_invoice_items', ['id' => $itemId]);
    }
    
    public function deleteAllItems(int $invoiceId): bool {
        return $this->delete('tax_invoice_items', ['invoice_id' => $invoiceId]);
    }
    
    public function calculateTotals(array $invoice): array {
        if (empty($invoice['items'])) {
            return [
                'subtotal' => 0,
                'cgst_amt' => 0,
                'sgst_amt' => 0,
                'total' => 0
            ];
        }
        
        $subtotal = array_sum(array_map(fn($item) => $item['amount'] ?? 0, $invoice['items']));
        $cgstPercent = $invoice['cgst_percent'] ?? 9;
        $sgstPercent = $invoice['sgst_percent'] ?? 9;
        
        $cgst = ($subtotal * $cgstPercent) / 100;
        $sgst = ($subtotal * $sgstPercent) / 100;
        $total = $subtotal + $cgst + $sgst;
        
        return [
            'subtotal' => round($subtotal, 2),
            'cgst_amt' => round($cgst, 2),
            'sgst_amt' => round($sgst, 2),
            'total' => round($total, 2)
        ];
    }
}
