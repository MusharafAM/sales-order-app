using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
        _itemService = itemService;
    }

    /// <summary>Returns all items for the Item Code / Description dropdowns.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _itemService.GetAllAsync());
}
