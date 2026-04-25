# Bug Report – RBIH Scientific Calculator

**Application:** https://rbihubcodechallenge.github.io/calculator/index.html  
**Reported by:** QA Lead  
**Date:** 2026-04-25  
**Status:** Pending Developer Fix — DO NOT RELEASE

---

## Bug Summary

| Bug ID | Title | Component | Severity | Status |
|--------|-------|-----------|----------|--------|
| BUG-001 | "3" button appends "0" | Button wiring | Critical | Open |
| BUG-002 | "−" button appends "/" instead of "-" | Button wiring | Critical | Open |
| BUG-003 | Division evaluates right ÷ left (reversed) | Expression evaluator | Critical | Open |
| BUG-004 | sin() always returns 1 (hardcoded constant) | Scientific function | Critical | Open |
| BUG-005 | Post-parenthesis operator skipped in parser | Expression evaluator | High | Open |
| BUG-006 | sqrt(negative) displays "NaN" instead of "Error" | Error handling | Medium | Open |
| BUG-007 | log(0) / log(negative) shows "-Infinity"/"NaN" not "Error" | Error handling | Medium | Open |
| BUG-008 | 5 ÷ 0 shows "0" instead of "Error"/"Infinity" | Error handling | Medium | Open |
| BUG-009 | Empty display + "=" shows "undefined" instead of "Error" | Error handling | Medium | Open |
| BUG-010 | Operator-only expression shows "NaN" instead of "Error" | Error handling | Medium | Open |
| BUG-011 | Unclosed parenthesis silently evaluated, not rejected | Input validation | Low | Open |
| BUG-012 | Stray ")" silently ignored, not rejected | Input validation | Low | Open |

---

## BUG-001 — "3" Button Appends "0"

**Severity:** Critical  
**Component:** Button HTML wiring  
**Affected Test Cases:** TC-UI-07, TC-KEY-01, TC-KEY-02

### Description
The button labelled **3** fires `append('0')` instead of `append('3')`. Any expression that requires the digit 3 is silently corrupted. There is additionally no functional way to enter the digit 0 twice through separate buttons — both "3" and "0" invoke the same handler.

### Steps to Reproduce
1. Navigate to the calculator.
2. Press the **3** button.
3. Observe the display.

### Expected Result
Display shows **3**.

### Actual Result
Display shows **0**.

### Root Cause
Typo in HTML:
```html
<!-- Buggy -->
<button onclick="append('0')">3</button>

<!-- Fixed -->
<button onclick="append('3')">3</button>
```

### Fix
Change `append('0')` to `append('3')` for the button with label **3**.

---

## BUG-002 — "−" Button Appends "/" Instead of "-"

**Severity:** Critical  
**Component:** Button HTML wiring  
**Affected Test Cases:** TC-UI-08, TC-SUB-01, TC-SUB-02, TC-SUB-03

### Description
The subtraction button **−** fires `append('/')` (division) instead of `append('-')`. This makes subtraction completely impossible and silently duplicates the division operator.

As a side-effect there are **two** buttons that append `/` (the ÷ button and the − button) and **zero** buttons that append `-`.

### Steps to Reproduce
1. Press `9`, `−`, `4`, `=`.
2. Observe result.

### Expected Result
Display shows **5**.

### Actual Result
Display shows **0.444…** (because expression becomes `9/4`, then division is also reversed per BUG-003, giving `4/9`).

### Root Cause
```html
<!-- Buggy -->
<button onclick="append('/')">−</button>

<!-- Fixed -->
<button onclick="append('-')">−</button>
```

### Fix
Change `append('/')` to `append('-')` for the **−** button.

---

## BUG-003 — Division Evaluates Right ÷ Left (Reversed)

**Severity:** Critical  
**Component:** Expression evaluator (`_0x8329bc` function)  
**Affected Test Cases:** TC-DIV-01, TC-DIV-02, TC-DIV-03, TC-EDG-01, TC-EDG-02

### Description
Inside the obfuscated recursive-descent parser, the multiplication/division handler swaps the operands for division. The correct implementation should compute `left / right`; the actual implementation computes `right / left`.

- 10 ÷ 2 → returns **0.2** (i.e., 2 ÷ 10)
- 9 ÷ 3 → returns **0.333…** (i.e., 3 ÷ 9)
- 1 ÷ 4 → returns **4** (i.e., 4 ÷ 1)

### Steps to Reproduce
1. Press `1`, `0`, `÷`, `2`, `=`.

### Expected Result
Display shows **5**.

### Actual Result
Display shows **0.2**.

