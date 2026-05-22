export function formatNpr(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value

  if (Number.isNaN(amount)) {
    return `NPR ${value}`
  }

  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount)
}
