using SalesOrderApp.Application.DTOs;

namespace SalesOrderApp.Application.Interfaces;

public interface IClientService
{
    Task<List<ClientDto>> GetAllAsync();
}
