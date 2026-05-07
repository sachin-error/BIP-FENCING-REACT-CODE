<?php

class User extends BaseModel {
    protected string $table = 'users';
    
    public function findByUsername(string $username): ?array {
        return $this->findOne('users', ['username' => $username]);
    }
    
    public function create(array $data): int {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        return $this->insert('users', $data);
    }
    
    public function updateUser(int $id, array $data): bool {
        unset($data['password']); // Don't update password here
        return parent::update('users', $data, ['id' => $id]);
    }
    
    public function getById(int $id): ?array {
        return $this->findOne('users', ['id' => $id]);
    }
    
    public function getAll(): array {
        return $this->findAll('users', [], 'created_at DESC');
    }
    
    public function deleteById(int $id): bool {
        return $this->delete('users', ['id' => $id]);
    }
}
