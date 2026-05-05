<?php

class ClientController {
    private Client $clientModel;
    
    public function __construct() {
        $this->clientModel = new Client();
    }
    
    public function getAll() {
        try {
            AuthMiddleware::authenticate();
            
            $page = max(1, (int)($_GET['page'] ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 20));
            $offset = ($page - 1) * $perPage;
            
            $clients = $this->clientModel->getAll($perPage, $offset);
            $total = $this->clientModel->getTotalCount();
            
            Response::paginated($clients, $total, $page, $perPage);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function getById($id) {
        try {
            AuthMiddleware::authenticate();
            
            $client = $this->clientModel->getById($id);
            if (!$client) {
                Response::notFound('Client not found');
            }
            
            Response::success($client);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function create() {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validation
            $errors = [];
            if (empty($input['name'])) $errors['name'] = 'Name is required';
            if (empty($input['phone'])) $errors['phone'] = 'Phone is required';
            if (empty($input['client_type'])) $errors['client_type'] = 'Client type is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $clientId = $this->clientModel->create($input);
            $client = $this->clientModel->getById($clientId);
            
            Response::created($client);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function update($id) {
        try {
            AuthMiddleware::authenticate();
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Check if client exists
            $client = $this->clientModel->getById($id);
            if (!$client) {
                Response::notFound('Client not found');
            }
            
            $input['updated_at'] = date('Y-m-d H:i:s');
            
            $this->clientModel->updateClient($id, $input);
            $updated = $this->clientModel->getById($id);
            
            Response::success($updated);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function delete($id) {
        try {
            AuthMiddleware::authenticate();
            
            $client = $this->clientModel->getById($id);
            if (!$client) {
                Response::notFound('Client not found');
            }
            
            $this->clientModel->deleteClient($id);
            Response::success(['message' => 'Client deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function addInvoice($clientId) {
        try {
            AuthMiddleware::authenticate();
            
            $client = $this->clientModel->getById($clientId);
            if (!$client) {
                Response::notFound('Client not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['invoice_ref'])) $errors['invoice_ref'] = 'Invoice reference is required';
            if (empty($input['amount'])) $errors['amount'] = 'Amount is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            
            $invoiceId = $this->clientModel->addInvoice($clientId, $input);
            
            Response::created(['id' => $invoiceId]);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function deleteInvoice($clientId, $invoiceId) {
        try {
            AuthMiddleware::authenticate();
            
            $client = $this->clientModel->getById($clientId);
            if (!$client) {
                Response::notFound('Client not found');
            }
            
            $this->clientModel->deleteInvoice($invoiceId);
            Response::success(['message' => 'Invoice deleted']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function addProject($clientId) {
        try {
            AuthMiddleware::authenticate();
            
            $client = $this->clientModel->getById($clientId);
            if (!$client) {
                Response::notFound('Client not found');
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            $errors = [];
            if (empty($input['project_name'])) $errors['project_name'] = 'Project name is required';
            
            if (!empty($errors)) {
                Response::validationError($errors);
            }
            
            $input['created_at'] = date('Y-m-d H:i:s');
            
            $projectId = $this->clientModel->addProject($clientId, $input);
            
            Response::created(['id' => $projectId]);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
    
    public function deleteProject($clientId, $projectId) {
        try {
            AuthMiddleware::authenticate();
            
            $client = $this->clientModel->getById($clientId);
            if (!$client) {
                Response::notFound('Client not found');
            }
            
            $this->clientModel->deleteProject($projectId);
            Response::success(['message' => 'Project deleted']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}
