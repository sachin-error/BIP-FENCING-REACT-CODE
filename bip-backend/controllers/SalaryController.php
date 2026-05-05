<?php

class SalaryController {
    private Salary $salaryModel;
    
    public function __construct() {
        $this->salaryModel = new Salary();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $month = $_GET['month'] ?? date('F');
            $year = $_GET['year'] ?? date('Y');
            $search = $_GET['search'] ?? '';
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            // Build query
            $db = Database::getInstance();
            $sql = "SELECT sr.*, e.name, e.employee_id FROM salary_records sr 
                    JOIN employees e ON sr.employee_id = e.id 
                    WHERE sr.month = ? AND sr.year = ?";
            $params = [$month, $year];
            
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
            $countSql = "SELECT COUNT(*) as count FROM salary_records sr 
                        JOIN employees e ON sr.employee_id = e.id 
                        WHERE sr.month = ? AND sr.year = ?";
            $countParams = [$month, $year];
            
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
            
            $record = $this->salaryModel->getById($id);
            if (!$record) {
                Response::notFound('Salary record not found');
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
            if (empty($input['month'])) $errors['month'] = 'Month is required';
            if (!isset($input['year'])) $errors['year'] = 'Year is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $recordId = $this->salaryModel->create($input);
            $record = $this->salaryModel->getById($recordId);
            
            Response::created($record);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->salaryModel->getById($id);
            if (!$record) {
                Response::notFound('Salary record not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $this->salaryModel->update($id, $input);
            $updated = $this->salaryModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $record = $this->salaryModel->getById($id);
            if (!$record) {
                Response::notFound('Salary record not found');
            }
            
            $this->salaryModel->delete($id);
            Response::success(['message' => 'Record deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getSummary() {
        try {
            AuthMiddleware::authenticate();
            
            $month = $_GET['month'] ?? date('F');
            $year = $_GET['year'] ?? date('Y');
            
            $summary = $this->salaryModel->getSummaryByMonth($month, $year);
            Response::success($summary);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
