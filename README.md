# Sales Order Web Application

A small sales-order management web application built for the SPIL Labs technical assessment.

- **Backend:** .NET 8 Web API (layered architecture), Entity Framework Core, SQL Server, AutoMapper, built-in dependency injection
- **Frontend:** React (functional components + hooks), Redux Toolkit, React Router, Axios, Tailwind CSS

## Features

- **Home screen (Screen 2)** opens first and lists all saved orders in a 7-column grid (Invoice No, Invoice Date, Customer, Reference No, Total Excl, Total Tax, Total Incl).
- **Add New** opens the Sales Order screen (Screen 1).
- **Customer Name dropdown** is populated from the `Clients` table; selecting a customer auto-fills Address 1–3, Suburb, State and Post Code.
- Invoice No, Invoice Date, Reference No and Note are free-entry fields.
- **Item Code and Description dropdowns** are both populated from the `Items` table — picking from either selects the item and pulls its price.
- Per line, once quantity and tax rate are entered:
  - `Excl Amount = Quantity × Price`
  - `Tax Amount = Excl Amount × Tax Rate / 100`
  - `Incl Amount = Excl Amount + Tax Amount`
- Multiple line items per order, with running Total Excl / Total Tax / Total Incl.
- Amounts are recalculated **server-side** on save, so the API never trusts client-supplied totals.
- **Double-click** an order row on the Home screen to reopen it with its data, edit it, and save again (PUT).
- **Print** button on a saved order uses the browser print flow (toolbar/buttons are hidden with Tailwind `print:` utilities).

## Project structure

```
/backend/SalesOrderApp        .NET 8 Web API
  /API/Controllers            API layer (routing, validation)
  /Application
    /DTOs                     View models exchanged with the frontend
    /Interfaces               Service + repository contracts
    /Services                 Business logic (calculations, order assembly)
    /Mapping                  AutoMapper profile
  /Domain/Entities            Client, Item, SalesOrder, SalesOrderLine
  /Infrastructure
    /Data                     AppDbContext, DbSeeder
    /Repositories             EF Core data access
/frontend                     React + Vite app
  /src/components             Reusable inputs, orders grid, line editor
  /src/pages                  HomePage (Screen 2), SalesOrderPage (Screen 1)
  /src/redux/slices           clients / items / orders slices (Redux Toolkit)
  /src/services               Axios API modules
  /src/utils                  Shared line/total calculations
/database/CreateDatabase.sql  Standalone SQL Server schema + seed script
```

## Prerequisites

- .NET 8 SDK
- SQL Server (LocalDB, Express or full) — update the connection string if needed
- Node.js 18+

## Running the backend

1. Open `backend/SalesOrderApp/appsettings.json` and adjust `ConnectionStrings:DefaultConnection` for your SQL Server instance (the default uses `Server=localhost` with Windows authentication; for SQL authentication use e.g. `Server=localhost;Database=SalesOrderDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;`).
2. From `backend/SalesOrderApp`:

   ```bash
   dotnet restore
   dotnet tool install --global dotnet-ef        # once, if not installed
   dotnet ef migrations add InitialCreate        # scaffold the initial migration
   dotnet run
   ```

   On startup the app applies migrations (or creates the database directly if no migration exists) and seeds the `Clients` and `Items` master data. Swagger UI is available at `http://localhost:5000/swagger`.

   Alternatively, the database can be created manually by running `database/CreateDatabase.sql` in SSMS.

## Running the frontend

From `frontend`:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and calls the API at `http://localhost:5000/api` (override by copying `.env.example` to `.env` and editing `VITE_API_URL`).

## API endpoints

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/clients` | Customers for the Customer Name dropdown |
| GET | `/api/items` | Items for the Item Code / Description dropdowns |
| GET | `/api/salesorders` | Orders for the Home grid |
| GET | `/api/salesorders/{id}` | Single order with lines (edit view) |
| POST | `/api/salesorders` | Create an order |
| PUT | `/api/salesorders/{id}` | Update an order (replaces its lines) |

## Design notes

- `SalesOrderLine.Price` stores the item's unit price **at the time of saving**, so historical orders keep their values even if an item's price changes later.
- Update replaces the order's lines with the submitted set — simple and predictable for this scale.
- The address fields on the Sales Order screen are display-only snapshots of the selected client's address (the order stores `ClientId`).

## Possible improvements (given more time)

- Proper invoice report (e.g. a dedicated printable invoice layout or a reporting tool) instead of browser print
- Server-side paging/sorting/filtering on the orders grid
- Delete order support, optimistic concurrency, and unit tests for `SalesOrderService`
- Authentication/authorization
