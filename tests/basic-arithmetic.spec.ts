import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

/**
 * Basic Arithmetic Tests
 *
 * Covers: addition, subtraction, multiplication, division, chained
 * operations, and multi-digit number entry.
 *
 * Tests annotated with test.fail() document confirmed bugs; they are
 * expected to fail against the current build and must be fixed before
 * release.
 */
test.describe('Basic Arithmetic', () => {
  let calc: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  // ── Addition ──────────────────────────────────────────────────────────────

  test('TC-ADD-01: 2 + 4 = 6', async () => {
    // Avoids digit "3" (BUG-001) to keep this test isolated to addition.
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('6');
  });

  test('TC-ADD-02: 0 + 0 = 0', async () => {
    await calc.pressDigit('0');
    await calc.pressAdd();
    await calc.pressDigit('0');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('0');
  });

  test('TC-ADD-03: adding two decimals – 1.5 + 2.5 = 4', async () => {
    await calc.pressDigit('1');
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('4');
  });

  test('TC-ADD-04: large number addition – 999 + 1 = 1000', async () => {
    await calc.typeNumber('999');
    await calc.pressAdd();
    await calc.pressDigit('1');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('1000');
  });

  // ── Subtraction ───────────────────────────────────────────────────────────

  test('TC-SUB-01 [BUG-002] 9 − 4 = 5', async () => {
    test.fail(true, 'BUG-002: "−" button appends "/" so expression becomes "9/4", not "9-4"');
    await calc.pressDigit('9');
    await calc.pressSubtract();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('5');
  });

  test('TC-SUB-02 [BUG-002] 10 − 10 = 0', async () => {
    test.fail(true, 'BUG-002: "−" button appends "/" instead of "-"');
    await calc.typeNumber('10');
    await calc.pressSubtract();
    await calc.typeNumber('10');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('0');
  });

  test('TC-SUB-03 [BUG-002] result is negative: 4 − 9 = -5', async () => {
    test.fail(true, 'BUG-002: "−" button appends "/" instead of "-"');
    await calc.pressDigit('4');
    await calc.pressSubtract();
    await calc.pressDigit('9');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('-5');
  });

  // ── Multiplication ────────────────────────────────────────────────────────

  test('TC-MUL-01: 6 × 4 = 24', async () => {
    await calc.pressDigit('6');
    await calc.pressMultiply();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('24');
  });

  test('TC-MUL-02: 0 × 9 = 0', async () => {
    await calc.pressDigit('0');
    await calc.pressMultiply();
    await calc.pressDigit('9');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('0');
  });

  test('TC-MUL-03: decimal multiplication – 2.5 × 4 = 10', async () => {
    await calc.pressDigit('2');
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressMultiply();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
  });

  // ── Division ──────────────────────────────────────────────────────────────

  test('TC-DIV-01 [BUG-003] 10 ÷ 2 = 5', async () => {
    test.fail(true, 'BUG-003: division is reversed (right÷left), so 10÷2 returns 0.2 instead of 5');
    await calc.typeNumber('10');
    await calc.pressDivide();
    await calc.pressDigit('2');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('5');
  });

  test('TC-DIV-02 [BUG-003] 9 ÷ 3 = 3', async () => {
    test.fail(true, 'BUG-003: division is reversed; 9÷3 returns 0.333… instead of 3');
    await calc.pressDigit('9');
    await calc.pressDivide();
    await calc.pressDigit('3');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('3');
  });

  test('TC-DIV-03 [BUG-003] 1 ÷ 4 = 0.25', async () => {
    test.fail(true, 'BUG-003: division is reversed; 1÷4 returns 4 instead of 0.25');
    await calc.pressDigit('1');
    await calc.pressDivide();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('0.25');
  });

  // ── Digit 3 key ───────────────────────────────────────────────────────────

  test('TC-KEY-01 [BUG-001] pressing "3" button appends digit 3', async () => {
    test.fail(true, 'BUG-001: "3" button is mapped to append("0"); pressing it shows 0 not 3');
    await calc.pressDigit('3');
    expect(await calc.getDisplay()).toBe('3');
  });

  test('TC-KEY-02 [BUG-001] expression requiring digit 3: 3 + 3 = 6', async () => {
    test.fail(true, 'BUG-001: "3" button appends "0", so expression is "0+0=0" not "3+3=6"');
    await calc.pressDigit('3');
    await calc.pressAdd();
    await calc.pressDigit('3');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('6');
  });

  // ── Chained operations ────────────────────────────────────────────────────

  test('TC-CHN-01: 4 + 2 + 4 = 10 (left-to-right addition)', async () => {
    // Uses only digits 0,1,2,4-9 to avoid BUG-001 (digit "3" wired to "0").
    await calc.pressDigit('4');
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
  });

  test('TC-CHN-02: 8 × 2 + 4 = 20 (operator precedence: × before +)', async () => {
    await calc.pressDigit('8');
    await calc.pressMultiply();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('20');
  });
});
