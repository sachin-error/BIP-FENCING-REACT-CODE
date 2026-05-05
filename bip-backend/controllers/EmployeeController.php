<?php

class EmployeeController {
    private Employee $employeeModel;
    
    public function __construct() {
        $this->employeeModel = new Employee();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 50));
            $offset = ($page - 1) * $perPage;
            
            $employees = $this->employeeModel->getAll($perPage, $offset);
            $total = $this->employeeModel->getTotalCount();
            
            Response::paginated($employees, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $employee = $this->employeeModel->getById($id);
            if (!$employee) {
                Response::notFound('Employee not found');
            }
            
            Response::success($employee);
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
            if (empty($input['name'])) $errors['name'] = 'Name is required';
            if (empty($input['designation'])) $errors['designation'] = 'Designation is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            $input['active'] = 1;
            
            $employeeId = $this->employeeModel->create($input);
            $employee = $this->employeeModel->getById($employeeId);
            
            Response::created($employee);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $employee = $this->employeeModel->getById($id);
            if (!$employee) {
                Response::notFound('Employee not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $this->employeeModel->update($id, $input);
            $updated = $this->employeeModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $employee = $this->employeeModel->getById($id);
            if (!$employee) {
                Response::notFound('Employee not found');
            }
            
            $this->employeeModel->deactivate($id);
            Response::success(['message' => 'Employee deactivated successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
