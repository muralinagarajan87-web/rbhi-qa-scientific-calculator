import { test, expect } from '../fixtures';

const bugCases = [
  {
    id: 'TC-PAR-02', label: '(4+6)+2=12',  bugId: 'BUG-005',
    reason: 'parser skips token after ")", so "+" between ")" and "2" is lost; result is 10 instead of 12',
  },
  {
    id: 'TC-PAR-03', label: '(2+3)×4=20',  bugId: 'BUG-005',
    reason: 'parser increments index by 2 on ")", skipping the × token; returns 5 instead of 20',
  },
  {
    id: 'TC-PAR-04', label: '(1+1)×(2+2)=8', bugId: 'BUG-005',
    reason: 'off-by-one on closing ")" causes post-paren operator to be skipped',
  },
  {
    id: 'TC-PAR-05', label: '(10+2)÷4=3', bugId: 'BUG-005+BUG-003',
    reason: '")" skips next token; also affected by BUG-003 (division reversed)',
  },
  {
    id: 'TC-PAR-06', label: 'unclosed paren → Error', bugId: 'BUG-011',
    reason: 'parser silently evaluates inner expression when closing ")" is absent',
  },
  {
    id: 'TC-PAR-07', label: 'stray ")" → Error', bugId: 'BUG-012',
    reason: 'stray ")" is ignored; "5)" evaluates to 5 instead of Error',
  },
];

test.describe('Parentheses & Grouping', () => {

  test('TC-PAR-01: (2+4) = 6', { tag: ['@smoke', '@regression'] }, async ({ calc }) => {
    await calc.pressOpenParen();
    await calc.pressDigit('2');
    await calc.pressAdd();
    await calc.pressDigit('4');
    await calc.pressCloseParen();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('6');
  });

  test(`${bugCases[0].id} [${bugCases[0].bugId}] ${bugCases[0].label}`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugCases[0].bugId}: ${bugCases[0].reason}`);
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

  test(`${bugCases[1].id} [${bugCases[1].bugId}] ${bugCases[1].label}`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugCases[1].bugId}: ${bugCases[1].reason}`);
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

  test(`${bugCases[2].id} [${bugCases[2].bugId}] ${bugCases[2].label}`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugCases[2].bugId}: ${bugCases[2].reason}`);
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

  test(`${bugCases[3].id} [${bugCases[3].bugId}] ${bugCases[3].label}`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugCases[3].bugId}: ${bugCases[3].reason}`);
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

  test(`${bugCases[4].id} [${bugCases[4].bugId}] ${bugCases[4].label}`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugCases[4].bugId}: ${bugCases[4].reason}`);
    await calc.pressOpenParen();
    await calc.pressDigit('5');
    await calc.pressAdd();
    await calc.pressDigit('2');
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });

  test(`${bugCases[5].id} [${bugCases[5].bugId}] ${bugCases[5].label}`, { tag: ['@regression', '@bug'] }, async ({ calc }) => {
    test.fail(true, `${bugCases[5].bugId}: ${bugCases[5].reason}`);
    await calc.pressDigit('5');
    await calc.pressCloseParen();
    await calc.pressEquals();
    expect(await calc.getDisplay()).toBe('Error');
  });
});
