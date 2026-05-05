<?php

class Employee extends BaseModel {
    protected string $table = 'employees';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        return $this->findAll('employees', ['active' => 1], 'name ASC', $limit, $offset);
    }
    
    public function getById(int $id): ?array {
        return $this->findOne('employees', ['id' => $id]);
    }
    
    public function getByEmployeeId(string $employeeId): ?array {
        return $this->findOne('employees', ['employee_id' => $employeeId]);
    }
    
    public function create(array $data): int {
        return $this->insert('employees', $data);
    }
    
    public function updateEmployee(int $id, array $data): bool {
        return parent::update('employees', $data, ['id' => $id]);
    }
    
    public function deleteEmployee(int $id): bool {
        return parent::delete('employees', ['id' => $id]);
    }
    
    public function deactivate(int $id): bool {
        return parent::update('employees', ['active' => 0], ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('employees', ['active' => 1]);
    }
    
    public function search(string $search, int $limit = 50): array {
        $sql = "SELECT * FROM employees WHERE active = 1 AND (name LIKE ? OR employee_id LIKE ?) LIMIT ?";
        $searchTerm = "%$search%";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$searchTerm, $searchTerm, $limit]);
        return $stmt->fetchAll();
    }
}
