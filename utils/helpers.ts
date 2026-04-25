export const FLOAT_PRECISION = 10;

export function roundTo(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

export const CALCULATOR_URL = '/calculator/index.html';
