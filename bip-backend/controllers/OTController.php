<?php

class OTController {
    private OT $otModel;
    
    public function __construct() {
        $this->otModel = new OT();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $status = $_GET['status'] ?? '';
            $department = $_GET['department'] ?? '';
            $search = $_GET['search'] ?? '';
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            // Build query
            $db = Database::getInstance();
            $sql = "SELECT ot.*, e.name, e.employee_id FROM ot_records ot 
                    JOIN employees e ON ot.employee_id = e.id 
                    WHERE 1=1";
            $params = [];
            
            if (!empty($status)) {
                $sql .= " AND ot.status = ?";
                $params[] = $status;
            }
            
            if (!empty($department)) {
                $sql .= " AND ot.department = ?";
                $params[] = $department;
            }
            
            if (!empty($search)) {
                $sql .= " AND (e.name LIKE ? OR e.employee_id LIKE ?)";
                $searchTerm = "%$search%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }
            
            $sql .= " ORDER BY ot.ot_date DESC LIMIT ? OFFSET ?";
            
            $stmt = $db->prepare($sql);
            $stmt->execute(array_merge($params, [$perPage, $offset]));
            $records = $stmt->fetchAll();
            
            // Count total
            $countSql = "SELECT COUNT(*) as count FROM ot_records ot 
                        JOIN employees e ON ot.employee_id = e.id 
                        WHERE 1=1";
            $countParams = [];
            
            if (!empty($status)) {
                $countSql .= " AND ot.status = ?";
                $countParams[] = $status;
            }
            if (!empty($department)) {
                $countSql .= " AND ot.department = ?";
                $countParams[] = $department;
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
            
            $record = $this->otModel->getById($id);
            if (!$record) {
                Response::notFound('OT record not found');
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
            if (empty($input['ot_date'])) $errors['ot_date'] = 'OT date is required';
            if (empty($input['ot_hours'])) $errors['ot_hours'] = 'OT hours is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            $input['status'] = $input['status'] ?? 'Pending';
            
            $recordId = $this->otModel->create($input);
            $record = $this->otModel->getById($recordId);
            
            Response::created($record);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->otModel->getById($id);
            if (!$record) {
                Response::notFound('OT record not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $this->otModel->update($id, $input);
            $updated = $this->otModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->otModel->getById($id);
            if (!$record) {
                Response::notFound('OT record not found');
            }
            
            $this->otModel->delete($id);
            Response::success(['message' => 'Record deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function updateStatus($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->otModel->getById($id);
            if (!$record) {
                Response::notFound('OT record not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (empty($input['status'])) {
                Response::validationError(['status' => 'Status is required']);
            }
            
            $this->otModel->updateStatus($id, $input['status']);
            $updated = $this->otModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
