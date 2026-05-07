# BIP Fencing Admin Panel - PHP REST API Backend

A complete, production-ready PHP REST API backend for the BIP Fencing Admin Panel React application.

## Features

- ✅ JWT Authentication with 8-hour token expiry
- ✅ Role-based access control (Admin/Staff)
- ✅ CORS support for localhost:5173 (Vite dev server)
- ✅ MySQL 8.0+ database with 17 tables
- ✅ RESTful API with 60+ endpoints
- ✅ Comprehensive input validation
- ✅ Transaction support for multi-table operations
- ✅ Generated columns for automatic calculations
- ✅ Pagination with configurable limits
- ✅ Advanced filtering and search capabilities
- ✅ Error handling with proper HTTP status codes
- ✅ Custom router with wildcard parameter support

## Tech Stack

- **Language**: PHP 8.2+
- **Database**: MySQL 8.0+
- **Authentication**: JWT (Firebase/PHP-JWT)
- **Architecture**: MVC-style with lightweight custom router
- **HTTP Server**: Apache 2.4+ (with mod_rewrite) or Nginx

## Project Structure

```
bip-backend/
├── index.php                    # Main entry point & router
├── config/
│   ├── app.php                  # App configuration & constants
│   └── database.php             # PDO database singleton
├── middleware/
│   ├── CorsMiddleware.php       # CORS headers + preflight
│   └── AuthMiddleware.php       # JWT validation
├── helpers/
│   └── Response.php             # Unified response format
├── models/
│   ├── BaseModel.php            # Base class with query helpers
│   ├── User.php
│   ├── Client.php
│   ├── Product.php
│   ├── Quotation.php
│   ├── TaxInvoice.php
│   ├── PurchaseBill.php
│   ├── PurchaseInventory.php
│   ├── Employee.php
│   ├── Salary.php
│   ├── Attendance.php
│   └── OT.php
├── controllers/
│   ├── AuthController.php
│   ├── DashboardController.php
│   ├── ClientController.php
│   ├── ProductController.php
│   ├── QuotationController.php
│   ├── TaxInvoiceController.php
│   ├── PurchaseBillController.php
│   ├── PurchaseInventoryController.php
│   ├── EmployeeController.php
│   ├── SalaryController.php
│   ├── AttendanceController.php
│   └── OTController.php
├── routes/
│   └── api.php                  # All route definitions
├── database/
│   └── schema.sql               # Full database schema + seed data
├── .env                         # Environment variables
├── .htaccess                    # Apache rewrite rules
├── composer.json                # PHP dependencies
└── README.md                    # This file
```

## Installation & Setup

### Prerequisites

- PHP 8.2 or higher
- MySQL 8.0 or higher
- Composer
- Apache with mod_rewrite (or Nginx with proper config)

### Step 1: Install Dependencies

```bash
cd bip-backend
composer install
```

### Step 2: Create Database

```bash
mysql -u root -p < database/schema.sql
```

Or manually:
1. Create database: `CREATE DATABASE bip_fencing;`
2. Run schema: Import `database/schema.sql` into MySQL

### Step 3: Configure Environment Variables

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_NAME=bip_fencing
DB_USER=root
DB_PASS=your_password
DB_PORT=3306
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRY=28800
APP_ENV=development
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### Step 4: Run the API

#### Using PHP Built-in Server (Development Only)

```bash
php -S localhost:8000
```

#### Using Apache

1. Configure virtual host to point to `bip-backend/` directory
2. Ensure `.htaccess` is in the root directory
3. Enable mod_rewrite: `a2enmod rewrite`

#### Using Nginx

