export interface BinaryCase {
  id: string;
  a: string;
  b: string;
  expected: string;
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
}

export interface ErrorCase {
  id: string;
  bugId: string;
  reason: string;
}

export const additionCases: BinaryCase[] = [
  { id: 'TC-ADD-01', a: '2',   b: '4', expected: '6'    },
  { id: 'TC-ADD-02', a: '0',   b: '0', expected: '0'    },
  { id: 'TC-ADD-04', a: '999', b: '1', expected: '1000' },
];

export const multiplicationCases: BinaryCase[] = [
  { id: 'TC-MUL-01', a: '6',   b: '4', expected: '24' },
  { id: 'TC-MUL-02', a: '0',   b: '9', expected: '0'  },
  { id: 'TC-MUL-03', a: '2.5', b: '4', expected: '10' },
];

export const subtractionBugCases: BugBinaryCase[] = [
  { id: 'TC-SUB-01', a: '9',  b: '4',  expected: '5',  bugId: 'BUG-002', reason: '"−" button appends "/" instead of "-"' },
  { id: 'TC-SUB-02', a: '10', b: '10', expected: '0',  bugId: 'BUG-002', reason: '"−" button appends "/" instead of "-"' },
  { id: 'TC-SUB-03', a: '4',  b: '9',  expected: '-5', bugId: 'BUG-002', reason: '"−" button appends "/" instead of "-"' },
];

export const divisionBugCases: BugBinaryCase[] = [
  { id: 'TC-DIV-01', a: '10', b: '2', expected: '5',    bugId: 'BUG-003', reason: 'division is reversed; 10÷2 returns 0.2 instead of 5'   },
  { id: 'TC-DIV-02', a: '9',  b: '3', expected: '3',    bugId: 'BUG-003', reason: 'division is reversed; 9÷3 returns 0.333… instead of 3'  },
  { id: 'TC-DIV-03', a: '1',  b: '4', expected: '0.25', bugId: 'BUG-003', reason: 'division is reversed; 1÷4 returns 4 instead of 0.25'    },
];

export const sqrtCases: { id: string; input: string; expected: string }[] = [
  { id: 'TC-SQRT-01', input: '9', expected: '3' },
  { id: 'TC-SQRT-02', input: '4', expected: '2' },
  { id: 'TC-SQRT-04', input: '0', expected: '0' },
];

export const logCases: { id: string; input: string; expected: string }[] = [
  { id: 'TC-LOG-01', input: '100', expected: '2' },
  { id: 'TC-LOG-02', input: '10',  expected: '1' },
];

export const cosCases: ScientificCase[] = [
  { id: 'TC-COS-01', input: '0',       expected: 1,  precision: 10 },
  { id: 'TC-COS-02', input: '3.14159', expected: -1, precision: 4  },
];

export const tanCases: ScientificCase[] = [
  { id: 'TC-TAN-01', input: '0', expected: 0,                  precision: 10 },
  { id: 'TC-TAN-02', input: '1', expected: 1.5574077246549023, precision: 4  },
];

export const emptyFunctionErrorCases: { id: string; fn: string }[] = [
  { id: 'TC-SIN-04',  fn: 'sin'  },
  { id: 'TC-COS-03',  fn: 'cos'  },
  { id: 'TC-TAN-03',  fn: 'tan'  },
  { id: 'TC-SQRT-06', fn: 'sqrt' },
  { id: 'TC-LOG-05',  fn: 'log'  },
];

export const edgeAdditionCases: BinaryCase[] = [
  { id: 'TC-EDG-09', a: '9999999', b: '1', expected: '10000000' },
];

export const edgeMultiplyCases: BinaryCase[] = [
  { id: 'TC-EDG-10', a: '0', b: '0', expected: '0' },
];
