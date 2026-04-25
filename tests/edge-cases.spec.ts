import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('Edge Cases & Error Handling', () => {
  let calc: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  test('TC-EDG-01 [BUG-008] 5 ÷ 0 should show "Error" or "Infinity"', async () => {
    test.fail(true, 'BUG-008: division is reversed (BUG-003), so 5÷0 is evaluated as 0÷5 = 0 — real Infinity is never reached');
    await calc.pressDigit('5');
    await calc.pressDivide();
    await calc.pressDigit('0');
    await calc.pressEquals();
    const display = await calc.getDisplay();
    expect(['Error', 'Infinity', '∞']).toContain(display);
  });

  test('TC-EDG-02: 0 ÷ 5 current behaviour is Infinity (BUG-003 reversal)', async () => {
    await calc.pressDigit('0');
    await calc.pressDivide();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Infinity');
  });

  test('TC-EDG-03 [BUG-009] pressing "=" on empty display should show "Error"', async () => {
    test.fail(true, 'BUG-009: empty expression returns undefined; display shows "undefined" instead of "Error"');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-04 [BUG-010] operator-only expression should show "Error"', async () => {
    test.fail(true, 'BUG-010: expression "+" tokenizes to ["+"], parseFloat("+") = NaN, display shows "NaN" instead of "Error"');
    await calc.pressAdd();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

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
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
    await calc.pressClear();
    expect(await calc.getDisplay()).toBe('');
  });

  test('TC-EDG-07: 0.1 + 0.2 ≈ 0.3 (floating-point)', async () => {
    await calc.pressDigit('0');
    await calc.pressDecimal();
    await calc.pressDigit('1');
    await calc.pressAdd();
    await calc.pressDigit('0');
    await calc.pressDecimal();
    await calc.pressDigit('2');
    await calc.pressEquals();
    const result = parseFloat(await calc.getDisplay());
    expect(result).toBeCloseTo(0.3, 10);
  });

  test('TC-EDG-08: leading decimal – .5 + .5 = 1', async () => {
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('1');
  });

  test('TC-EDG-09: large number – 9999999 + 1 = 10000000', async () => {
    await calc.typeNumber('9999999');
    await calc.pressAdd();
    await calc.pressDigit('1');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10000000');
  });

  test('TC-EDG-10: 0 × 0 = 0', async () => {
    await calc.pressDigit('0');
    await calc.pressMultiply();
    await calc.pressDigit('0');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('0');
  });

  test('TC-EDG-11 [BUG-006] sqrt of negative should show "Error" not "NaN"', async () => {
    test.fail(true, 'BUG-006: Math.sqrt(negative) returns NaN; calculator should display "Error"');
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

  test('TC-EDG-14: result used in next operation – (2+4) + 4 = 10', async () => {
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
  });

  test('TC-EDG-15: expression ending with operator shows Error', async () => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });
});
