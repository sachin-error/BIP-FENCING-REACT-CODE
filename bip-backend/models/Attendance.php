<?php

class Attendance extends BaseModel {
    protected string $table = 'attendance_records';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        return $this->findAll('attendance_records', [], 'attendance_date DESC', $limit, $offset);
    }
    
    public function getById(int $id): ?array {
        return $this->findOne('attendance_records', ['id' => $id]);
    }
    
    public function create(array $data): int {
        return $this->insert('attendance_records', $data);
    }
    
    public function updateAttendance(int $id, array $data): bool {
        return parent::update('attendance_records', $data, ['id' => $id]);
    }
    
    public function deleteAttendance(int $id): bool {
        return parent::delete('attendance_records', ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('attendance_records');
    }
    
    public function getByDate(string $date): array {
        $sql = "SELECT ar.*, e.name, e.employee_id FROM attendance_records ar 
                JOIN employees e ON ar.employee_id = e.id 
                WHERE ar.attendance_date = ? 
                ORDER BY e.name ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$date]);
        return $stmt->fetchAll();
    }
    
    public function getByEmployeeAndDate(int $employeeId, string $date): ?array {
        $sql = "SELECT * FROM attendance_records WHERE employee_id = ? AND attendance_date = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$employeeId, $date]);
        return $stmt->fetch() ?: null;
    }
    
    public function getByEmployee(int $employeeId): array {
        $sql = "SELECT * FROM attendance_records WHERE employee_id = ? ORDER BY attendance_date DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$employeeId]);
        return $stmt->fetchAll();
    }
    
    public function getStatsForDate(string $date): array {
        $sql = "SELECT 
                    status,
                    COUNT(*) as count
                FROM attendance_records 
                WHERE attendance_date = ? 
                GROUP BY status";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$date]);
        $results = $stmt->fetchAll();
        
        $stats = [
            'present' => 0,
            'absent' => 0,
            'half_day' => 0,
            'late' => 0,
            'on_leave' => 0,
            'holiday' => 0,
            'work_from_site' => 0,
            'total' => 0
        ];
        
        foreach ($results as $row) {
            $key = strtolower(str_replace(' ', '_', $row['status']));
            $stats[$key] = $row['count'];
            $stats['total'] += $row['count'];
        }
        
        return $stats;
    }
}
