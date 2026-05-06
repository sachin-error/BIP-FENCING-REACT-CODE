<?php

class PurchaseInventory extends BaseModel {
    protected string $table = 'purchase_inventory';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        $inventory = $this->findAll('purchase_inventory', [], 'created_at DESC', $limit, $offset);
        
        foreach ($inventory as &$inv) {
            $inv['items'] = $this->getItems($inv['id']);
        }
        
        return $inventory;
    }
    
    public function getById(int $id): ?array {
        $inv = $this->findOne('purchase_inventory', ['id' => $id]);
        
        if ($inv) {
            $inv['items'] = $this->getItems($id);
        }
        
        return $inv;
    }
    
    public function create(array $data): int {
        return $this->insert('purchase_inventory', $data);
    }
    
    public function updateInventory(int $id, array $data): bool {
        unset($data['items']);
        return parent::update('purchase_inventory', $data, ['id' => $id]);
    }
    
    public function deleteInventory(int $id): bool {
        return parent::delete('purchase_inventory', ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('purchase_inventory');
    }
    
    public function getItems(int $inventoryId): array {
        return $this->findAll('purchase_inventory_items', ['inventory_id' => $inventoryId]);
    }
    
    public function addItem(int $inventoryId, array $itemData): int {
        $itemData['inventory_id'] = $inventoryId;
        return $this->insert('purchase_inventory_items', $itemData);
    }
    
    public function deleteItem(int $itemId): bool {
        return $this->delete('purchase_inventory_items', ['id' => $itemId]);
    }
    
    public function deleteAllItems(int $inventoryId): bool {
        return $this->delete('purchase_inventory_items', ['inventory_id' => $inventoryId]);
    }
}
