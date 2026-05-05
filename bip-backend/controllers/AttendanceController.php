<?php

class AttendanceController {
    private Attendance $attendanceModel;
    
    public function __construct() {
        $this->attendanceModel = new Attendance();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $date = $_GET['date'] ?? date('Y-m-d');
            $department = $_GET['department'] ?? '';
            $status = $_GET['status'] ?? '';
            $search = $_GET['search'] ?? '';
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 50));
            $offset = ($page - 1) * $perPage;
            
            // Build query
            $db = Database::getInstance();
            $sql = "SELECT ar.*, e.name, e.employee_id FROM attendance_records ar 
                    JOIN employees e ON ar.employee_id = e.id 
                    WHERE ar.attendance_date = ?";
            $params = [$date];
            
            if (!empty($department)) {
                $sql .= " AND ar.department = ?";
                $params[] = $department;
            }
            
            if (!empty($status)) {
                $sql .= " AND ar.status = ?";
                $params[] = $status;
            }
            
            if (!empty($search)) {
                $sql .= " AND (e.name LIKE ? OR e.employee_id LIKE ?)";
                $searchTerm = "%$search%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }
            
            $sql .= " ORDER BY e.name ASC LIMIT ? OFFSET ?";
            
            $stmt = $db->prepare($sql);
            $stmt->execute(array_merge($params, [$perPage, $offset]));
            $records = $stmt->fetchAll();
            
            // Count total
            $countSql = "SELECT COUNT(*) as count FROM attendance_records ar 
                        JOIN employees e ON ar.employee_id = e.id 
                        WHERE ar.attendance_date = ?";
            $countParams = [$date];
            
            if (!empty($department)) {
                $countSql .= " AND ar.department = ?";
                $countParams[] = $department;
            }
            if (!empty($status)) {
                $countSql .= " AND ar.status = ?";
                $countParams[] = $status;
            }
            if (!empty($search)) {
                $countSql .= " AND (e.name LIKE ? OR e.employee_id LIKE ?)";
                $searchTerm = "%$search%";
                $countParams[] = $searchTerm;
                $countParams[] = $searchTerm;
            }
            
            $stmt = $db->prepare($countSql);
            $stmt->execute($countParams);
            $total = $stmt->fetch()['count'];
            
            Response::paginated($records, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->attendanceModel->getById($id);
            if (!$record) {
                Response::notFound('Attendance record not found');
            }
            
            Response::success($record);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function create() {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['employee_id'])) $errors['employee_id'] = 'Employee ID is required';
            if (empty($input['attendance_date'])) $errors['attendance_date'] = 'Date is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $recordId = $this->attendanceModel->create($input);
            $record = $this->attendanceModel->getById($recordId);
            
            Response::created($record);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->attendanceModel->getById($id);
            if (!$record) {
                Response::notFound('Attendance record not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $this->attendanceModel->update($id, $input);
            $updated = $this->attendanceModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->attendanceModel->getById($id);
            if (!$record) {
                Response::notFound('Attendance record not found');
            }
            
            $this->attendanceModel->delete($id);
            Response::success(['message' => 'Record deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getStats() {
        try {
            AuthMiddleware::authenticate();
            
            $date = $_GET['date'] ?? date('Y-m-d');
            
            $stats = $this->attendanceModel->getStatsForDate($date);
            Response::success($stats);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
