using Microsoft.AspNetCore.Mvc;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }

    /// <summary>Returns all customers for the 'Customer Name' dropdown.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _clientService.GetAllAsync());
}
