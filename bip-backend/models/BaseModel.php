<?php

class BaseModel {
    protected PDO $db;
    protected string $table = '';
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    protected function query(string $sql, array $params = []): PDOStatement {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
    
    protected function insert(string $table, array $data): int {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($data));
        
        return (int)$this->db->lastInsertId();
    }
    
    protected function update(string $table, array $data, array $where): bool {
        $set = implode(', ', array_map(fn($k) => "$k = ?", array_keys($data)));
        
        $whereClause = implode(' AND ', array_map(fn($k) => "$k = ?", array_keys($where)));
        
        $sql = "UPDATE $table SET $set WHERE $whereClause";
        
        $params = array_merge(array_values($data), array_values($where));
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
    
    protected function delete(string $table, array $where): bool {
        $whereClause = implode(' AND ', array_map(fn($k) => "$k = ?", array_keys($where)));
        $sql = "DELETE FROM $table WHERE $whereClause";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute(array_values($where));
    }
    
    protected function findOne(string $table, array $where): ?array {
        $whereClause = implode(' AND ', array_map(fn($k) => "$k = ?", array_keys($where)));
        $sql = "SELECT * FROM $table WHERE $whereClause LIMIT 1";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($where));
        
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    protected function findAll(string $table, array $where = [], string $orderBy = '', int $limit = 0, int $offset = 0): array {
        $sql = "SELECT * FROM $table";
        
        if (!empty($where)) {
            $whereClause = implode(' AND ', array_map(fn($k) => "$k = ?", array_keys($where)));
            $sql .= " WHERE $whereClause";
        }
        
        if (!empty($orderBy)) {
            $sql .= " ORDER BY $orderBy";
        }
        
        if ($limit > 0) {
            $sql .= " LIMIT $limit";
        }
        
        if ($offset > 0) {
            $sql .= " OFFSET $offset";
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($where));
        
        return $stmt->fetchAll();
    }
    
    protected function count(string $table, array $where = []): int {
        $sql = "SELECT COUNT(*) as count FROM $table";
        
        if (!empty($where)) {
            $whereClause = implode(' AND ', array_map(fn($k) => "$k = ?", array_keys($where)));
            $sql .= " WHERE $whereClause";
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(array_values($where));
        
        $result = $stmt->fetch();
        return (int)($result['count'] ?? 0);
    }
    
    public function beginTransaction(): void {
        $this->db->beginTransaction();
    }
    
    public function commit(): void {
        $this->db->commit();
    }
    
    public function rollback(): void {
        $this->db->rollBack();
    }
    
    public function inTransaction(): bool {
        return $this->db->inTransaction();
    }
}
