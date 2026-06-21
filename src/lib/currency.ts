export function formatPrice(amount: number | string | null | undefined): string | null {
  if (amount == null || amount === "") return null;

  const value =
    typeof amount === "number" ? amount : Number.parseFloat(String(amount));

  if (Number.isNaN(value)) return String(amount);

  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

  return `Rs ${formatted}`;
}
