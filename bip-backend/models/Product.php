<?php

class Product extends BaseModel {
    protected string $table = 'products';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        return $this->findAll('products', [], 'product_name ASC', $limit, $offset);
    }
    
    public function getById(int $id): ?array {
        return $this->findOne('products', ['id' => $id]);
    }
    
    public function getBySku(string $sku): ?array {
        return $this->findOne('products', ['sku' => $sku]);
    }
    
    public function create(array $data): int {
        return $this->insert('products', $data);
    }
    
    public function updateProduct(int $id, array $data): bool {
        return parent::update('products', $data, ['id' => $id]);
    }
    
    public function deleteProduct(int $id): bool {
        return parent::delete('products', ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('products');
    }
    
    public function getLowStockProducts(): array {
        $sql = "SELECT * FROM products WHERE stock_qty <= min_stock ORDER BY stock_qty ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function searchProducts(string $search, int $limit = 50): array {
        $sql = "SELECT * FROM products WHERE product_name LIKE ? OR sku LIKE ? LIMIT ?";
        $searchTerm = "%$search%";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$searchTerm, $searchTerm, $limit]);
        return $stmt->fetchAll();
    }
}
