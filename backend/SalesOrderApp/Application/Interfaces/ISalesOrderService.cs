using SalesOrderApp.Application.DTOs;

namespace SalesOrderApp.Application.Interfaces;

public interface ISalesOrderService
{
    Task<List<SalesOrderListDto>> GetAllAsync();
    Task<SalesOrderDetailDto?> GetByIdAsync(int id);
    Task<SalesOrderDetailDto> CreateAsync(SaveSalesOrderDto dto);
    Task<SalesOrderDetailDto?> UpdateAsync(int id, SaveSalesOrderDto dto);
}
