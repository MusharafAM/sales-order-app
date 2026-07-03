using SalesOrderApp.Application.DTOs;

namespace SalesOrderApp.Application.Interfaces;

public interface IItemService
{
    Task<List<ItemDto>> GetAllAsync();
}
