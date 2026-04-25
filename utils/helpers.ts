/**
 * Shared test helpers for the Scientific Calculator test suite.
 */

/** Tolerance used when comparing floating-point results. */
export const FLOAT_PRECISION = 10;

/**
 * Rounds a value to the given decimal places for stable comparisons
 * in environments where the display may stringify with extra digits.
 */
export function roundTo(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

/** URL of the calculator under test. */
export const CALCULATOR_URL = '/calculator/index.html';
