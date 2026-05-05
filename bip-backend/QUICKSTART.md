# BIP Fencing Backend - Quick Start Guide

## 1. Install Composer Dependencies

```bash
cd bip-backend
composer install
```

## 2. Set Up the Database

Create the database schema:

```bash
mysql -u root -p < database/schema.sql
```

Or if you prefer to do it manually:

```bash
mysql -u root -p
mysql> CREATE DATABASE bip_fencing;
mysql> USE bip_fencing;
mysql> source database/schema.sql;
mysql> exit
```

## 3. Configure Environment

The `.env` file is pre-configured for local development. Update if needed:

```env
DB_HOST=localhost
DB_NAME=bip_fencing
DB_USER=root
DB_PASS=your_password  # Change if your MySQL has a password
DB_PORT=3306
JWT_SECRET=change-this-in-production
```

## 4. Start the API Server

### Option A: PHP Built-in Server (Recommended for Development)

```bash
php -S localhost:8000
```

The API will be available at: **http://localhost:8000**

### Option B: Apache with Virtual Host

1. Create a virtual host pointing to `bip-backend/`
2. Enable mod_rewrite: `sudo a2enmod rewrite`
3. Restart Apache: `sudo systemctl restart apache2`

### Option C: Nginx

Add this to your nginx config:

```nginx
server {
    listen 8000;
    server_name localhost;
    root /path/to/bip-backend;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

## 5. Test the API

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

You'll receive a JWT token. Save it.

### Use the Token

```bash
curl -X GET http://localhost:8000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 6. Connect React Frontend

In your React app, update the API base URL:

```javascript
// src/api/config.js or similar
export const API_BASE_URL = 'http://localhost:8000/api';
```

The backend CORS is configured to allow requests from `http://localhost:5173` (Vite default).

## 7. Database Seed Data

Pre-loaded after running schema.sql:

- ✅ 1 Admin user (admin/admin123)
- ✅ 6 Sample clients
- ✅ 4 Sample employees
- ✅ 3 Sample quotations
- ✅ 4 Sample salary records

## Common Issues

### "Cannot connect to MySQL"
- Ensure MySQL is running: `sudo systemctl status mysql`
- Check credentials in `.env`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### "Access Denied for user 'root'@'localhost'"
- Update `DB_PASS` in `.env` with your MySQL password
- Or create a new MySQL user:
  ```sql
  CREATE USER 'bip_user'@'localhost' IDENTIFIED BY 'password';
  GRANT ALL PRIVILEGES ON bip_fencing.* TO 'bip_user'@'localhost';
  FLUSH PRIVILEGES;
  ```

### "404 Not Found"
- Ensure you're accessing `/api/` endpoints
- Check route format in `routes/api.php`
- For Apache: verify `.htaccess` is present and mod_rewrite is enabled

### "CORS Error"
- Ensure frontend URL in `.env` matches (default: http://localhost:5173)
- Don't forget to include `Authorization: Bearer token` header

### "JWT Token Expired"
- Get a new token by logging in again
- Default expiry: 8 hours (28800 seconds)

## Useful Commands

```bash
# Check PHP version
php -v

# Check MySQL is running
mysql -u root -p -e "SELECT @@version;"

# View all tables
mysql -u root -p bip_fencing -e "SHOW TABLES;"

# Reset database
mysql -u root -p < database/schema.sql

# Enable PHP error logging
tail -f /var/log/php-fpm.log

# Check if port 8000 is available
lsof -i :8000
```

## Next Steps

1. ✅ Database is set up with sample data
2. ✅ API is running on http://localhost:8000
3. ✅ You can test endpoints with curl or Postman
4. 🔄 Update React frontend to use http://localhost:8000/api
5. 🎉 Start building!

## API Documentation

See [README.md](./README.md) for:
- Complete API endpoint reference
- Response format documentation
- Query parameter examples
- Authentication details

## Production Ready Features

- ✅ Input validation on all endpoints
- ✅ SQL injection protection (prepared statements)
- ✅ Password hashing with bcrypt
- ✅ JWT token expiry
- ✅ Proper HTTP status codes
- ✅ Transaction support for complex operations
- ✅ Error handling and logging
- ✅ Pagination support

Before deploying to production:
1. Change `JWT_SECRET` to a strong random value
2. Change admin password
3. Set `APP_ENV=production`
4. Configure proper logging
5. Set up database backups
6. Enable HTTPS

---

**Happy coding!** 🚀

For more info, see [README.md](./README.md)
