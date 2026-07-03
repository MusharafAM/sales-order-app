using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Infrastructure.Data;

/// <summary>
/// Seeds the master data (Clients and Items) needed by the two dropdowns
/// on the Sales Order screen.
/// </summary>
public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Clients.Any())
        {
            context.Clients.AddRange(
                new Client { CustomerName = "ABC Traders (Pvt) Ltd", Address1 = "45 Galle Road", Address2 = "Level 2", Suburb = "Colombo 03", State = "Western", PostCode = "00300" },
                new Client { CustomerName = "Ceylon Hardware Stores", Address1 = "120 Kandy Road", Suburb = "Kadawatha", State = "Western", PostCode = "11850" },
                new Client { CustomerName = "Global Tech Solutions", Address1 = "78 Marine Drive", Address2 = "Suite 5B", Suburb = "Dehiwala", State = "Western", PostCode = "10350" },
                new Client { CustomerName = "Sunrise Distributors", Address1 = "12 Main Street", Suburb = "Negombo", State = "Western", PostCode = "11500" },
                new Client { CustomerName = "Metro Office Supplies", Address1 = "230 High Level Road", Suburb = "Nugegoda", State = "Western", PostCode = "10250" },
                new Client { CustomerName = "Lakeview Enterprises", Address1 = "8 Lake Drive", Address2 = "Ground Floor", Suburb = "Kandy", State = "Central", PostCode = "20000" }
            );
        }

        if (!context.Items.Any())
        {
            context.Items.AddRange(
                new Item { ItemCode = "ITM-001", Description = "A4 Paper Ream 80gsm", Price = 1250.00m },
                new Item { ItemCode = "ITM-002", Description = "Ballpoint Pen - Blue", Price = 45.00m },
                new Item { ItemCode = "ITM-003", Description = "Stapler HD-10", Price = 850.00m },
                new Item { ItemCode = "ITM-004", Description = "Whiteboard Marker - Black", Price = 180.00m },
                new Item { ItemCode = "ITM-005", Description = "Lever Arch File", Price = 520.00m },
                new Item { ItemCode = "ITM-006", Description = "Printer Toner Cartridge", Price = 14500.00m },
                new Item { ItemCode = "ITM-007", Description = "USB Flash Drive 32GB", Price = 2900.00m },
                new Item { ItemCode = "ITM-008", Description = "Wireless Mouse", Price = 3500.00m },
                new Item { ItemCode = "ITM-009", Description = "USB Keyboard", Price = 4200.00m },
                new Item { ItemCode = "ITM-010", Description = "Aluminium Laptop Stand", Price = 6800.00m }
            );
        }

        context.SaveChanges();
    }
}
