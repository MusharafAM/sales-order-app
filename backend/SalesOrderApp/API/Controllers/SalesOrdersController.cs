using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;

    public SalesOrdersController(ISalesOrderService salesOrderService)
    {
        _salesOrderService = salesOrderService;
    }

    /// <summary>Returns all orders for the Home screen grid.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _salesOrderService.GetAllAsync());

    /// <summary>Returns a single order with its lines (used when editing).</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _salesOrderService.GetByIdAsync(id);
        return order == null ? NotFound() : Ok(order);
    }

    /// <summary>Creates a new sales order.</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SaveSalesOrderDto dto)
    {
        var error = Validate(dto);
        if (error != null)
        {
            return BadRequest(new { message = error });
        }

        try
        {
            var created = await _salesOrderService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Updates an existing sales order (edit and save again).</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] SaveSalesOrderDto dto)
    {
        var error = Validate(dto);
        if (error != null)
        {
            return BadRequest(new { message = error });
        }

        try
        {
            var updated = await _salesOrderService.UpdateAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private static string? Validate(SaveSalesOrderDto dto)
    {
        if (dto.ClientId <= 0)
        {
            return "Please select a customer.";
        }

        if (dto.Lines == null || dto.Lines.Count == 0)
        {
            return "Please add at least one line item.";
        }

        if (dto.Lines.Any(l => l.ItemId <= 0))
        {
            return "Every line must have an item selected.";
        }

        if (dto.Lines.Any(l => l.Quantity <= 0))
        {
            return "Quantity must be greater than zero for every line.";
        }

        if (dto.Lines.Any(l => l.TaxRate < 0))
        {
            return "Tax rate cannot be negative.";
        }

        return null;
    }
}