### Root Cause
```js
// Buggy — operands are swapped
if (op === '*') result = right * left;   // commutative, accidentally correct
else            result = right / left;   // NON-commutative: WRONG

// Fixed
if (op === '*') result = left * right;
else            result = left / right;
```

### Fix
Swap `right / left` to `left / right` in the division branch of the multiplication/division parser loop.

---

## BUG-004 — sin() Always Returns 1 (Hardcoded Constant)

**Severity:** Critical  
**Component:** `func('sin')` in JavaScript  
**Affected Test Cases:** TC-SIN-01, TC-SIN-02, TC-SIN-03

### Description
The `sin` branch of the `func()` function assigns the XOR expression `434563 ^ 434562` (which evaluates to the integer **1**) instead of calling `Math.sin()`. Every `sin` computation returns 1 regardless of input.

- sin(0) → **1** (correct value: 0)
- sin(1) → **1** (correct value: ≈ 0.8415)
- sin(3.14159) → **1** (correct value: ≈ 0)

### Steps to Reproduce
1. Press `0`, then press `sin`.

### Expected Result
Display shows **0**.

### Actual Result
Display shows **1**.

### Root Cause
```js
// Buggy
if (type === 'sin') display.value = 434563 ^ 434562;   // = 1

// Fixed
if (type === 'sin') display.value = Math.sin(value);
```

### Fix
Replace `434563 ^ 434562` with `Math.sin(_0xc2af5d)` (mirroring the pattern used for cos/tan/sqrt/log which are correct).

---

## BUG-005 — Post-Parenthesis Operator Skipped by Parser

**Severity:** High  
**Component:** Expression evaluator (`_0x4c3dcb` function — primary parser)  
**Affected Test Cases:** TC-PAR-03, TC-PAR-04, TC-PAR-05

### Description
When the parser encounters a closing `)`, it increments its token index by **2** instead of **1**, effectively skipping the token immediately following the `)`. This means any operator appearing directly after a closing parenthesis (e.g., `×`, `+`, `÷`) is silently dropped.

Examples:
- `(2+3)*4` → returns **5** (the `*` and `4` are ignored)
- `(1+1)*(2+2)` → returns **2** (second group is ignored)
- `(10+2)/4` → affected by both this bug and BUG-003

### Steps to Reproduce
1. Press `(`, `2`, `+`, `3`, `)`, `×`, `4`, `=`.

### Expected Result
Display shows **20**.

### Actual Result
Display shows **5**.

### Root Cause
```js
// Buggy — XOR evaluates to 2, so index jumps by 2 instead of 1
if (tokens[index] === ')') index = index + (326947 ^ 326945);  // = 2

// Fixed
if (tokens[index] === ')') index += 1;
```

The XOR expression `326947 ^ 326945` equals **2**, causing a two-step advance that skips the next token.

### Fix
Replace `(326947 ^ 326945)` with `1`.

---

## BUG-006 — sqrt(negative) Displays "NaN" Instead of "Error"

**Severity:** Medium  
**Component:** `func('sqrt')` error handling  
**Affected Test Cases:** TC-SQRT-05, TC-EDG-11

### Description
`Math.sqrt(-n)` returns `NaN` in JavaScript. The calculator surfaces this raw `NaN` string to the user instead of a friendly "Error" message.

### Steps to Reproduce
1. Set display to `-9` (by any means).
2. Press `√`.

### Expected Result
Display shows **Error**.

### Actual Result
Display shows **NaN**.

### Fix
Add an `isNaN` guard after the sqrt computation:
```js
const result = Math.sqrt(value);
display.value = isNaN(result) ? 'Error' : result;
```

---

## BUG-007 — log(0) / log(negative) Shows "-Infinity" or "NaN"

**Severity:** Medium  
**Component:** `func('log')` error handling  
**Affected Test Cases:** TC-LOG-04, TC-EDG-12, TC-EDG-13

### Description
`Math.log10(0)` returns `-Infinity` and `Math.log10(-n)` returns `NaN`. Neither is surfaced as a meaningful error to the user.

### Steps to Reproduce – log(0)
1. Press `0`.
2. Press `log`.

### Expected Result
Display shows **Error**.

### Actual Result
Display shows **-Infinity**.

### Fix
Add domain guards:
```js
if (value <= 0) { display.value = 'Error'; return; }
display.value = Math.log10(value);
```

---

## BUG-008 — 5 ÷ 0 Shows "0" (Division Reversal Masks Infinity)

