using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly ISalesOrderRepository _orderRepository;
    private readonly IItemRepository _itemRepository;
    private readonly IMapper _mapper;

    public SalesOrderService(
        ISalesOrderRepository orderRepository,
        IItemRepository itemRepository,
        IMapper mapper)
    {
        _orderRepository = orderRepository;
        _itemRepository = itemRepository;
        _mapper = mapper;
    }

    public async Task<List<SalesOrderListDto>> GetAllAsync() =>
        _mapper.Map<List<SalesOrderListDto>>(await _orderRepository.GetAllAsync());

    public async Task<SalesOrderDetailDto?> GetByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order == null ? null : _mapper.Map<SalesOrderDetailDto>(order);
    }

    public async Task<SalesOrderDetailDto> CreateAsync(SaveSalesOrderDto dto)
    {
        var order = new SalesOrder
        {
            ClientId = dto.ClientId,
            InvoiceNo = dto.InvoiceNo,
            InvoiceDate = dto.InvoiceDate,
            ReferenceNo = dto.ReferenceNo,
            Note = dto.Note
        };

        await BuildLinesAsync(order, dto.Lines);
        ComputeTotals(order);

        await _orderRepository.AddAsync(order);

        return (await GetByIdAsync(order.Id))!;
    }

    public async Task<SalesOrderDetailDto?> UpdateAsync(int id, SaveSalesOrderDto dto)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
        {
            return null;
        }

        order.ClientId = dto.ClientId;
        order.InvoiceNo = dto.InvoiceNo;
        order.InvoiceDate = dto.InvoiceDate;
        order.ReferenceNo = dto.ReferenceNo;
        order.Note = dto.Note;

        // Replace the existing lines with the new set from the client.
        _orderRepository.RemoveLines(order.Lines.ToList());
        order.Lines.Clear();

        await BuildLinesAsync(order, dto.Lines);
        ComputeTotals(order);

        await _orderRepository.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    /// <summary>
    /// Builds order lines from the incoming DTO. All monetary values are
    /// recalculated server-side using the item's current price so a client
    /// can never post tampered amounts:
    ///   Excl Amount = Quantity * Price
    ///   Tax Amount  = Excl Amount * Tax Rate / 100
    ///   Incl Amount = Excl Amount + Tax Amount
    /// </summary>
    private async Task BuildLinesAsync(SalesOrder order, List<SaveSalesOrderLineDto> lineDtos)
    {
        if (lineDtos == null || lineDtos.Count == 0)
        {
            throw new ArgumentException("A sales order must contain at least one line item.");
        }

        var itemIds = lineDtos.Select(l => l.ItemId).Distinct().ToList();
        var items = await _itemRepository.GetByIdsAsync(itemIds);

        foreach (var lineDto in lineDtos)
        {
            var item = items.FirstOrDefault(i => i.Id == lineDto.ItemId)
                ?? throw new ArgumentException($"Item with id {lineDto.ItemId} was not found.");

            var exclAmount = Round(lineDto.Quantity * item.Price);
            var taxAmount = Round(exclAmount * lineDto.TaxRate / 100m);

            order.Lines.Add(new SalesOrderLine
            {
                ItemId = item.Id,
                Note = lineDto.Note,
                Quantity = lineDto.Quantity,
                Price = item.Price,
                TaxRate = lineDto.TaxRate,
                ExclAmount = exclAmount,
                TaxAmount = taxAmount,
                InclAmount = exclAmount + taxAmount
            });
        }
    }

    private static void ComputeTotals(SalesOrder order)
    {
        order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
        order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
        order.TotalIncl = order.Lines.Sum(l => l.InclAmount);
    }

    private static decimal Round(decimal value) =>
        Math.Round(value, 2, MidpointRounding.AwayFromZero);
}
