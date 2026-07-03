using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories;

public class SalesOrderRepository : ISalesOrderRepository
{
    private readonly AppDbContext _context;

    public SalesOrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<SalesOrder>> GetAllAsync() =>
        _context.SalesOrders
            .AsNoTracking()
            .Include(o => o.Client)
            .OrderByDescending(o => o.Id)
            .ToListAsync();

    public Task<SalesOrder?> GetByIdAsync(int id) =>
        _context.SalesOrders
            .Include(o => o.Client)
            .Include(o => o.Lines)
                .ThenInclude(l => l.Item)
            .FirstOrDefaultAsync(o => o.Id == id);

    public async Task AddAsync(SalesOrder order)
    {
        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();
    }

    public void RemoveLines(IEnumerable<SalesOrderLine> lines) =>
        _context.SalesOrderLines.RemoveRange(lines);

    public Task SaveChangesAsync() => _context.SaveChangesAsync();
}
