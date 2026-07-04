const money = (v) => (typeof v === 'number' ? v.toFixed(2) : v);

// Orders grid for the Home screen. Double-clicking a row opens the order.
export default function OrdersGrid({ orders, onRowDoubleClick }) {
  if (!orders.length) {
    return (
      <p className="text-sm text-gray-500">
        No orders yet. Click &quot;Add New&quot; to create your first sales order.
      </p>
    );
  }

  const headers = [
    'Invoice No',
    'Invoice Date',
    'Customer',
    'Reference No',
    'Total Excl',
    'Total Tax',
    'Total Incl',
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border border-gray-300 bg-gray-200 px-3 py-2 text-left font-semibold text-gray-700"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              onDoubleClick={() => onRowDoubleClick(order)}
              className="cursor-pointer odd:bg-white even:bg-gray-50 hover:bg-blue-50"
              title="Double-click to open"
            >
              <td className="border border-gray-300 px-3 py-2">{order.invoiceNo || '-'}</td>
              <td className="border border-gray-300 px-3 py-2">
                {order.invoiceDate ? order.invoiceDate.slice(0, 10) : '-'}
              </td>
              <td className="border border-gray-300 px-3 py-2">{order.customerName}</td>
              <td className="border border-gray-300 px-3 py-2">{order.referenceNo || '-'}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{money(order.totalExcl)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{money(order.totalTax)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{money(order.totalIncl)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-500">Tip: double-click a row to open and edit the order.</p>
    </div>
  );
}
