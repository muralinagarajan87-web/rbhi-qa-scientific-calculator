import { test, expect } from '../fixtures';

const expectedButtons = [
  'C', '(', ')', '÷', '7', '8', '9', '×',
  '4', '5', '6', '−', '1', '2', '3', '+',
  '0', '.', '=', 'sin', 'cos', 'tan', '√', 'log',
];

test.describe('UI – Structure & Layout', () => {

  test('TC-UI-01: page title is "Scientific Calculator"', { tag: ['@smoke', '@regression'] }, async ({ calc }) => {
    await expect(calc.page).toHaveTitle('Scientific Calculator');
  });

  test('TC-UI-02: display is visible and starts empty', { tag: ['@smoke', '@regression'] }, async ({ calc }) => {
    await expect(calc.display).toBeVisible();
    expect(await calc.getDisplay()).toBe('');
  });

  test('TC-UI-03: display is read-only (disabled input)', { tag: ['@regression'] }, async ({ calc }) => {
    await expect(calc.display).toBeDisabled();
  });

  test('TC-UI-04: all 24 buttons are present', { tag: ['@smoke', '@regression'] }, async ({ calc }) => {
    await expect(calc.page.getByRole('button')).toHaveCount(24);
  });

  for (const label of expectedButtons) {
    test(`TC-UI-05: button "${label}" is visible`, { tag: ['@regression'] }, async ({ calc }) => {
      await expect(
        calc.page.getByRole('button', { name: label, exact: true })
      ).toBeVisible();
    });
  }

  test('TC-UI-06: clear button resets display to empty', { tag: ['@smoke', '@regression'] }, async ({ calc }) => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDigit('9');
    await calc.pressClear();
    expect(await calc.getDisplay()).toBe('');
  });

  test('TC-UI-07 [BUG-001] button "3" must append digit 3, not 0', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-001: "3" button is wired to append("0") instead of append("3")');
    await calc.pressDigit('3');
    expect(await calc.getDisplay()).toBe('3');
  });

  test('TC-UI-08 [BUG-002] button "−" must append "-", not "/"', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-002: "−" button is wired to append("/") instead of append("-")');
    await calc.pressSubtract();
    expect(await calc.getDisplay()).toBe('−');
  });
});
