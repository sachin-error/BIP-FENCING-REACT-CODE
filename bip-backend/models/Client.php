<?php

class Client extends BaseModel {
    protected string $table = 'clients';
    
    public function getAll(int $limit = 0, int $offset = 0): array {
        return $this->findAll('clients', [], 'name ASC', $limit, $offset);
    }
    
    public function getById(int $id): ?array {
        $client = $this->findOne('clients', ['id' => $id]);
        
        if ($client) {
            // Get invoices and projects
            $client['invoices'] = $this->getInvoices($id);
            $client['projects'] = $this->getProjects($id);
        }
        
        return $client;
    }
    
    public function create(array $data): int {
        $this->updatePaymentStatus($data);
        return $this->insert('clients', $data);
    }
    
    public function updateClient(int $id, array $data): bool {
        $this->updatePaymentStatus($data);
        return parent::update('clients', $data, ['id' => $id]);
    }
    
    public function deleteClient(int $id): bool {
        return parent::delete('clients', ['id' => $id]);
    }
    
    public function getTotalCount(): int {
        return $this->count('clients');
    }
    
    private function updatePaymentStatus(array &$data): void {
        if (isset($data['contract_value']) && isset($data['paid'])) {
            $pending = $data['contract_value'] - $data['paid'];
            
            if ($pending <= 0) {
                $data['payment_status'] = 'paid';
            } elseif ($data['paid'] > 0) {
                $data['payment_status'] = 'partial';
            } else {
                $data['payment_status'] = 'overdue';
            }
        }
    }
    
    public function getInvoices(int $clientId): array {
        return $this->findAll('client_invoices', ['client_id' => $clientId]);
    }
    
    public function addInvoice(int $clientId, array $invoiceData): int {
        $invoiceData['client_id'] = $clientId;
        return $this->insert('client_invoices', $invoiceData);
    }
    
    public function deleteInvoice(int $invoiceId): bool {
        return $this->delete('client_invoices', ['id' => $invoiceId]);
    }
    
    public function getProjects(int $clientId): array {
        return $this->findAll('client_projects', ['client_id' => $clientId]);
    }
    
    public function addProject(int $clientId, array $projectData): int {
        $projectData['client_id'] = $clientId;
        return $this->insert('client_projects', $projectData);
    }
    
    public function deleteProject(int $projectId): bool {
        return $this->delete('client_projects', ['id' => $projectId]);
    }
}
