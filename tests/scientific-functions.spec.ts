import { test, expect } from '../fixtures';
import {
  sqrtCases,
  logCases,
  cosCases,
  tanCases,
  emptyFunctionErrorCases,
} from '../data/calculatorData';
import { CalculatorPage } from '../pages/CalculatorPage';

type FnName = 'sin' | 'cos' | 'tan' | 'sqrt' | 'log';

const fnMap: Record<FnName, (calc: CalculatorPage) => Promise<void>> = {
  sin:  (c) => c.pressSin(),
  cos:  (c) => c.pressCos(),
  tan:  (c) => c.pressTan(),
  sqrt: (c) => c.pressSqrt(),
  log:  (c) => c.pressLog(),
};

test.describe('Scientific Functions', () => {

  test('TC-SIN-01 [BUG-004] sin(0) = 0', { tag: ['@smoke', '@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-004: sin() is hardcoded to return 1 (XOR constant) instead of Math.sin()');
    await calc.pressDigit('0');
    await calc.pressSin();
    expect(await calc.getDisplay()).toBe('0');
  });

  test('TC-SIN-02: sin(π/2) ≈ 1', { tag: ['@smoke', '@regression'] }, async ({ calc }) => {
    await calc.typeNumber('1.5708');
    await calc.pressSin();
    expect(parseFloat(await calc.getDisplay())).toBeCloseTo(1, 4);
  });

  test('TC-SIN-03 [BUG-004] sin(1) ≈ 0.8415, not 1', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-004: sin always returns 1');
    await calc.pressDigit('1');
    await calc.pressSin();
    expect(parseFloat(await calc.getDisplay())).toBeCloseTo(0.8414709848, 4);
  });

  for (const { id, input, expected, precision, tags } of cosCases) {
    test(`${id}: cos(${input}) ≈ ${expected}`, { tag: tags }, async ({ calc }) => {
      await calc.page.evaluate((val) => {
        (document.getElementById('display') as HTMLInputElement).value = val;
      }, input);
      await calc.pressCos();
      expect(parseFloat(await calc.getDisplay())).toBeCloseTo(expected, precision);
    });
  }

  for (const { id, input, expected, precision, tags } of tanCases) {
    test(`${id}: tan(${input}) ≈ ${expected}`, { tag: tags }, async ({ calc }) => {
      await calc.typeNumber(input);
      await calc.pressTan();
      expect(parseFloat(await calc.getDisplay())).toBeCloseTo(expected, precision);
    });
  }

  for (const { id, input, expected, tags } of sqrtCases) {
    test(`${id}: √${input} = ${expected}`, { tag: tags }, async ({ calc }) => {
      await calc.typeNumber(input);
      await calc.pressSqrt();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  test('TC-SQRT-03: √2 ≈ 1.4142', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.pressDigit('2');
    await calc.pressSqrt();
    expect(parseFloat(await calc.getDisplay())).toBeCloseTo(1.4142135623730951, 4);
  });

  test('TC-SQRT-05 [BUG-006] √(negative) should show "Error" not "NaN"', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-006: sqrt of a negative shows "NaN" instead of "Error"');
    await calc.pressDigit('9');
    await calc.pressSqrt();
    await calc.pressSubtract();
    await calc.typeNumber('10');
    await calc.pressEquals();
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('Error');
  });

  for (const { id, input, expected, tags } of logCases) {
    test(`${id}: log(${input}) = ${expected}`, { tag: tags }, async ({ calc }) => {
      await calc.typeNumber(input);
      await calc.pressLog();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  test('TC-LOG-03: log(1) = 0', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.pressDigit('1');
    await calc.pressLog();
    expect(parseFloat(await calc.getDisplay())).toBeCloseTo(0, 10);
  });

  test('TC-LOG-04 [BUG-007] log(0) should show "Error" not "-Infinity"', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-007: log(0) returns "-Infinity" instead of "Error"');
    await calc.pressDigit('0');
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('Error');
  });

  for (const { id, fn, tags } of emptyFunctionErrorCases) {
    test(`${id}: ${fn}() with empty display shows Error`, { tag: tags }, async ({ calc }) => {
      await fnMap[fn as FnName](calc);
      expect(await calc.getDisplay()).toBe('Error');
    });
  }
});
