import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

/**
 * Scientific Function Tests
 *
 * Covers: sin, cos, tan, √ (sqrt), log
 * Note: all trig functions operate in radians (no degree mode toggle).
 */
test.describe('Scientific Functions', () => {
  let calc: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  // ── sin ───────────────────────────────────────────────────────────────────

  test('TC-SIN-01 [BUG-004] sin(0) = 0', async () => {
    test.fail(true, 'BUG-004: sin() is hardcoded to return 1 (XOR constant) instead of Math.sin()');
    await calc.pressDigit('0');
    await calc.pressSin();
    expect(await calc.getDisplay()).toBe('0');
  });

  test('TC-SIN-02: sin(π/2) ≈ 1 — currently passes for the WRONG reason (BUG-004)', async () => {
    // sin(1.5708) correct value ≈ 1. BUG-004 hardcodes sin() to always return 1,
    // so this test coincidentally passes. TC-SIN-03 definitively exposes BUG-004.
    await calc.pressDigit('1');
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressDigit('7');
    await calc.pressDigit('0');
    await calc.pressDigit('8');
    await calc.pressSin();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(1, 4);
  });

  test('TC-SIN-03 [BUG-004] sin of non-zero value should not always equal 1', async () => {
    test.fail(true, 'BUG-004: sin always returns 1');
    await calc.pressDigit('1');
    await calc.pressSin();
    // sin(1 radian) ≈ 0.8414, definitely not 1
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(0.8414709848, 4);
  });

  test('TC-SIN-04: sin with non-numeric display shows Error', async () => {
    // Display is empty → parseFloat returns NaN → should show Error
    await calc.pressSin();
    expect(await calc.getDisplay()).toBe('Error');
  });

  // ── cos ───────────────────────────────────────────────────────────────────

  test('TC-COS-01: cos(0) = 1', async () => {
    await calc.pressDigit('0');
    await calc.pressCos();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(1, 10);
  });

  test('TC-COS-02: cos(π) ≈ -1  (value injected — digit "3" unavailable via buttons due to BUG-001)', async () => {
    // Inject π directly because the "3" button (needed for 3.14159) is broken (BUG-001).
    // cos() itself works correctly; this test validates that once the input is correct.
    await calc.page.evaluate(() => {
      (document.getElementById('display') as HTMLInputElement).value = '3.14159';
    });
    await calc.pressCos();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(-1, 4);
  });

  test('TC-COS-03: cos with non-numeric display shows Error', async () => {
    await calc.pressCos();
    expect(await calc.getDisplay()).toBe('Error');
  });

  // ── tan ───────────────────────────────────────────────────────────────────

  test('TC-TAN-01: tan(0) = 0', async () => {
    await calc.pressDigit('0');
    await calc.pressTan();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(0, 10);
  });

  test('TC-TAN-02: tan(1) ≈ 1.5574 (radians)', async () => {
    await calc.pressDigit('1');
    await calc.pressTan();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(1.5574077246549023, 4);
  });

  test('TC-TAN-03: tan with non-numeric display shows Error', async () => {
    await calc.pressTan();
    expect(await calc.getDisplay()).toBe('Error');
  });

  // ── √ (sqrt) ──────────────────────────────────────────────────────────────

  test('TC-SQRT-01: √9 = 3', async () => {
    await calc.pressDigit('9');
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('3');
  });

  test('TC-SQRT-02: √4 = 2', async () => {
    await calc.pressDigit('4');
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('2');
  });

  test('TC-SQRT-03: √2 ≈ 1.4142', async () => {
    await calc.pressDigit('2');
    await calc.pressSqrt();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(1.4142135623730951, 4);
  });

  test('TC-SQRT-04: √0 = 0', async () => {
    await calc.pressDigit('0');
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('0');
  });

  test('TC-SQRT-05 [BUG-006] √(-4) should show "Error", not "NaN"', async () => {
    test.fail(true, 'BUG-006: sqrt of a negative shows "NaN" instead of "Error"');
    // Type -9 via display: we can't type negative with buttons (no negative sign),
    // but the display value can hold it after a subtraction result.
    // As a direct structural test we assert the display shows "Error".
    await calc.pressDigit('9');
    await calc.pressSqrt();       // √9 = 3
    await calc.pressSubtract();   // (BUG-002 aside) try to create -ve
    await calc.typeNumber('10');
    await calc.pressEquals();     // result ≈ -7 (if subtraction worked)
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-SQRT-06: sqrt with non-numeric display shows Error', async () => {
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('Error');
  });

  // ── log (base-10) ─────────────────────────────────────────────────────────

  test('TC-LOG-01: log(100) = 2', async () => {
    await calc.typeNumber('100');
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('2');
  });

  test('TC-LOG-02: log(10) = 1', async () => {
    await calc.typeNumber('10');
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('1');
  });

  test('TC-LOG-03: log(1) = 0', async () => {
    await calc.pressDigit('1');
    await calc.pressLog();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(0, 10);
  });

  test('TC-LOG-04 [BUG-007] log(0) should show "Error", not "-Infinity"', async () => {
    test.fail(true, 'BUG-007: log(0) returns "-Infinity" instead of "Error"');
    await calc.pressDigit('0');
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-LOG-05: log with non-numeric display shows Error', async () => {
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('Error');
  });
});
