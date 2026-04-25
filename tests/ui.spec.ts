import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('UI – Structure & Layout', () => {
  let calc: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  test('TC-UI-01: page title is "Scientific Calculator"', async ({ page }) => {
    await expect(page).toHaveTitle('Scientific Calculator');
  });

  test('TC-UI-02: display is visible and starts empty', async () => {
    await expect(calc.display).toBeVisible();
    expect(await calc.getDisplay()).toBe('');
  });

  test('TC-UI-03: display is read-only (disabled input)', async () => {
    await expect(calc.display).toBeDisabled();
  });

  test('TC-UI-04: all 24 buttons are visible', async ({ page }) => {
    const buttons = page.getByRole('button');
    await expect(buttons).toHaveCount(24);
  });

  test('TC-UI-05: all expected button labels are present', async ({ page }) => {
    const expected = ['C', '(', ')', '÷', '7', '8', '9', '×', '4', '5', '6', '−',
                      '1', '2', '3', '+', '0', '.', '=', 'sin', 'cos', 'tan', '√', 'log'];
    for (const label of expected) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  test('TC-UI-06: clear button resets display to empty', async () => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDigit('3');
    await calc.pressClear();
    expect(await calc.getDisplay()).toBe('');
  });

  // ── Structural bug checks (these assert the correct wiring; fail = bug) ──

  test('TC-UI-07 [BUG-001] button "3" must append digit 3, not 0', async () => {
    test.fail(true, 'BUG-001: "3" button is wired to append("0") instead of append("3")');
    await calc.pressClear();
    await calc.pressDigit('3');
    expect(await calc.getDisplay()).toBe('3');
  });

  test('TC-UI-08 [BUG-002] button "−" must append "-", not "/"', async () => {
    test.fail(true, 'BUG-002: "−" button is wired to append("/") instead of append("-")');
    await calc.pressClear();
    await calc.pressSubtract();
    expect(await calc.getDisplay()).toBe('−');
  });
});
