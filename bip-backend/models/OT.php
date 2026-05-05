<?php

class OT extends BaseModel {
    protected string $table = 'ot_records';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        return $this->findAll('ot_records', [], 'ot_date DESC', $limit, $offset);
    }
    
    public function getById(int $id): ?array {
        return $this->findOne('ot_records', ['id' => $id]);
    }
    
    public function create(array $data): int {
        return $this->insert('ot_records', $data);
    }
    
    public function updateOT(int $id, array $data): bool {
        return parent::update('ot_records', $data, ['id' => $id]);
    }
    
    public function deleteOT(int $id): bool {
        return parent::delete('ot_records', ['id' => $id]);
    }
    
    public function updateStatus(int $id, string $status): bool {
        return parent::update('ot_records', ['status' => $status], ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('ot_records');
    }
    
    public function getByStatus(string $status): array {
        $sql = "SELECT ot.*, e.name, e.employee_id FROM ot_records ot 
                JOIN employees e ON ot.employee_id = e.id 
                WHERE ot.status = ? 
                ORDER BY ot.ot_date DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$status]);
        return $stmt->fetchAll();
    }
    
    public function getByEmployee(int $employeeId): array {
        $sql = "SELECT * FROM ot_records WHERE employee_id = ? ORDER BY ot_date DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll();
    }
    
    public function getByDate(string $date): array {
        $sql = "SELECT ot.*, e.name FROM ot_records ot 
                JOIN employees e ON ot.employee_id = e.id 
                WHERE ot.ot_date = ? 
                ORDER BY e.name ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$date]);
        return $stmt->fetchAll();
    }
    
    public function getTotalOTPay(string $status = null): float {
        $sql = "SELECT SUM(ot_pay) as total FROM ot_records WHERE 1=1";
        if ($status) {
            $sql .= " AND status = ?";
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($status ? [$status] : []);
        $result = $stmt->fetch();
        return (float)($result['total'] ?? 0);
    }
}
