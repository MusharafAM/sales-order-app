using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _context;

    public ItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<Item>> GetAllAsync() =>
        _context.Items
            .AsNoTracking()
            .OrderBy(i => i.ItemCode)
            .ToListAsync();

    public Task<List<Item>> GetByIdsAsync(List<int> ids) =>
        _context.Items
            .AsNoTracking()
            .Where(i => ids.Contains(i.Id))
            .ToListAsync();
}
