<?php

class PurchaseBill extends BaseModel {
    protected string $table = 'purchase_bills';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        $bills = $this->findAll('purchase_bills', [], 'created_at DESC', $limit, $offset);
        
        foreach ($bills as &$bill) {
            $bill['items'] = $this->getItems($bill['id']);
        }
        
        return $bills;
    }
    
    public function getById(int $id): ?array {
        $bill = $this->findOne('purchase_bills', ['id' => $id]);
        
        if ($bill) {
            $bill['items'] = $this->getItems($id);
        }
        
        return $bill;
    }
    
    public function create(array $data): int {
        return $this->insert('purchase_bills', $data);
    }
    
    public function updateBill(int $id, array $data): bool {
        unset($data['items']);
        return parent::update('purchase_bills', $data, ['id' => $id]);
    }
    
    public function deleteBill(int $id): bool {
        return parent::delete('purchase_bills', ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('purchase_bills');
    }
    
    public function getItems(int $billId): array {
        return $this->findAll('purchase_bill_items', ['bill_id' => $billId]);
    }
    
    public function addItem(int $billId, array $itemData): int {
        $itemData['bill_id'] = $billId;
        return $this->insert('purchase_bill_items', $itemData);
    }
    
    public function deleteItem(int $itemId): bool {
        return $this->delete('purchase_bill_items', ['id' => $itemId]);
    }
    
    public function deleteAllItems(int $billId): bool {
        return $this->delete('purchase_bill_items', ['bill_id' => $billId]);
    }
    
    public function calculateTotals(array $bill): array {
        if (empty($bill['items'])) {
            return [
                'subtotal' => 0,
                'discount_amt' => 0,
                'total' => 0
            ];
        }
        
        $subtotal = array_sum(array_map(fn($item) => $item['amount'] ?? 0, $bill['items']));
        $discount = $bill['discount'] ?? 0;
        $discountAmt = ($subtotal * $discount) / 100;
        $total = $subtotal - $discountAmt;
        
        return [
            'subtotal' => round($subtotal, 2),
            'discount_amt' => round($discountAmt, 2),
            'total' => round($total, 2)
        ];
    }
}
