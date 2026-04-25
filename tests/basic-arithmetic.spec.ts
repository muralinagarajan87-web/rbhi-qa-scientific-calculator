import { test, expect } from '../fixtures';
import {
  additionCases,
  multiplicationCases,
  subtractionBugCases,
  divisionBugCases,
} from '../data/calculatorData';

test.describe('Basic Arithmetic', () => {

  for (const { id, a, b, expected } of additionCases) {
    test(`${id}: ${a} + ${b} = ${expected}`, async ({ calc }) => {
      await calc.typeNumber(a);
      await calc.pressAdd();
      await calc.typeNumber(b);
      await calc.pressEquals();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  test('TC-ADD-03: 1.5 + 2.5 = 4', async ({ calc }) => {
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

  for (const { id, a, b, expected, bugId, reason } of subtractionBugCases) {
    test(`${id} [${bugId}] ${a} − ${b} = ${expected}`, async ({ calc }) => {
      test.fail(true, `${bugId}: ${reason}`);
      await calc.typeNumber(a);
      await calc.pressSubtract();
      await calc.typeNumber(b);
      await calc.pressEquals();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  for (const { id, a, b, expected } of multiplicationCases) {
    test(`${id}: ${a} × ${b} = ${expected}`, async ({ calc }) => {
      await calc.typeNumber(a);
      await calc.pressMultiply();
      await calc.typeNumber(b);
      await calc.pressEquals();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  for (const { id, a, b, expected, bugId, reason } of divisionBugCases) {
    test(`${id} [${bugId}] ${a} ÷ ${b} = ${expected}`, async ({ calc }) => {
      test.fail(true, `${bugId}: ${reason}`);
      await calc.typeNumber(a);
      await calc.pressDivide();
      await calc.typeNumber(b);
      await calc.pressEquals();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  test('TC-KEY-01 [BUG-001] pressing "3" button appends digit 3', async ({ calc }) => {
    test.fail(true, 'BUG-001: "3" button is mapped to append("0"); pressing it shows 0 not 3');
    await calc.pressDigit('3');
    expect(await calc.getDisplay()).toBe('3');
  });

  test('TC-KEY-02 [BUG-001] 3 + 3 = 6', async ({ calc }) => {
    test.fail(true, 'BUG-001: "3" button appends "0", so expression is "0+0=0" not "3+3=6"');
    await calc.pressDigit('3');
    await calc.pressAdd();
    await calc.pressDigit('3');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('6');
  });

  test('TC-CHN-01: 4 + 2 + 4 = 10', async ({ calc }) => {
    await calc.pressDigit('4');
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
  });

  test('TC-CHN-02: 8 × 2 + 4 = 20 (operator precedence)', async ({ calc }) => {
    await calc.pressDigit('8');
    await calc.pressMultiply();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('20');
  });
});
