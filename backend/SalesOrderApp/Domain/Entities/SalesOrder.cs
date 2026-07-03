namespace SalesOrderApp.Domain.Entities;

public class SalesOrder
{
    public int Id { get; set; }

    public int ClientId { get; set; }
    public Client? Client { get; set; }

    public string? InvoiceNo { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }

    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<SalesOrderLine> Lines { get; set; } = new List<SalesOrderLine>();
}
