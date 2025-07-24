export function amountToPenny(amount: number): number {
  return Math.round(amount * 100);
}

export function pennyToAmount(penny: number): number {
  return penny / 100;
}