**Severity:** Medium  
**Component:** Expression evaluator + error handling  
**Affected Test Cases:** TC-EDG-01

### Description
Due to BUG-003 (reversed division), the expression `5/0` is actually computed as `0/5 = 0`. This means divide-by-zero is **silently masked** — it neither throws an error nor returns Infinity; it returns 0, giving the user a plausible but incorrect result.

Once BUG-003 is fixed, divide-by-zero will correctly produce `Infinity`. The additional fix needed is to detect `Infinity` and display `"Error"` instead.

### Steps to Reproduce
1. Press `5`, `÷`, `0`, `=`.

### Expected Result
Display shows **Error** (or **Infinity** as an intermediate fix).

### Actual Result
Display shows **0**.

### Fix (two-part)
1. Fix BUG-003 (division direction).
2. After `evaluateExpression`, check:
   ```js
   if (!isFinite(result)) { display.value = 'Error'; return; }
   ```

---

## BUG-009 — Empty Display + "=" Shows "undefined" Instead of "Error"

**Severity:** Medium  
**Component:** `calculate()` / `evaluateExpression()` — empty-string path  
**Affected Test Cases:** TC-EDG-03

### Description
When the display is empty and "=" is pressed, `evaluateExpression('')` returns JavaScript `undefined` (not an exception). The `calculate()` function assigns this directly to `display.value`, which renders as the string `"undefined"` — confusing and unprofessional.

### Steps to Reproduce
1. Navigate to the calculator (display is empty).
2. Press `=`.

### Expected Result
Display shows **Error**.

### Actual Result
Display shows **undefined**.

### Root Cause
```js
// In evaluateExpression():
if (tokens.length === 0) return undefined;  // not a throw → catch block not triggered
```

### Fix
```js
if (tokens.length === 0) throw new Error('Empty expression');
```

---

## BUG-010 — Operator-Only Expression Shows "NaN" Instead of "Error"

**Severity:** Medium  
**Component:** Expression evaluator — invalid token as primary  
**Affected Test Cases:** TC-EDG-04, TC-EDG-15

### Description
Expressions consisting of only an operator (e.g., `+`, `-`) produce `NaN` rather than a friendly error. `parseFloat('+')` returns `NaN`, which propagates through arithmetic and surfaces raw on the display.

### Steps to Reproduce
1. Press `+` then `=`.

### Expected Result
Display shows **Error**.

### Actual Result
Display shows **NaN**.

### Fix
In `calculate()`, after computing the result:
```js
if (result === undefined || isNaN(result)) { display.value = 'Error'; return; }
```

---

## BUG-011 — Unclosed Parenthesis Silently Evaluated, Not Rejected

**Severity:** Low  
**Component:** Expression evaluator — closing paren not required  
**Affected Test Cases:** TC-PAR-06

### Description
The expression `(5+2` (missing `)`) evaluates silently to **7** instead of showing "Error". The parser does not enforce balanced parentheses.

### Steps to Reproduce
1. Press `(`, `5`, `+`, `2` (no `)`)
2. Press `=`.

### Expected Result
Display shows **Error**.

### Actual Result
Display shows **7**.

### Fix
After `evaluateExpression` finishes, verify `index === tokens.length` — any remaining unconsumed tokens (including unclosed groups) should throw.

---

## BUG-012 — Stray ")" Silently Ignored, Not Rejected

**Severity:** Low  
**Component:** Expression evaluator — unexpected close paren  
**Affected Test Cases:** TC-PAR-07

### Description
The expression `5)` evaluates to **5** — the `)` is simply left unconsumed. Users making a parentheses typo receive a silently wrong result rather than an error prompt.

### Steps to Reproduce
1. Press `5`, `)`, `=`.

### Expected Result
Display shows **Error**.

### Actual Result
Display shows **5** (stray `)` ignored).

### Fix
Same as BUG-011: enforce that all tokens are consumed after parsing.

---

## Recommendations for Developer

1. **De-obfuscate the JavaScript** — the current XOR-encoded obfuscation is the direct root cause of at least BUG-003 and BUG-005 (subtle numeric errors in what appear to be intentional obfuscations). Remove obfuscation before the next review.
2. **Add input validation in `func()`** — check for domain errors (negative sqrt, non-positive log, Infinity) before writing to the display.
3. **Introduce a degree/radian mode toggle** — users expect trig inputs in degrees; the current radian-only mode should at minimum be documented with a visible indicator.
4. **Add backspace support** — users have no way to correct a single digit; they must clear everything.
5. **Add keyboard support** — the disabled display field prevents standard keyboard entry.
