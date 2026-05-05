<?php

class Salary extends BaseModel {
    protected string $table = 'salary_records';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        return $this->findAll('salary_records', [], 'created_at DESC', $limit, $offset);
    }
    
    public function getById(int $id): ?array {
        return $this->findOne('salary_records', ['id' => $id]);
    }
    
    public function create(array $data): int {
        return $this->insert('salary_records', $data);
    }
    
    public function updateSalary(int $id, array $data): bool {
        return parent::update('salary_records', $data, ['id' => $id]);
    }
    
    public function deleteSalary(int $id): bool {
        return parent::delete('salary_records', ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('salary_records');
    }
    
    public function getByEmployeeAndMonth(int $employeeId, string $month, int $year): ?array {
        $sql = "SELECT * FROM salary_records WHERE employee_id = ? AND month = ? AND year = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$employeeId, $month, $year]);
        return $stmt->fetch() ?: null;
    }
    
    public function getByMonth(string $month, int $year): array {
        $sql = "SELECT sr.*, e.name, e.employee_id FROM salary_records sr 
                JOIN employees e ON sr.employee_id = e.id 
                WHERE sr.month = ? AND sr.year = ? 
                ORDER BY e.name ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$month, $year]);
        return $stmt->fetchAll();
    }
    
    public function getByEmployee(int $employeeId): array {
        $sql = "SELECT * FROM salary_records WHERE employee_id = ? ORDER BY year DESC, month DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll();
    }
    
    public function getSummaryByMonth(string $month, int $year): array {
        $sql = "SELECT 
                    SUM(basic_salary) as total_basic,
                    SUM(hra) as total_hra,
                    SUM(transport) as total_transport,
                    SUM(ot_amount) as total_ot,
                    SUM(bonus) as total_bonus,
                    SUM(gross_salary) as total_gross,
                    SUM(deductions) as total_deductions,
                    SUM(tax_deduction) as total_tax,
                    SUM(net_salary) as total_net,
                    COUNT(*) as employee_count
                FROM salary_records 
                WHERE month = ? AND year = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$month, $year]);
        return $stmt->fetch() ?: [];
    }
}
