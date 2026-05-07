<?php

class SalaryController {
    private Salary $salaryModel;

    private const GENERATED_COLS = ['gross_salary', 'net_salary'];
    private const ALLOWED_DEPARTMENTS = [
        'Operations',
        'Installation',
        'Fabrication',
        'Welding',
        'Logistics',
        'Administration',
        'Site Supervision',
        'Other'
    ];
    private const ALLOWED_PAYMENT_MODES = ['Bank Transfer', 'Cash', 'Cheque', 'Online'];

    public function __construct() {
        $this->salaryModel = new Salary();
    }

    public function getAll() {
        try {
            AuthMiddleware::authenticate();

            $month   = $_GET['month']    ?? '';
            $year    = $_GET['year']     ?? '';
            $search  = $_GET['search']   ?? '';

            $page    = max(1, (int)($_GET['page']     ?? 1));
            $perPage = max(1, (int)($_GET['per_page'] ?? 100));
            $offset  = ($page - 1) * $perPage;

            $db     = Database::getInstance();
            $sql    = "SELECT sr.*, e.name, e.employee_id FROM salary_records sr
                       JOIN employees e ON sr.employee_id = e.id
                       WHERE 1=1";
            $params = [];

            if (!empty($month)) {
                $sql .= " AND sr.month = ?";
                $params[] = $month;
            }
            if (!empty($year)) {
                $sql .= " AND sr.year = ?";
                $params[] = (int)$year;
            }
            if (!empty($search)) {
                $sql .= " AND (e.name LIKE ? OR e.employee_id LIKE ?)";
                $searchTerm = "%$search%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            $sql .= " ORDER BY sr.year DESC, sr.month ASC, e.name ASC LIMIT ? OFFSET ?";
            $stmt = $db->prepare($sql);
            $stmt->execute(array_merge($params, [$perPage, $offset]));
            $records = $stmt->fetchAll();

            $countSql    = "SELECT COUNT(*) as count FROM salary_records sr
                            JOIN employees e ON sr.employee_id = e.id WHERE 1=1";
            $countParams = [];

            if (!empty($month)) {
                $countSql .= " AND sr.month = ?";
                $countParams[] = $month;
            }
            if (!empty($year)) {
                $countSql .= " AND sr.year = ?";
                $countParams[] = (int)$year;
            }
            if (!empty($search)) {
                $countSql .= " AND (e.name LIKE ? OR e.employee_id LIKE ?)";
                $searchTerm = "%$search%";
                $countParams[] = $searchTerm;
                $countParams[] = $searchTerm;
            }

            $stmt  = $db->prepare($countSql);
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
            if (!$record) Response::notFound('Salary record not found');
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
            if (empty($input['employee_id']))   $errors['employee_id']   = 'Employee ID is required';
            if (empty($input['employee_name'])) $errors['employee_name'] = 'Employee name is required';
            if (empty($input['month']))         $errors['month']         = 'Month is required';
            if (!isset($input['year']))         $errors['year']          = 'Year is required';

            if (!empty($errors)) Response::validationError($errors);

            // Resolve string employee_id (e.g. "EMP-001") to DB integer FK
            $employeeModel = new Employee();
            $employee = $employeeModel->getByEmployeeId($input['employee_id']);

            if (!$employee) {
                $department = $input['department'] ?? 'Operations';
                if (!in_array($department, self::ALLOWED_DEPARTMENTS, true)) {
                    $department = 'Other';
                }

                $employeeDbId = $employeeModel->create([
                    'employee_id'       => $input['employee_id'],
                    'name'              => $input['employee_name'],
                    'designation'       => $input['designation'] ?? '',
                    'department'        => $department,
                    'basic_hourly_rate' => 0,
                    'active'            => 1,
                    'created_at'        => date('Y-m-d H:i:s'),
                    'updated_at'        => date('Y-m-d H:i:s'),
                ]);
            } else {
                $employeeDbId = $employee['id'];
            }

            $paymentMode = $input['payment_mode'] ?? 'Bank Transfer';
            if (!in_array($paymentMode, self::ALLOWED_PAYMENT_MODES, true)) {
                $paymentMode = 'Bank Transfer';
            }

            $salaryData = [
                'employee_id'   => $employeeDbId,
                'month'         => $input['month'],
                'year'          => (int)$input['year'],
                'basic_salary'  => $input['basic_salary']  ?? 0,
                'hra'           => $input['hra']            ?? 0,
                'transport'     => $input['transport']      ?? 0,
                'ot_amount'     => $input['ot_amount']      ?? 0,
                'bonus'         => $input['bonus']          ?? 0,
                'deductions'    => $input['deductions']     ?? 0,
                'tax_deduction' => $input['tax_deduction']  ?? 0,
                'payment_mode'  => $paymentMode,
                'notes'         => $input['notes']         ?? '',
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ];

            $existing = $this->salaryModel->getByEmployeeAndMonth(
                (int)$employeeDbId,
                (string)$salaryData['month'],
                (int)$salaryData['year']
            );
            if ($existing) {
                Response::error('Salary record already exists for this employee and month/year', 409);
            }

            $recordId = $this->salaryModel->create($salaryData);
            $record   = $this->salaryModel->getById($recordId);
            Response::created($record);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }

    public function update($id) {
        try {
            AuthMiddleware::authenticate();

            $record = $this->salaryModel->getById($id);
            if (!$record) Response::notFound('Salary record not found');

            $input = json_decode(file_get_contents('php://input'), true);
            $input['updated_at'] = date('Y-m-d H:i:s');

            // Strip generated + non-column fields to avoid SQL errors.
            foreach (self::GENERATED_COLS as $col) unset($input[$col]);

            $allowedColumns = [
                'month',
                'year',
                'basic_salary',
                'hra',
                'transport',
                'ot_amount',
                'bonus',
                'deductions',
                'tax_deduction',
                'payment_mode',
                'notes',
                'updated_at'
            ];
            $input = array_intersect_key($input, array_flip($allowedColumns));

            if (isset($input['payment_mode']) && !in_array($input['payment_mode'], self::ALLOWED_PAYMENT_MODES, true)) {
                $input['payment_mode'] = 'Bank Transfer';
            }

            if (isset($input['month']) || isset($input['year'])) {
                $checkMonth = $input['month'] ?? $record['month'];
                $checkYear  = (int)($input['year'] ?? $record['year']);
                $existing = $this->salaryModel->getByEmployeeAndMonth(
                    (int)$record['employee_id'],
                    (string)$checkMonth,
                    $checkYear
                );

                if ($existing && (int)$existing['id'] !== (int)$id) {
                    Response::error('Salary record already exists for this employee and month/year', 409);
                }
            }

            $this->salaryModel->updateSalary($id, $input);
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
            if (!$record) Response::notFound('Salary record not found');
            $this->salaryModel->deleteSalary($id);
            Response::success(['message' => 'Record deleted successfully']);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }

    public function getSummary() {
        try {
            AuthMiddleware::authenticate();
            $month   = $_GET['month'] ?? date('F');
            $year    = $_GET['year']  ?? date('Y');
            $summary = $this->salaryModel->getSummaryByMonth($month, $year);
            Response::success($summary);
        } catch (Exception $e) {
            Response::serverError($e->getMessage());
        }
    }
}