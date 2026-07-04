/* =============================================================
   SalesOrderDb - schema + seed data
   -------------------------------------------------------------
   NOTE: The API creates and seeds this database automatically on
   first run (EF Core). This script is provided as a standalone
   reference / alternative way to create the database manually.
   ============================================================= */

IF DB_ID('SalesOrderDb') IS NULL
    CREATE DATABASE SalesOrderDb;
GO

USE SalesOrderDb;
GO

IF OBJECT_ID('dbo.SalesOrderLines', 'U') IS NOT NULL DROP TABLE dbo.SalesOrderLines;
IF OBJECT_ID('dbo.SalesOrders', 'U') IS NOT NULL DROP TABLE dbo.SalesOrders;
IF OBJECT_ID('dbo.Items', 'U') IS NOT NULL DROP TABLE dbo.Items;
IF OBJECT_ID('dbo.Clients', 'U') IS NOT NULL DROP TABLE dbo.Clients;
GO

CREATE TABLE dbo.Clients (
    Id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Clients PRIMARY KEY,
    CustomerName NVARCHAR(200) NOT NULL,
    Address1     NVARCHAR(200) NULL,
    Address2     NVARCHAR(200) NULL,
    Address3     NVARCHAR(200) NULL,
    Suburb       NVARCHAR(100) NULL,
    [State]      NVARCHAR(100) NULL,
    PostCode     NVARCHAR(20)  NULL
);
GO

CREATE TABLE dbo.Items (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Items PRIMARY KEY,
    ItemCode    NVARCHAR(50)  NOT NULL CONSTRAINT UQ_Items_ItemCode UNIQUE,
    [Description] NVARCHAR(300) NOT NULL,
    Price       DECIMAL(18,2) NOT NULL
);
GO

CREATE TABLE dbo.SalesOrders (
    Id          INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SalesOrders PRIMARY KEY,
    ClientId    INT NOT NULL,
    InvoiceNo   NVARCHAR(50)   NULL,
    InvoiceDate DATETIME2      NULL,
    ReferenceNo NVARCHAR(50)   NULL,
    Note        NVARCHAR(1000) NULL,
    TotalExcl   DECIMAL(18,2)  NOT NULL CONSTRAINT DF_SalesOrders_TotalExcl DEFAULT 0,
    TotalTax    DECIMAL(18,2)  NOT NULL CONSTRAINT DF_SalesOrders_TotalTax DEFAULT 0,
    TotalIncl   DECIMAL(18,2)  NOT NULL CONSTRAINT DF_SalesOrders_TotalIncl DEFAULT 0,
    CreatedAt   DATETIME2      NOT NULL CONSTRAINT DF_SalesOrders_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_SalesOrders_Clients FOREIGN KEY (ClientId) REFERENCES dbo.Clients (Id)
);
GO

CREATE TABLE dbo.SalesOrderLines (
    Id           INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_SalesOrderLines PRIMARY KEY,
    SalesOrderId INT NOT NULL,
    ItemId       INT NOT NULL,
    Note         NVARCHAR(500) NULL,
    Quantity     DECIMAL(18,2) NOT NULL,
    Price        DECIMAL(18,2) NOT NULL,      -- unit price captured at order time
    TaxRate      DECIMAL(5,2)  NOT NULL,      -- percentage, e.g. 15 = 15%
    ExclAmount   DECIMAL(18,2) NOT NULL,      -- Quantity * Price
    TaxAmount    DECIMAL(18,2) NOT NULL,      -- ExclAmount * TaxRate / 100
    InclAmount   DECIMAL(18,2) NOT NULL,      -- ExclAmount + TaxAmount
    CONSTRAINT FK_SalesOrderLines_SalesOrders FOREIGN KEY (SalesOrderId)
        REFERENCES dbo.SalesOrders (Id) ON DELETE CASCADE,
    CONSTRAINT FK_SalesOrderLines_Items FOREIGN KEY (ItemId)
        REFERENCES dbo.Items (Id)
);
GO

CREATE INDEX IX_SalesOrders_ClientId ON dbo.SalesOrders (ClientId);
CREATE INDEX IX_SalesOrderLines_SalesOrderId ON dbo.SalesOrderLines (SalesOrderId);
CREATE INDEX IX_SalesOrderLines_ItemId ON dbo.SalesOrderLines (ItemId);
GO

/* ---------------- Seed data ---------------- */

INSERT INTO dbo.Clients (CustomerName, Address1, Address2, Address3, Suburb, [State], PostCode) VALUES
('ABC Traders (Pvt) Ltd',  '45 Galle Road',       'Level 2',      NULL, 'Colombo 03', 'Western', '00300'),
('Ceylon Hardware Stores', '120 Kandy Road',       NULL,           NULL, 'Kadawatha',  'Western', '11850'),
('Global Tech Solutions',  '78 Marine Drive',      'Suite 5B',     NULL, 'Dehiwala',   'Western', '10350'),
('Sunrise Distributors',   '12 Main Street',       NULL,           NULL, 'Negombo',    'Western', '11500'),
('Metro Office Supplies',  '230 High Level Road',  NULL,           NULL, 'Nugegoda',   'Western', '10250'),
('Lakeview Enterprises',   '8 Lake Drive',         'Ground Floor', NULL, 'Kandy',      'Central', '20000');
GO

INSERT INTO dbo.Items (ItemCode, [Description], Price) VALUES
('ITM-001', 'A4 Paper Ream 80gsm',       1250.00),
('ITM-002', 'Ballpoint Pen - Blue',        45.00),
('ITM-003', 'Stapler HD-10',              850.00),
('ITM-004', 'Whiteboard Marker - Black',  180.00),
('ITM-005', 'Lever Arch File',            520.00),
('ITM-006', 'Printer Toner Cartridge',  14500.00),
('ITM-007', 'USB Flash Drive 32GB',      2900.00),
('ITM-008', 'Wireless Mouse',            3500.00),
('ITM-009', 'USB Keyboard',              4200.00),
('ITM-010', 'Aluminium Laptop Stand',    6800.00);
GO