Add this to your Nginx server block:

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}
```

## Database Schema

The backend includes 17 tables:

1. **users** - Admin/Staff users
2. **clients** - Customer information
3. **client_invoices** - Client invoices
4. **client_projects** - Client projects
5. **products** - Product catalog
6. **quotations** - Sales quotations
7. **quotation_items** - Quote line items
8. **tax_invoices** - Tax invoices
9. **tax_invoice_items** - Invoice line items
10. **purchase_bills** - Supplier bills
11. **purchase_bill_items** - Bill line items
12. **purchase_inventory** - Purchase orders
13. **purchase_inventory_items** - PO line items
14. **employees** - Employee master data
15. **salary_records** - Monthly salary records
16. **attendance_records** - Daily attendance
17. **ot_records** - Overtime records

## API Endpoints

### Authentication

```
POST   /api/auth/login       - Login (returns JWT token)
POST   /api/auth/logout      - Logout (stateless)
GET    /api/auth/me          - Get current user [Protected]
```

### Dashboard

```
GET    /api/dashboard/stats  - Dashboard statistics [Protected]
GET    /api/dashboard/chart  - Sales chart data [Protected]
GET    /api/dashboard/targets - Performance targets [Protected]
```

### Clients

```
GET    /api/clients                      - List all clients [Protected]
POST   /api/clients                      - Create client [Protected]
GET    /api/clients/{id}                 - Get single client [Protected]
PUT    /api/clients/{id}                 - Update client [Protected]
DELETE /api/clients/{id}                 - Delete client [Protected]
POST   /api/clients/{id}/invoices        - Add invoice [Protected]
DELETE /api/clients/{id}/invoices/{invId} - Remove invoice [Protected]
POST   /api/clients/{id}/projects        - Add project [Protected]
DELETE /api/clients/{id}/projects/{projId} - Remove project [Protected]
```

### Products

```
GET    /api/products           - List all products [Protected]
POST   /api/products           - Create product [Protected]
GET    /api/products/{id}      - Get single product [Protected]
PUT    /api/products/{id}      - Update product [Protected]
DELETE /api/products/{id}      - Delete product [Protected]
GET    /api/products/low-stock - Low stock items [Protected]
```

### Quotations

```
GET    /api/quotations              - List all [Protected]
POST   /api/quotations              - Create with items [Protected]
GET    /api/quotations/{id}         - Get with items [Protected]
PUT    /api/quotations/{id}         - Update [Protected]
DELETE /api/quotations/{id}         - Delete [Protected]
PATCH  /api/quotations/{id}/status  - Update status [Protected]
```

### Tax Invoices

```
GET    /api/tax-invoices       - List all [Protected]
POST   /api/tax-invoices       - Create [Protected]
GET    /api/tax-invoices/{id}  - Get single [Protected]
PUT    /api/tax-invoices/{id}  - Update [Protected]
DELETE /api/tax-invoices/{id}  - Delete [Protected]
```

### Purchase Bills

```
GET    /api/purchase-bills       - List all [Protected]
POST   /api/purchase-bills       - Create [Protected]
GET    /api/purchase-bills/{id}  - Get single [Protected]
PUT    /api/purchase-bills/{id}  - Update [Protected]
DELETE /api/purchase-bills/{id}  - Delete [Protected]
```

### Purchase Inventory

```
GET    /api/purchase-inventory       - List all [Protected]
POST   /api/purchase-inventory       - Create [Protected]
GET    /api/purchase-inventory/{id}  - Get single [Protected]
PUT    /api/purchase-inventory/{id}  - Update [Protected]
DELETE /api/purchase-inventory/{id}  - Delete [Protected]
```

### Employees

```
GET    /api/employees        - List all [Protected]
POST   /api/employees        - Create [Protected]
GET    /api/employees/{id}   - Get single [Protected]
PUT    /api/employees/{id}   - Update [Protected]
DELETE /api/employees/{id}   - Deactivate [Protected]
```

### Salary

```
GET    /api/salary            - List records [Protected]
POST   /api/salary            - Create [Protected]
GET    /api/salary/{id}       - Get single [Protected]
PUT    /api/salary/{id}       - Update [Protected]
DELETE /api/salary/{id}       - Delete [Protected]
GET    /api/salary/summary    - Summary totals [Protected]
```

### Attendance

```
GET    /api/attendance        - List records [Protected]
POST   /api/attendance        - Create [Protected]
GET    /api/attendance/{id}   - Get single [Protected]
PUT    /api/attendance/{id}   - Update [Protected]
DELETE /api/attendance/{id}   - Delete [Protected]
GET    /api/attendance/stats  - Daily statistics [Protected]
```

### Overtime

```
GET    /api/ot               - List records [Protected]
POST   /api/ot               - Create [Protected]
GET    /api/ot/{id}          - Get single [Protected]
PUT    /api/ot/{id}          - Update [Protected]
DELETE /api/ot/{id}          - Delete [Protected]
PATCH  /api/ot/{id}/status   - Update status [Protected]
```

## Authentication

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_in": 28800
  }
}
```

### Using Token

Include the token in the `Authorization` header for protected routes:

```bash
curl -X GET http://localhost:8000/api/clients \
  -H "Authorization: Bearer your_token_here"
```

## Default Credentials

```
Username: admin
Password: admin123
```

⚠️ **Change these in production!**

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field_name": "Error message"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "last_page": 5
  }
}
```

## HTTP Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity (Validation Error)
- `500` - Internal Server Error

## Query Parameters

### Pagination

```
?page=1&per_page=20
```

### Filtering & Search

```
GET /api/salary?month=April&year=2024&search=kumar
GET /api/attendance?date=2024-05-04&department=Operations&status=Present
GET /api/ot?status=Pending&department=Welding
```

## Security Features

- ✅ JWT tokens with configurable expiry
- ✅ Password hashing with bcrypt
- ✅ PDO prepared statements (SQL injection protection)
- ✅ CORS validation
- ✅ Request validation
- ✅ Error message sanitization

## Production Deployment Checklist

- [ ] Change `JWT_SECRET` in `.env` to a strong random string
- [ ] Change default admin password
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Enable HTTPS/SSL
- [ ] Configure proper database backups
- [ ] Set up proper logging
- [ ] Use environment-specific configurations
- [ ] Disable error_reporting in production
- [ ] Set up database connection pooling if needed
- [ ] Enable query caching where applicable

## Troubleshooting

### 404 Not Found

- Check if `.htaccess` is in the root directory
- Ensure mod_rewrite is enabled: `apache2ctl -M | grep rewrite`
- Verify the route is correctly defined in `routes/api.php`

### Database Connection Error

- Verify credentials in `.env`
- Ensure MySQL is running
- Check database and tables exist: `USE bip_fencing; SHOW TABLES;`

### JWT Token Errors

- Ensure `JWT_SECRET` is set in `.env`
- Check token hasn't expired (8 hours by default)
- Verify token is properly formatted: `Authorization: Bearer <token>`

### CORS Errors

- Ensure frontend URL is set correctly in `.env`
- Check `FRONTEND_URL` matches your React app URL
- Verify preflight OPTIONS requests are being handled

## Contributing

Follow PHP PSR-12 coding standards and ensure all PDO queries use prepared statements.

## License

Proprietary - BIP Fencing

## Support

For issues or questions, contact the development team.

---

**Last Updated**: May 4, 2026
**Version**: 1.0.0
