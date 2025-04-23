function convertToSubcurrency(
  amount: number,
  factor: number = 100
): number {
  return Math.round(amount * factor);
}
export default convertToSubcurrency;