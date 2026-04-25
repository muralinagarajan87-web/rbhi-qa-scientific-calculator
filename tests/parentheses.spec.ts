import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('Parentheses & Grouping', () => {
  let calc: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  test('TC-PAR-01: (2 + 4) = 6', async () => {
    await calc.pressOpenParen();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressCloseParen();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('6');
  });

  test('TC-PAR-02 [BUG-005] (4 + 6) + 2 = 12', async () => {
    test.fail(true, 'BUG-005: parser skips token after ")", so the "+" between ")" and "2" is lost; result is 10 instead of 12');
    await calc.pressOpenParen();
    await calc.pressDigit('4');
    await calc.pressAdd();
    await calc.pressDigit('6');
    await calc.pressCloseParen();
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('12');
  });

  test('TC-PAR-03 [BUG-005] (2 + 3) × 4 = 20', async () => {
    test.fail(true, 'BUG-005: parser increments index by 2 on ")", skipping the × token; returns 5 instead of 20');
    await calc.pressOpenParen();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('3');
    await calc.pressCloseParen();
    await calc.pressMultiply();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('20');
  });

  test('TC-PAR-04 [BUG-005] (1 + 1) × (2 + 2) = 8', async () => {
    test.fail(true, 'BUG-005: off-by-one on closing ")" causes post-paren operator to be skipped');
    await calc.pressOpenParen();
    await calc.pressDigit('1');
    await calc.pressAdd();
    await calc.pressDigit('1');
    await calc.pressCloseParen();
    await calc.pressMultiply();
    await calc.pressOpenParen();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressCloseParen();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('8');
  });

  test('TC-PAR-05 [BUG-005] (10 + 2) ÷ 4 = 3', async () => {
    test.fail(true, 'BUG-005: ")" skips next token; also affected by BUG-003 (division reversed)');
    await calc.pressOpenParen();
    await calc.typeNumber('10');
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressCloseParen();
    await calc.pressDivide();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('3');
  });

  test('TC-PAR-06 [BUG-011] unclosed parenthesis should show Error', async () => {
    test.fail(true, 'BUG-011: parser silently evaluates inner expression when closing ")" is absent');
    await calc.pressOpenParen();
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-PAR-07 [BUG-012] lone ")" without "(" should show Error', async () => {
    test.fail(true, 'BUG-012: stray ")" is ignored; "5)" evaluates to 5 instead of Error');
    await calc.pressDigit('5');
    await calc.pressCloseParen();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });
});
