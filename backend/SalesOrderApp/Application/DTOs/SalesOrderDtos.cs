namespace SalesOrderApp.Application.DTOs;

/// <summary>Row shown in the Home screen orders grid.</summary>
public class SalesOrderListDto
{
    public int Id { get; set; }
    public string? InvoiceNo { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? ReferenceNo { get; set; }
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>Full order returned when opening/editing a single order.</summary>
public class SalesOrderDetailDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? InvoiceNo { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }
    public List<SalesOrderLineDto> Lines { get; set; } = new();
}

public class SalesOrderLineDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}

/// <summary>Payload used for both creating and updating a sales order.
/// Amounts are intentionally NOT accepted from the client; the server
/// recalculates them from Quantity, item Price and TaxRate.</summary>
public class SaveSalesOrderDto
{
    public int ClientId { get; set; }
    public string? InvoiceNo { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
    public List<SaveSalesOrderLineDto> Lines { get; set; } = new();
}

public class SaveSalesOrderLineDto
{
    public int ItemId { get; set; }
    public string? Note { get; set; }
    public decimal Quantity { get; set; }
    public decimal TaxRate { get; set; }
}
