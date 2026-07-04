// Line and order total calculations, mirroring the server-side rules:
//   Excl Amount = Quantity * Price
//   Tax Amount  = Excl Amount * Tax Rate / 100
//   Incl Amount = Excl Amount + Tax Amount

export const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const computeLine = (price, quantity, taxRate) => {
  const unitPrice = parseFloat(price) || 0;
  const qty = parseFloat(quantity) || 0;
  const rate = parseFloat(taxRate) || 0;

  const exclAmount = round2(qty * unitPrice);
  const taxAmount = round2((exclAmount * rate) / 100);
  const inclAmount = round2(exclAmount + taxAmount);

  return { exclAmount, taxAmount, inclAmount };
};

export const computeTotals = (lines, items) =>
  lines.reduce(
    (totals, line) => {
      const item = items.find((i) => String(i.id) === String(line.itemId));
      if (!item) return totals;

      const { exclAmount, taxAmount, inclAmount } = computeLine(
        item.price,
        line.quantity,
        line.taxRate
      );

      return {
        totalExcl: round2(totals.totalExcl + exclAmount),
        totalTax: round2(totals.totalTax + taxAmount),
        totalIncl: round2(totals.totalIncl + inclAmount),
      };
    },
    { totalExcl: 0, totalTax: 0, totalIncl: 0 }
  );
