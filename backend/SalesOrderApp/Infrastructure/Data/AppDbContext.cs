using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<SalesOrderLine> SalesOrderLines => Set<SalesOrderLine>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>(entity =>
        {
            entity.Property(c => c.CustomerName).HasMaxLength(200).IsRequired();
            entity.Property(c => c.Address1).HasMaxLength(200);
            entity.Property(c => c.Address2).HasMaxLength(200);
            entity.Property(c => c.Address3).HasMaxLength(200);
            entity.Property(c => c.Suburb).HasMaxLength(100);
            entity.Property(c => c.State).HasMaxLength(100);
            entity.Property(c => c.PostCode).HasMaxLength(20);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.Property(i => i.ItemCode).HasMaxLength(50).IsRequired();
            entity.HasIndex(i => i.ItemCode).IsUnique();
            entity.Property(i => i.Description).HasMaxLength(300).IsRequired();
            entity.Property(i => i.Price).HasPrecision(18, 2);
        });

        modelBuilder.Entity<SalesOrder>(entity =>
        {
            entity.Property(o => o.InvoiceNo).HasMaxLength(50);
            entity.Property(o => o.ReferenceNo).HasMaxLength(50);
            entity.Property(o => o.Note).HasMaxLength(1000);
            entity.Property(o => o.TotalExcl).HasPrecision(18, 2);
            entity.Property(o => o.TotalTax).HasPrecision(18, 2);
            entity.Property(o => o.TotalIncl).HasPrecision(18, 2);

            entity.HasOne(o => o.Client)
                  .WithMany(c => c.SalesOrders)
                  .HasForeignKey(o => o.ClientId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SalesOrderLine>(entity =>
        {
            entity.Property(l => l.Note).HasMaxLength(500);
            entity.Property(l => l.Quantity).HasPrecision(18, 2);
            entity.Property(l => l.Price).HasPrecision(18, 2);
            entity.Property(l => l.TaxRate).HasPrecision(5, 2);
            entity.Property(l => l.ExclAmount).HasPrecision(18, 2);
            entity.Property(l => l.TaxAmount).HasPrecision(18, 2);
            entity.Property(l => l.InclAmount).HasPrecision(18, 2);

            entity.HasOne(l => l.SalesOrder)
                  .WithMany(o => o.Lines)
                  .HasForeignKey(l => l.SalesOrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(l => l.Item)
                  .WithMany()
                  .HasForeignKey(l => l.ItemId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
