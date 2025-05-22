export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function parseCurrencyValue(text: string): number {
  if (!text) return 0;
  return parseFloat(text.replace(/,/g, '')) || 0;
}
