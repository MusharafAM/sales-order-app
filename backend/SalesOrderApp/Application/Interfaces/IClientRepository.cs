using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces;

public interface IClientRepository
{
    Task<List<Client>> GetAllAsync();
}
