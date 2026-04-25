import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

/**
 * Edge Cases & Error Handling Tests
 *
 * Covers: divide by zero, empty-display evaluate, NaN handling,
 * floating-point precision, repeated equals, and boundary inputs.
 */
test.describe('Edge Cases & Error Handling', () => {
  let calc: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  // ── Divide by zero ────────────────────────────────────────────────────────

  test('TC-EDG-01 [BUG-008] 5 ÷ 0 should show "Error" or "Infinity"', async () => {
    test.fail(
      true,
      'BUG-008: division is reversed (BUG-003), so 5÷0 is evaluated as 0÷5 = 0 — real Infinity is never reached'
    );
    await calc.pressDigit('5');
    await calc.pressDivide();
    await calc.pressDigit('0');
    await calc.pressEquals();
    const display = await calc.getDisplay();
    // Acceptable outcomes: "Error", "Infinity", or "∞"
    expect(['Error', 'Infinity', '∞']).toContain(display);
  });

  test('TC-EDG-02: 0 ÷ 5 = 0  [zero numerator]', async () => {
    // Due to BUG-003, 0÷5 is computed as 5÷0 internally = Infinity.
    // This test documents the CURRENT (buggy) behaviour so regressions are caught.
    await calc.pressDigit('0');
    await calc.pressDivide();
    await calc.pressDigit('5');
    await calc.pressEquals();
    // Current buggy result: Infinity (because reversed: 5/0)
    // Once BUG-003 is fixed the expected value becomes '0'.
    const display = await calc.getDisplay();
    expect(display).toBe('Infinity'); // documents current behaviour
  });

  // ── Empty display ─────────────────────────────────────────────────────────

  test('TC-EDG-03 [BUG-009] pressing "=" on empty display should show "Error"', async () => {
    test.fail(true, 'BUG-009: empty expression returns undefined from evaluateExpression(); display shows "undefined" instead of "Error"');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-04 [BUG-010] pressing operator alone then "=" should show "Error"', async () => {
    test.fail(true, 'BUG-010: expression "+" tokenizes to ["+"], parseFloat("+") = NaN, display shows "NaN" instead of "Error"');
    await calc.pressAdd();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

  // ── Clear after result ────────────────────────────────────────────────────

  test('TC-EDG-05: C clears the display after a result', async () => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
    await calc.pressClear();
    expect(await calc.getDisplay()).toBe('');
  });

  test('TC-EDG-06: C clears the display after an error', async () => {
    // Use a proper Error-triggering expression (5+= → incomplete) rather than
    // empty "=" which shows "undefined" (BUG-009) instead of "Error".
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressEquals(); // incomplete expression → "Error"
    expect(await calc.getDisplay()).toBe('Error');
    await calc.pressClear();
    expect(await calc.getDisplay()).toBe('');
  });

  // ── Decimal input ─────────────────────────────────────────────────────────

  test('TC-EDG-07: decimal numbers – 0.1 + 0.2 is handled (floating-point)', async () => {
    await calc.pressDigit('0');
    await calc.pressDecimal();
    await calc.pressDigit('1');
    await calc.pressAdd();
    await calc.pressDigit('0');
    await calc.pressDecimal();
    await calc.pressDigit('2');
    await calc.pressEquals();
    const result = parseFloat(await calc.getDisplay());
    // Allow for JS floating-point imprecision
    expect(result).toBeCloseTo(0.3, 10);
  });

  test('TC-EDG-08: leading decimal – ".5 + .5 = 1"', async () => {
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('1');
  });

  // ── Large / boundary numbers ──────────────────────────────────────────────

  test('TC-EDG-09: large number – 9999999 + 1 = 10000000', async () => {
    await calc.typeNumber('9999999');
    await calc.pressAdd();
    await calc.pressDigit('1');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10000000');
  });

  test('TC-EDG-10: result of 0 × 0 = 0', async () => {
    await calc.pressDigit('0');
    await calc.pressMultiply();
    await calc.pressDigit('0');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('0');
  });

  // ── Scientific functions on edge values ───────────────────────────────────

  test('TC-EDG-11 [BUG-006] sqrt of negative shows "Error" not "NaN"', async () => {
    test.fail(true, 'BUG-006: Math.sqrt(negative) returns NaN; calculator should display "Error"');
    // Use JS to set a negative value directly (no button produces negative)
    await calc.page.evaluate(() => {
      (document.getElementById('display') as HTMLInputElement).value = '-4';
    });
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-12 [BUG-007] log(0) should show "Error" not "-Infinity"', async () => {
    test.fail(true, 'BUG-007: Math.log10(0) = -Infinity; calculator should display "Error"');
    await calc.pressDigit('0');
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-13 [BUG-007] log of negative number should show "Error" not "NaN"', async () => {
    test.fail(true, 'BUG-007: Math.log10(negative) = NaN; calculator should display "Error"');
    await calc.page.evaluate(() => {
      (document.getElementById('display') as HTMLInputElement).value = '-1';
    });
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('Error');
  });

  // ── Consecutive operations after result ───────────────────────────────────

  test('TC-EDG-14: result used in next operation – (2+4) then append + 4 = 10', async () => {
    // Avoids digit "3" (BUG-001).
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals(); // display = 6
    // Continue building on the result
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
  });

  // ── Input with only operator ──────────────────────────────────────────────

  test('TC-EDG-15: expression ending with operator shows Error', async () => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressEquals(); // incomplete expression
    expect(await calc.getDisplay()).toBe('Error');
  });
});
