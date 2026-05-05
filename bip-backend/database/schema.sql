-- BIP Fencing Admin Panel - Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS bip_fencing;
USE bip_fencing;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role ENUM('admin','staff') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Clients Table
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(150),
    address TEXT,
    client_type ENUM('Residential','Commercial','Industrial'),
    gst VARCHAR(20),
    since DATE,
    contract_value DECIMAL(12,2) DEFAULT 0,
    paid DECIMAL(12,2) DEFAULT 0,
    pending DECIMAL(12,2) GENERATED ALWAYS AS (contract_value - paid) STORED,
    payment_status ENUM('paid','partial','overdue') DEFAULT 'partial',
    color VARCHAR(20),
    initials VARCHAR(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Client Invoices Table
-- ============================================
CREATE TABLE IF NOT EXISTS client_invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    invoice_ref VARCHAR(20),
    invoice_date VARCHAR(50),
    invoice_type VARCHAR(30),
    amount DECIMAL(12,2),
    status ENUM('paid','pending','overdue') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client_id (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Client Projects Table
-- ============================================
CREATE TABLE IF NOT EXISTS client_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    project_name VARCHAR(150),
    project_detail TEXT,
    status ENUM('completed','inprogress','cancelled') DEFAULT 'inprogress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_client_id (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category ENUM('Fencing','Gate','Hardware','Pipe','Wire','Panel','Post','Other') DEFAULT 'Other',
    unit VARCHAR(20),
    cost_price DECIMAL(10,2) DEFAULT 0,
    selling_price DECIMAL(10,2) DEFAULT 0,
    margin DECIMAL(5,2) GENERATED ALWAYS AS (((selling_price - cost_price)/NULLIF(cost_price, 0))*100) STORED,
    stock_qty INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sku (sku),
    INDEX idx_product_name (product_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Quotations Table
-- ============================================
CREATE TABLE IF NOT EXISTS quotations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quote_no VARCHAR(20) UNIQUE NOT NULL,
    quote_date DATE,
    valid_until DATE,
    client_name VARCHAR(150),
    client_phone VARCHAR(20),
    client_email VARCHAR(100),
    tax_percent DECIMAL(5,2) DEFAULT 18,
    discount DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(12,2) DEFAULT 0,
    discount_amt DECIMAL(12,2) DEFAULT 0,
    taxable_amt DECIMAL(12,2) DEFAULT 0,
    cgst_amt DECIMAL(12,2) DEFAULT 0,
    sgst_amt DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    status ENUM('draft','sent','accepted','rejected') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_quote_no (quote_no),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Quotation Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS quotation_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quotation_id INT NOT NULL,
    description TEXT,
    qty DECIMAL(10,2),
    rate DECIMAL(10,2),
    amount DECIMAL(12,2) GENERATED ALWAYS AS (qty * rate) STORED,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
    INDEX idx_quotation_id (quotation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tax Invoices Table
-- ============================================
CREATE TABLE IF NOT EXISTS tax_invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_no VARCHAR(20) UNIQUE NOT NULL,
    invoice_date DATE,
    dispatch VARCHAR(100),
    lr_no VARCHAR(50),
    vehicle VARCHAR(50),
    consignee TEXT,
    buyer TEXT,
    cgst_percent DECIMAL(5,2) DEFAULT 9,
    sgst_percent DECIMAL(5,2) DEFAULT 9,
    subtotal DECIMAL(12,2) DEFAULT 0,
    cgst_amt DECIMAL(12,2) DEFAULT 0,
    sgst_amt DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    round_off DECIMAL(12,2) DEFAULT 0,
    open_balance DECIMAL(12,2) DEFAULT 0,
    closing_balance DECIMAL(12,2) DEFAULT 0,
    bank_name VARCHAR(100),
    account_name VARCHAR(100),
    account_no VARCHAR(100),
    ifsc VARCHAR(100),
    declaration TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_invoice_no (invoice_no),
    INDEX idx_invoice_date (invoice_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tax Invoice Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS tax_invoice_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    description TEXT,
    hsn VARCHAR(20),
    qty DECIMAL(10,2),
    rate_incl DECIMAL(10,2),
    rate_excl DECIMAL(10,2),
    per VARCHAR(20) DEFAULT 'NOS',
    amount DECIMAL(12,2),
    FOREIGN KEY (invoice_id) REFERENCES tax_invoices(id) ON DELETE CASCADE,
    INDEX idx_invoice_id (invoice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Purchase Bills Table
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bill_no VARCHAR(20) UNIQUE NOT NULL,
    bill_date DATE,
    supplier_name VARCHAR(150),
    supplier_phone VARCHAR(20),
    supplier_address TEXT,
    discount DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(12,2) DEFAULT 0,
    discount_amt DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bill_no (bill_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Purchase Bill Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_bill_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT NOT NULL,
    description TEXT,
    qty DECIMAL(10,2),
    rate DECIMAL(10,2),
    amount DECIMAL(12,2) GENERATED ALWAYS AS (qty * rate) STORED,
    FOREIGN KEY (bill_id) REFERENCES purchase_bills(id) ON DELETE CASCADE,
    INDEX idx_bill_id (bill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Purchase Inventory Table
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    po_no VARCHAR(20) UNIQUE NOT NULL,
    po_date DATE,
    supplier VARCHAR(100),
    warehouse VARCHAR(100),
    total_cost DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_po_no (po_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Purchase Inventory Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_inventory_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventory_id INT NOT NULL,
    item_name VARCHAR(100),
    sku VARCHAR(50),
    qty DECIMAL(10,2),
    unit ENUM('Pcs','Kg','Meter','Roll','Box','Set','Liter','Ton') DEFAULT 'Pcs',
    cost_price DECIMAL(10,2),
    total DECIMAL(12,2) GENERATED ALWAYS AS (qty * cost_price) STORED,
    FOREIGN KEY (inventory_id) REFERENCES purchase_inventory(id) ON DELETE CASCADE,
    INDEX idx_inventory_id (inventory_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Employees Table
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    department ENUM('Operations','Installation','Fabrication','Welding','Logistics','Administration','Site Supervision','Other') DEFAULT 'Operations',
    basic_hourly_rate DECIMAL(8,2) DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employee_id (employee_id),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Salary Records Table
-- ============================================
CREATE TABLE IF NOT EXISTS salary_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    month VARCHAR(20),
    year INT,
    basic_salary DECIMAL(10,2) DEFAULT 0,
    hra DECIMAL(10,2) DEFAULT 0,
    transport DECIMAL(10,2) DEFAULT 0,
    ot_amount DECIMAL(10,2) DEFAULT 0,
    bonus DECIMAL(10,2) DEFAULT 0,
    gross_salary DECIMAL(10,2) GENERATED ALWAYS AS (basic_salary+hra+transport+ot_amount+bonus) STORED,
    deductions DECIMAL(10,2) DEFAULT 0,
    tax_deduction DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2) GENERATED ALWAYS AS (basic_salary+hra+transport+ot_amount+bonus-deductions-tax_deduction) STORED,
    payment_mode ENUM('Bank Transfer','Cash','Cheque','Online') DEFAULT 'Bank Transfer',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_salary_record (employee_id, month, year),
    INDEX idx_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Attendance Records Table
-- ============================================
CREATE TABLE IF NOT EXISTS attendance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    department VARCHAR(50),
    shift VARCHAR(50),
    check_in TIME,
    check_out TIME,
    work_hours DECIMAL(4,2) DEFAULT 0,
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status ENUM('Present','Absent','Half Day','Late','On Leave','Holiday','Work From Site') DEFAULT 'Present',
    leave_type VARCHAR(50),
    task_description TEXT,
    site_location VARCHAR(100),
    approved_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (employee_id, attendance_date),
    INDEX idx_employee_id (employee_id),
    INDEX idx_attendance_date (attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- OT Records Table
-- ============================================
CREATE TABLE IF NOT EXISTS ot_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    ot_date DATE NOT NULL,
    department VARCHAR(50),
    ot_type VARCHAR(50),
    shift VARCHAR(20),
    regular_hours DECIMAL(4,2) DEFAULT 0,
    ot_hours DECIMAL(4,2),
    ot_rate DECIMAL(4,2) DEFAULT 1.5,
    basic_hourly_rate DECIMAL(8,2),
    ot_pay DECIMAL(10,2) GENERATED ALWAYS AS (ot_hours * basic_hourly_rate * ot_rate) STORED,
    reason TEXT,
    approved_by VARCHAR(100),
    status ENUM('Pending','Approved','Rejected','Paid') DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee_id (employee_id),
    INDEX idx_ot_date (ot_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Seed Data
-- ============================================

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (username, password, name, role) VALUES
('admin', '$2y$10$2QMcMUWPwbvgNRGmZYxCdOwiWUH4Nv1rZVzi7h3F.Yvo6oUQcVHK.', 'Admin User', 'admin');

-- Insert demo clients
INSERT INTO clients (name, email, phone, company, address, client_type, gst, contract_value, paid, color, initials) VALUES 
('Rajesh Kumar', 'rajesh@email.com', '9876543210', 'Kumar Enterprises', 'Chennai', 'Commercial', '33ABCDE1234F1Z0', 250000, 100000, '#FF6B6B', 'RK'),
('Priya Sharma', 'priya@email.com', '9876543211', 'Sharma Industries', 'Bangalore', 'Industrial', '33BCDEF2345G1Z0', 500000, 250000, '#4ECDC4', 'PS'),
('Amit Singh', 'amit@email.com', '9876543212', 'Singh Construction', 'Delhi', 'Residential', '33CDEFG3456H1Z0', 150000, 75000, '#95E1D3', 'AS'),
('Neha Gupta', 'neha@email.com', '9876543213', 'Gupta Builders', 'Hyderabad', 'Commercial', '33DEFGH4567I1Z0', 350000, 150000, '#F38181', 'NG'),
('Vikram Menon', 'vikram@email.com', '9876543214', 'Menon Group', 'Pune', 'Industrial', '33EFGHI5678J1Z0', 600000, 300000, '#AA96DA', 'VM'),
('Anjali Patel', 'anjali@email.com', '9876543215', 'Patel Enterprises', 'Ahmedabad', 'Residential', '33FGHIJ6789K1Z0', 200000, 100000, '#FCBAD3', 'AP');

-- Insert demo employees
INSERT INTO employees (employee_id, name, designation, department, basic_hourly_rate) VALUES 
('EMP-001', 'Suresh Kumar', 'Site Supervisor', 'Site Supervision', 150),
('EMP-002', 'Ravi Kumar', 'Welder', 'Welding', 120),
('EMP-003', 'Prakash Singh', 'Installer', 'Installation', 130),
('EMP-004', 'Mohan Raj', 'Fabricator', 'Fabrication', 125);

-- Insert demo quotations
INSERT INTO quotations (quote_no, quote_date, valid_until, client_name, client_phone, client_email, tax_percent, discount, subtotal, discount_amt, taxable_amt, cgst_amt, sgst_amt, total, status) VALUES 
('QT-001', '2024-05-01', '2024-05-31', 'Rajesh Kumar', '9876543210', 'rajesh@email.com', 18, 5, 100000, 5000, 95000, 8550, 8550, 112100, 'draft'),
('QT-002', '2024-05-02', '2024-05-30', 'Priya Sharma', '9876543211', 'priya@email.com', 18, 0, 250000, 0, 250000, 22500, 22500, 295000, 'sent'),
('QT-003', '2024-05-03', '2024-06-02', 'Amit Singh', '9876543212', 'amit@email.com', 18, 10, 80000, 8000, 72000, 6480, 6480, 84960, 'accepted');

-- Insert demo salary records
INSERT INTO salary_records (employee_id, month, year, basic_salary, hra, transport, ot_amount, bonus, deductions, tax_deduction) VALUES 
(1, 'April', 2024, 25000, 5000, 2000, 3000, 0, 1000, 2000),
(2, 'April', 2024, 20000, 4000, 1500, 2000, 500, 800, 1500),
(3, 'April', 2024, 22000, 4400, 1800, 2500, 0, 900, 1800),
(4, 'April', 2024, 21000, 4200, 1700, 2200, 500, 850, 1700);
