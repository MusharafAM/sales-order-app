using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface IItemRepository
{
    Task<List<Item>> GetAllAsync();
    Task<List<Item>> GetByIdsAsync(List<int> ids);
}
