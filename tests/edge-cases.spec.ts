import { test, expect } from '../fixtures';
import { edgeAdditionCases, edgeMultiplyCases } from '../data/calculatorData';

const bugErrorCases = [
  { id: 'TC-EDG-03', bugId: 'BUG-009', reason: 'empty expression returns undefined; display shows "undefined" instead of "Error"' },
  { id: 'TC-EDG-04', bugId: 'BUG-010', reason: 'expression "+" tokenizes to ["+"], parseFloat("+") = NaN, display shows "NaN" instead of "Error"' },
];

test.describe('Edge Cases & Error Handling', () => {

  test('TC-EDG-01 [BUG-008] 5 ÷ 0 should show "Error" or "Infinity"', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-008: division is reversed (BUG-003), so 5÷0 is evaluated as 0÷5 = 0 — real Infinity is never reached');
    await calc.pressDigit('5');
    await calc.pressDivide();
    await calc.pressDigit('0');
    await calc.pressEquals();
    expect(['Error', 'Infinity', '∞']).toContain(await calc.getDisplay());
  });

  test('TC-EDG-02: 0 ÷ 5 current behaviour is Infinity (BUG-003 reversal)', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.pressDigit('0');
    await calc.pressDivide();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Infinity');
  });

  test(`${bugErrorCases[0].id} [${bugErrorCases[0].bugId}] pressing "=" on empty display should show "Error"`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugErrorCases[0].bugId}: ${bugErrorCases[0].reason}`);
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test(`${bugErrorCases[1].id} [${bugErrorCases[1].bugId}] operator-only expression should show "Error"`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugErrorCases[1].bugId}: ${bugErrorCases[1].reason}`);
    await calc.pressAdd();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-05: C clears the display after a result', { tag: ['@smoke', '@regression'] }, async ({ calc }) => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
    await calc.pressClear();
    expect(await calc.getDisplay()).toBe('');
  });

  test('TC-EDG-06: C clears the display after an error', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
    await calc.pressClear();
    expect(await calc.getDisplay()).toBe('');
  });

  test('TC-EDG-07: 0.1 + 0.2 ≈ 0.3', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.typeNumber('0.1');
    await calc.pressAdd();
    await calc.typeNumber('0.2');
    await calc.pressEquals();
    expect(parseFloat(await calc.getDisplay())).toBeCloseTo(0.3, 10);
  });

  test('TC-EDG-08: .5 + .5 = 1 (leading decimal)', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDecimal();
    await calc.pressDigit('5');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('1');
  });

  for (const { id, a, b, expected, tags } of edgeAdditionCases) {
    test(`${id}: ${a} + ${b} = ${expected}`, { tag: tags }, async ({ calc }) => {
      await calc.typeNumber(a);
      await calc.pressAdd();
      await calc.typeNumber(b);
      await calc.pressEquals();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  for (const { id, a, b, expected, tags } of edgeMultiplyCases) {
    test(`${id}: ${a} × ${b} = ${expected}`, { tag: tags }, async ({ calc }) => {
      await calc.typeNumber(a);
      await calc.pressMultiply();
      await calc.typeNumber(b);
      await calc.pressEquals();
      expect(await calc.getDisplay()).toBe(expected);
    });
  }

  test('TC-EDG-11 [BUG-006] sqrt of negative should show "Error" not "NaN"', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-006: Math.sqrt(negative) returns NaN; calculator should display "Error"');
    await calc.page.evaluate(() => {
      (document.getElementById('display') as HTMLInputElement).value = '-4';
    });
    await calc.pressSqrt();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-12 [BUG-007] log(0) should show "Error" not "-Infinity"', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-007: Math.log10(0) = -Infinity; calculator should display "Error"');
    await calc.pressDigit('0');
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-13 [BUG-007] log of negative should show "Error" not "NaN"', { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, 'BUG-007: Math.log10(negative) = NaN; calculator should display "Error"');
    await calc.page.evaluate(() => {
      (document.getElementById('display') as HTMLInputElement).value = '-1';
    });
    await calc.pressLog();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test('TC-EDG-14: result used in next operation – (2+4)+4 = 10', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.typeNumber('2');
    await calc.pressAdd();
    await calc.typeNumber('4');
    await calc.pressEquals();
    await calc.pressAdd();
    await calc.typeNumber('4');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('10');
  });

  test('TC-EDG-15: expression ending with operator shows Error', { tag: ['@regression'] }, async ({ calc }) => {
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });
});
