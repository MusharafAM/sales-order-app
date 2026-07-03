using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Client, ClientDto>();
        CreateMap<Item, ItemDto>();

        CreateMap<SalesOrder, SalesOrderListDto>()
            .ForMember(d => d.CustomerName,
                opt => opt.MapFrom(s => s.Client == null ? string.Empty : s.Client.CustomerName));

        CreateMap<SalesOrder, SalesOrderDetailDto>()
            .ForMember(d => d.CustomerName,
                opt => opt.MapFrom(s => s.Client == null ? string.Empty : s.Client.CustomerName));

        CreateMap<SalesOrderLine, SalesOrderLineDto>()
            .ForMember(d => d.ItemCode,
                opt => opt.MapFrom(s => s.Item == null ? string.Empty : s.Item.ItemCode))
            .ForMember(d => d.Description,
                opt => opt.MapFrom(s => s.Item == null ? string.Empty : s.Item.Description));
    }
}
