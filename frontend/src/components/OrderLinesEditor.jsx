import { computeLine } from '../utils/calculations';

export const emptyLine = () => ({ itemId: '', note: '', quantity: '', taxRate: '' });

// Editable line-items table. The same item list backs both the Item Code
// dropdown and the Description dropdown - selecting from either one picks
// the item, and the price + amounts are derived automatically.
export default function OrderLinesEditor({ lines, items, onChange }) {
  const updateLine = (index, patch) =>
    onChange(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)));

  const addLine = () => onChange([...lines, emptyLine()]);

  const removeLine = (index) => onChange(lines.filter((_, i) => i !== index));

  const headers = [
    'Item Code',
    'Description',
    'Note',
    'Quantity',
    'Price',
    'Tax %',
    'Excl Amount',
    'Tax Amount',
    'Incl Amount',
    '',
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border border-gray-300 bg-gray-200 px-2 py-2 text-left font-semibold text-gray-700"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lines.map((line, index) => {
            const item = items.find((i) => String(i.id) === String(line.itemId));
            const amounts = item
              ? computeLine(item.price, line.quantity, line.taxRate)
              : { exclAmount: 0, taxAmount: 0, inclAmount: 0 };

            return (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 p-1">
                  <select
                    value={line.itemId}
                    onChange={(e) => updateLine(index, { itemId: e.target.value })}
                    className="w-28 rounded border border-gray-300 bg-white px-1 py-1"
                  >
                    <option value="">--</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.itemCode}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 p-1">
                  <select
                    value={line.itemId}
                    onChange={(e) => updateLine(index, { itemId: e.target.value })}
                    className="w-full min-w-44 rounded border border-gray-300 bg-white px-1 py-1"
                  >
                    <option value="">--</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.description}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    value={line.note}
                    onChange={(e) => updateLine(index, { note: e.target.value })}
                    className="w-28 rounded border border-gray-300 px-1 py-1"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, { quantity: e.target.value })}
                    className="w-20 rounded border border-gray-300 px-1 py-1 text-right"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right text-gray-700">
                  {item ? item.price.toFixed(2) : ''}
                </td>
                <td className="border border-gray-300 p-1">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={line.taxRate}
                    onChange={(e) => updateLine(index, { taxRate: e.target.value })}
                    className="w-16 rounded border border-gray-300 px-1 py-1 text-right"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right">
                  {amounts.exclAmount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right">
                  {amounts.taxAmount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-right">
                  {amounts.inclAmount.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-1 text-center print:hidden">
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="rounded px-2 py-0.5 text-red-600 hover:bg-red-50"
                    title="Remove line"
                  >
                    &#10005;
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addLine}
        className="mt-2 rounded border border-gray-400 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 print:hidden"
      >
        + Add Item
      </button>
    </div>
  );
}
