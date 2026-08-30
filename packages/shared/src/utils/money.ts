/** KWD uses 3 decimal places — store/compare as fils to avoid float drift. */
export function moneyToFils(amount: number): number {
  return Math.round(amount * 1000);
}

export function filsToMoney(fils: number): number {
  return fils / 1000;
}

export function addMoneyAmounts(amounts: number[]): number {
  const totalFils = amounts.reduce((sum, a) => sum + moneyToFils(a), 0);
  return filsToMoney(totalFils);
}

export function subtractMoney(a: number, b: number): number {
  return filsToMoney(moneyToFils(a) - moneyToFils(b));
}
