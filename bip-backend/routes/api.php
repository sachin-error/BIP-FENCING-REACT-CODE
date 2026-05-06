<?php

return [
    // Auth Routes
    'POST|/api/auth/login' => 'AuthController@login',
    'POST|/api/auth/logout' => 'AuthController@logout',
    'GET|/api/auth/me' => 'AuthController@me',
    
    // Dashboard Routes
    'GET|/api/dashboard/stats' => 'DashboardController@getStats',
    'GET|/api/dashboard/chart' => 'DashboardController@getChart',
    'GET|/api/dashboard/targets' => 'DashboardController@getTargets',
    
    // Client Routes
    'GET|/api/clients' => 'ClientController@getAll',
    'POST|/api/clients' => 'ClientController@create',
    'GET|/api/clients/{id}' => 'ClientController@getById',
    'PUT|/api/clients/{id}' => 'ClientController@update',
    'DELETE|/api/clients/{id}' => 'ClientController@delete',
    'POST|/api/clients/{id}/invoices' => 'ClientController@addInvoice',
    'DELETE|/api/clients/{id}/invoices/{invId}' => 'ClientController@deleteInvoice',
    'POST|/api/clients/{id}/projects' => 'ClientController@addProject',
    'DELETE|/api/clients/{id}/projects/{projId}' => 'ClientController@deleteProject',
    
    // Product Routes
    'GET|/api/products' => 'ProductController@getAll',
    'POST|/api/products' => 'ProductController@create',
    'GET|/api/products/{id}' => 'ProductController@getById',
    'PUT|/api/products/{id}' => 'ProductController@update',
    'DELETE|/api/products/{id}' => 'ProductController@delete',
    'GET|/api/products/low-stock' => 'ProductController@getLowStock',
    
    // Quotation Routes
    'GET|/api/quotations' => 'QuotationController@getAll',
    'POST|/api/quotations' => 'QuotationController@create',
    'GET|/api/quotations/{id}' => 'QuotationController@getById',
    'PUT|/api/quotations/{id}' => 'QuotationController@update',
    'DELETE|/api/quotations/{id}' => 'QuotationController@delete',
    'PATCH|/api/quotations/{id}/status' => 'QuotationController@updateStatus',
    
    // Tax Invoice Routes
    'GET|/api/tax-invoices' => 'TaxInvoiceController@getAll',
    'POST|/api/tax-invoices' => 'TaxInvoiceController@create',
    'GET|/api/tax-invoices/{id}' => 'TaxInvoiceController@getById',
    'PUT|/api/tax-invoices/{id}' => 'TaxInvoiceController@update',
    'DELETE|/api/tax-invoices/{id}' => 'TaxInvoiceController@delete',
    
    // Purchase Bill Routes
    'GET|/api/purchase-bills' => 'PurchaseBillController@getAll',
    'POST|/api/purchase-bills' => 'PurchaseBillController@create',
    'GET|/api/purchase-bills/{id}' => 'PurchaseBillController@getById',
    'PUT|/api/purchase-bills/{id}' => 'PurchaseBillController@update',
    'DELETE|/api/purchase-bills/{id}' => 'PurchaseBillController@delete',
    
    // Purchase Inventory Routes
    'GET|/api/purchase-inventory' => 'PurchaseInventoryController@getAll',
    'POST|/api/purchase-inventory' => 'PurchaseInventoryController@create',
    'GET|/api/purchase-inventory/{id}' => 'PurchaseInventoryController@getById',
    'PUT|/api/purchase-inventory/{id}' => 'PurchaseInventoryController@update',
    'DELETE|/api/purchase-inventory/{id}' => 'PurchaseInventoryController@delete',
    
    // Employee Routes
    'GET|/api/employees' => 'EmployeeController@getAll',
    'POST|/api/employees' => 'EmployeeController@create',
    'GET|/api/employees/{id}' => 'EmployeeController@getById',
    'PUT|/api/employees/{id}' => 'EmployeeController@update',
    'DELETE|/api/employees/{id}' => 'EmployeeController@delete',
    
    // Salary Routes
    'GET|/api/salary' => 'SalaryController@getAll',
    'POST|/api/salary' => 'SalaryController@create',
    'GET|/api/salary/{id}' => 'SalaryController@getById',
    'PUT|/api/salary/{id}' => 'SalaryController@update',
    'DELETE|/api/salary/{id}' => 'SalaryController@delete',
    'GET|/api/salary/summary' => 'SalaryController@getSummary',
    
    // Attendance Routes
    'GET|/api/attendance' => 'AttendanceController@getAll',
    'POST|/api/attendance' => 'AttendanceController@create',
    'GET|/api/attendance/{id}' => 'AttendanceController@getById',
    'PUT|/api/attendance/{id}' => 'AttendanceController@update',
    'DELETE|/api/attendance/{id}' => 'AttendanceController@delete',
    'GET|/api/attendance/stats' => 'AttendanceController@getStats',
    
    // OT Routes
    'GET|/api/ot' => 'OTController@getAll',
    'POST|/api/ot' => 'OTController@create',
    'GET|/api/ot/{id}' => 'OTController@getById',
    'PUT|/api/ot/{id}' => 'OTController@update',
    'DELETE|/api/ot/{id}' => 'OTController@delete',
    'PATCH|/api/ot/{id}/status' => 'OTController@updateStatus',
];
