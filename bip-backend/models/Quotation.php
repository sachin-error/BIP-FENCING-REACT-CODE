<?php

class Quotation extends BaseModel {
    protected string $table = 'quotations';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        $quotations = $this->findAll('quotations', [], 'created_at DESC', $limit, $offset);
        
        foreach ($quotations as &$q) {
            $q['items'] = $this->getItems($q['id']);
        }
        
        return $quotations;
    }
    
    public function getById(int $id): ?array {
        $quotation = $this->findOne('quotations', ['id' => $id]);
        
        if ($quotation) {
            $quotation['items'] = $this->getItems($id);
        }
        
        return $quotation;
    }
    
    public function create(array $data): int {
        return $this->insert('quotations', $data);
    }
    
    public function updateQuotation(int $id, array $data): bool {
        unset($data['items']);
        return parent::update('quotations', $data, ['id' => $id]);
    }
    
    public function deleteQuotation(int $id): bool {
        return parent::delete('quotations', ['id' => $id]);
    }
    
    public function updateStatus(int $id, string $status): bool {
        return parent::update('quotations', ['status' => $status], ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('quotations');
    }
    
    public function getItems(int $quotationId): array {
        return $this->findAll('quotation_items', ['quotation_id' => $quotationId]);
    }
    
    public function addItem(int $quotationId, array $itemData): int {
        $itemData['quotation_id'] = $quotationId;
        return $this->insert('quotation_items', $itemData);
    }
    
    public function deleteItem(int $itemId): bool {
        return $this->delete('quotation_items', ['id' => $itemId]);
    }
    
    public function deleteAllItems(int $quotationId): bool {
        return $this->delete('quotation_items', ['quotation_id' => $quotationId]);
    }
    
    public function calculateTotals(array $quotation): array {
        if (empty($quotation['items'])) {
            $quotation['subtotal'] = 0;
            $quotation['discount_amt'] = 0;
            $quotation['taxable_amt'] = 0;
            $quotation['cgst_amt'] = 0;
            $quotation['sgst_amt'] = 0;
            $quotation['total'] = 0;
            return $quotation;
        }
        
        $subtotal = array_sum(array_map(fn($item) => $item['amount'] ?? 0, $quotation['items']));
        $discount = $quotation['discount'] ?? 0;
        $discountAmt = ($subtotal * $discount) / 100;
        $taxable = $subtotal - $discountAmt;
        $taxPercent = $quotation['tax_percent'] ?? 18;
        $taxPerHalf = $taxPercent / 2; // 9% CGST, 9% SGST
        $cgst = ($taxable * $taxPerHalf) / 100;
        $sgst = ($taxable * $taxPerHalf) / 100;
        $total = $taxable + $cgst + $sgst;
        
        return [
            'subtotal' => round($subtotal, 2),
            'discount_amt' => round($discountAmt, 2),
            'taxable_amt' => round($taxable, 2),
            'cgst_amt' => round($cgst, 2),
            'sgst_amt' => round($sgst, 2),
            'total' => round($total, 2)
        ];
    }
}
