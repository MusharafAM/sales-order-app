using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface ISalesOrderRepository
{
    Task<List<SalesOrder>> GetAllAsync();
    Task<SalesOrder?> GetByIdAsync(int id);
    Task AddAsync(SalesOrder order);
    void RemoveLines(IEnumerable<SalesOrderLine> lines);
    Task SaveChangesAsync();
}
