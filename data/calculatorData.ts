export interface BinaryCase {
  id: string;
  a: string;
  b: string;
  expected: string;
  tags: string[];
}

export interface BugBinaryCase extends BinaryCase {
  bugId: string;
  reason: string;
}

export interface ScientificCase {
  id: string;
  input: string;
  expected: number;
  precision: number;
  tags: string[];
}

export interface SimpleScientificCase {
  id: string;
  input: string;
  expected: string;
  tags: string[];
}

export interface FunctionErrorCase {
  id: string;
  fn: string;
  tags: string[];
}

export const additionCases: BinaryCase[] = [
  { id: 'TC-ADD-01', a: '2',   b: '4', expected: '6',    tags: ['@smoke', '@regression'] },
  { id: 'TC-ADD-02', a: '0',   b: '0', expected: '0',    tags: ['@regression'] },
  { id: 'TC-ADD-04', a: '999', b: '1', expected: '1000', tags: ['@regression'] },
];

export const multiplicationCases: BinaryCase[] = [
  { id: 'TC-MUL-01', a: '6',   b: '4', expected: '24', tags: ['@smoke', '@regression'] },
  { id: 'TC-MUL-02', a: '0',   b: '9', expected: '0',  tags: ['@regression'] },
  { id: 'TC-MUL-03', a: '2.5', b: '4', expected: '10', tags: ['@regression'] },
];

export const subtractionBugCases: BugBinaryCase[] = [
  { id: 'TC-SUB-01', a: '9',  b: '4',  expected: '5',  bugId: 'BUG-002', reason: '"−" button appends "/" instead of "-"',          tags: ['@regression', '@bug'] },
  { id: 'TC-SUB-02', a: '10', b: '10', expected: '0',  bugId: 'BUG-002', reason: '"−" button appends "/" instead of "-"',          tags: ['@regression', '@bug'] },
  { id: 'TC-SUB-03', a: '4',  b: '9',  expected: '-5', bugId: 'BUG-002', reason: '"−" button appends "/" instead of "-"',          tags: ['@regression', '@bug'] },
];

export const divisionBugCases: BugBinaryCase[] = [
  { id: 'TC-DIV-01', a: '10', b: '2', expected: '5',    bugId: 'BUG-003', reason: 'division is reversed; 10÷2 returns 0.2 instead of 5',   tags: ['@regression', '@bug'] },
  { id: 'TC-DIV-02', a: '9',  b: '3', expected: '3',    bugId: 'BUG-003', reason: 'division is reversed; 9÷3 returns 0.333… instead of 3',  tags: ['@regression', '@bug'] },
  { id: 'TC-DIV-03', a: '1',  b: '4', expected: '0.25', bugId: 'BUG-003', reason: 'division is reversed; 1÷4 returns 4 instead of 0.25',    tags: ['@regression', '@bug'] },
];

export const sqrtCases: SimpleScientificCase[] = [
  { id: 'TC-SQRT-01', input: '9', expected: '3', tags: ['@smoke', '@regression'] },
  { id: 'TC-SQRT-02', input: '4', expected: '2', tags: ['@regression'] },
  { id: 'TC-SQRT-04', input: '0', expected: '0', tags: ['@regression'] },
];

export const logCases: SimpleScientificCase[] = [
  { id: 'TC-LOG-01', input: '100', expected: '2', tags: ['@smoke', '@regression'] },
  { id: 'TC-LOG-02', input: '10',  expected: '1', tags: ['@regression'] },
];

export const cosCases: ScientificCase[] = [
  { id: 'TC-COS-01', input: '0',       expected: 1,  precision: 10, tags: ['@smoke', '@regression'] },
  { id: 'TC-COS-02', input: '3.14159', expected: -1, precision: 4,  tags: ['@regression'] },
];

export const tanCases: ScientificCase[] = [
  { id: 'TC-TAN-01', input: '0', expected: 0,                  precision: 10, tags: ['@smoke', '@regression'] },
  { id: 'TC-TAN-02', input: '1', expected: 1.5574077246549023, precision: 4,  tags: ['@regression'] },
];

export const emptyFunctionErrorCases: FunctionErrorCase[] = [
  { id: 'TC-SIN-04',  fn: 'sin',  tags: ['@smoke', '@regression'] },
  { id: 'TC-COS-03',  fn: 'cos',  tags: ['@regression'] },
  { id: 'TC-TAN-03',  fn: 'tan',  tags: ['@regression'] },
  { id: 'TC-SQRT-06', fn: 'sqrt', tags: ['@regression'] },
  { id: 'TC-LOG-05',  fn: 'log',  tags: ['@regression'] },
];

export const edgeAdditionCases: BinaryCase[] = [
  { id: 'TC-EDG-09', a: '9999999', b: '1', expected: '10000000', tags: ['@regression'] },
];

export const edgeMultiplyCases: BinaryCase[] = [
  { id: 'TC-EDG-10', a: '0', b: '0', expected: '0', tags: ['@regression'] },
];
