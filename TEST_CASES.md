# Manual Test Cases – RBIH Scientific Calculator

**Application URL:** https://rbihubcodechallenge.github.io/calculator/index.html  
**Prepared by:** QA Lead  
**Date:** 2026-04-25  
**Framework correlation:** Each TC-ID maps 1-to-1 to a Playwright spec.

---

## Category Legend

| Symbol | Meaning |
|--------|---------|
| ✅ POS | Positive – valid input, expected happy-path result |
| ❌ NEG | Negative – invalid/error input, expects graceful failure |
| ⚠️ EDGE | Edge – boundary values, special numbers, or corner cases |
| 🐛 BUG | Known bug; test is expected to fail until fixed |

---

## 1. UI Structure & Layout

---

### TC-UI-01 — Page Title ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Verify the browser tab shows the correct page title |
| **Precondition** | Browser is open; no prior navigation |
| **Steps** | 1. Navigate to `https://rbihubcodechallenge.github.io/calculator/index.html` |
| **Expected Result** | Page title is **"Scientific Calculator"** |
| **Actual Result** | PASS |

---

### TC-UI-02 — Display Starts Empty ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Verify the display is visible and starts with an empty value |
| **Precondition** | Fresh page load, no buttons pressed |
| **Steps** | 1. Navigate to the calculator page<br>2. Inspect the value of the display field |
| **Expected Result** | Display is visible and its value is **""** (empty) |
| **Actual Result** | PASS |

---

### TC-UI-03 — Display Is Read-Only ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Verify the display input is disabled / read-only (user cannot type directly) |
| **Precondition** | Page loaded |
| **Steps** | 1. Click inside the display field<br>2. Attempt to type characters via keyboard |
| **Expected Result** | No characters appear; the field is **disabled** |
| **Actual Result** | PASS |

---

### TC-UI-04 — All 24 Buttons Visible ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Verify exactly 24 buttons are rendered on the calculator |
| **Precondition** | Page loaded |
| **Steps** | 1. Count all `<button>` elements on the page |
| **Expected Result** | **24** buttons are visible |
| **Actual Result** | PASS |

---

### TC-UI-05 — All Button Labels Present ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Verify all expected button labels are present: C ( ) ÷ 7 8 9 × 4 5 6 − 1 2 3 + 0 . = sin cos tan √ log |
| **Precondition** | Page loaded |
| **Steps** | 1. For each expected label, confirm the button is visible |
| **Expected Result** | All 24 buttons display their correct labels |
| **Actual Result** | PASS |

---

### TC-UI-06 — Clear Resets Display ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Verify pressing "C" clears the display |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `5`, `+`, `3`<br>2. Verify display shows `5+3`<br>3. Press `C` |
| **Expected Result** | Display is **""** (empty) |
| **Actual Result** | PASS |

---

### TC-UI-07 — Button "3" Appends Digit 3 🐛 BUG-001

| Field | Detail |
|-------|--------|
| **Title** | Pressing the "3" button should append the digit **3** to the display |
| **Precondition** | Page loaded, display is empty |
| **Steps** | 1. Press the **3** button<br>2. Observe display |
| **Expected Result** | Display shows **3** |
| **Actual Result** | ❌ Display shows **0** — button is wired to `append('0')` instead of `append('3')` |
| **Severity** | Critical |
| **Bug ID** | BUG-001 |

---

### TC-UI-08 — Button "−" Appends Minus ❌ NEG 🐛 BUG-002

| Field | Detail |
|-------|--------|
| **Title** | Pressing the "−" (minus/subtract) button should append a minus sign |
| **Precondition** | Page loaded, display is empty |
| **Steps** | 1. Press the **−** button<br>2. Observe display |
| **Expected Result** | Display shows **−** |
| **Actual Result** | ❌ Display shows **/** — button is wired to `append('/')` |
| **Severity** | Critical |
| **Bug ID** | BUG-002 |

---

## 2. Basic Arithmetic

---

### TC-ADD-01 — Simple Addition ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 2 + 3 = 5 |
| **Precondition** | Page loaded, display empty |
| **Steps** | 1. Press `2`<br>2. Press `+`<br>3. Press `3`<br>4. Press `=` |
| **Expected Result** | Display shows **5** |
| **Actual Result** | PASS |

---

### TC-ADD-02 — Zero Addition ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 0 + 0 = 0 |
| **Precondition** | Page loaded, display empty |
| **Steps** | 1. Press `0` + `+` + `0` + `=` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | PASS |

---

### TC-ADD-03 — Decimal Addition ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 1.5 + 2.5 = 4 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `1`, `.`, `5`, `+`, `2`, `.`, `5`, `=` |
| **Expected Result** | Display shows **4** |
| **Actual Result** | PASS |

---

### TC-ADD-04 — Large Number Addition ⚠️ EDGE

| Field | Detail |
|-------|--------|
| **Title** | 999 + 1 = 1000 (multi-digit carry) |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `999`, press `+`, press `1`, press `=` |
| **Expected Result** | Display shows **1000** |
| **Actual Result** | PASS |

---

### TC-SUB-01 — Simple Subtraction 🐛 BUG-002

| Field | Detail |
|-------|--------|
| **Title** | 9 − 4 = 5 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `9`, `−`, `4`, `=` |
| **Expected Result** | Display shows **5** |
| **Actual Result** | ❌ Shows **0.444…** — "−" appends "/" so the expression is "9/4"; combined with reversed division (BUG-003), result is 4/9 |
| **Severity** | Critical |
| **Bug ID** | BUG-002 |

---

### TC-SUB-02 — Subtraction to Zero 🐛 BUG-002

| Field | Detail |
|-------|--------|
| **Title** | 10 − 10 = 0 |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `10`, press `−`, type `10`, press `=` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | ❌ BUG-002 causes incorrect operation |
| **Severity** | Critical |

---

### TC-SUB-03 — Negative Result ⚠️ EDGE 🐛 BUG-002

| Field | Detail |
|-------|--------|
| **Title** | 4 − 9 = -5 (result should be negative) |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `4`, `−`, `9`, `=` |
| **Expected Result** | Display shows **-5** |
| **Actual Result** | ❌ BUG-002 causes incorrect operation |
| **Severity** | Critical |

---

### TC-MUL-01 — Simple Multiplication ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 6 × 4 = 24 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `6`, `×`, `4`, `=` |
| **Expected Result** | Display shows **24** |
| **Actual Result** | PASS |

---

### TC-MUL-02 — Multiply by Zero ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 0 × 9 = 0 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`, `×`, `9`, `=` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | PASS |

---

### TC-MUL-03 — Decimal Multiplication ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 2.5 × 4 = 10 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `2`, `.`, `5`, `×`, `4`, `=` |
| **Expected Result** | Display shows **10** |
| **Actual Result** | PASS |

---

### TC-DIV-01 — Simple Division 🐛 BUG-003

| Field | Detail |
|-------|--------|
| **Title** | 10 ÷ 2 = 5 |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `10`, press `÷`, press `2`, press `=` |
| **Expected Result** | Display shows **5** |
| **Actual Result** | ❌ Display shows **0.2** — evaluator computes right ÷ left (i.e., 2 ÷ 10) |
| **Severity** | Critical |
| **Bug ID** | BUG-003 |

---

### TC-DIV-02 — Whole-Number Division 🐛 BUG-003

| Field | Detail |
|-------|--------|
| **Title** | 9 ÷ 3 = 3 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `9`, `÷`, `3`, `=` |
| **Expected Result** | Display shows **3** |
| **Actual Result** | ❌ Shows **0.333…** (reversed: 3÷9) |
| **Severity** | Critical |

---

### TC-DIV-03 — Fractional Result 🐛 BUG-003

| Field | Detail |
|-------|--------|
| **Title** | 1 ÷ 4 = 0.25 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `1`, `÷`, `4`, `=` |
| **Expected Result** | Display shows **0.25** |
| **Actual Result** | ❌ Shows **4** (reversed: 4÷1) |
| **Severity** | Critical |

---

### TC-KEY-01 — Digit 3 Appends Correctly 🐛 BUG-001

| Field | Detail |
|-------|--------|
| **Title** | Pressing "3" button should display the digit **3** |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `3`<br>2. Inspect display |
| **Expected Result** | Display shows **3** |
| **Actual Result** | ❌ Shows **0** |
| **Severity** | Critical |

---

### TC-KEY-02 — Expression Requiring Digit 3 🐛 BUG-001

| Field | Detail |
|-------|--------|
| **Title** | 3 + 3 = 6 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `3`, `+`, `3`, `=` |
| **Expected Result** | Display shows **6** |
| **Actual Result** | ❌ Shows **0** (BUG-001 causes both 3 buttons to enter "0") |

---

### TC-CHN-01 — Chained Addition ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 2 + 3 + 5 = 10 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `2`, `+`, `3`, `+`, `5`, `=` |
| **Expected Result** | Display shows **10** |
| **Actual Result** | PASS |

---

### TC-CHN-02 — Operator Precedence ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | 8 × 2 + 4 = 20 (multiplication before addition) |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `8`, `×`, `2`, `+`, `4`, `=` |
| **Expected Result** | Display shows **20** |
| **Actual Result** | PASS |

---

## 3. Scientific Functions

---

### TC-SIN-01 — sin(0) = 0 🐛 BUG-004

| Field | Detail |
|-------|--------|
| **Title** | sin(0) should return 0 |
| **Precondition** | Page loaded, display empty |
| **Steps** | 1. Press `0`<br>2. Press `sin` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | ❌ Shows **1** — sin is hardcoded to the XOR constant `434563^434562 = 1` |
| **Severity** | Critical |
| **Bug ID** | BUG-004 |

---

### TC-SIN-02 — sin(π/2) ≈ 1 🐛 BUG-004

| Field | Detail |
|-------|--------|
| **Title** | sin(1.5708) ≈ 1 (π/2 radians) |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `1.5708`<br>2. Press `sin` |
| **Expected Result** | Display shows approximately **1** |
| **Actual Result** | ❌ Shows **1** but for the wrong reason (hardcoded, not computed) |

---

### TC-SIN-03 — sin(1) ≈ 0.8415 🐛 BUG-004

| Field | Detail |
|-------|--------|
| **Title** | sin(1 radian) ≈ 0.8414709848 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `1`<br>2. Press `sin` |
| **Expected Result** | Display shows approximately **0.8414709848** |
| **Actual Result** | ❌ Shows **1** (always hardcoded) |

---

### TC-SIN-04 — sin with Empty Display → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | Pressing sin with no number entered shows "Error" |
| **Precondition** | Page loaded, display empty |
| **Steps** | 1. Press `sin` (without entering a number) |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

### TC-COS-01 — cos(0) = 1 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | cos(0) should return 1 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`<br>2. Press `cos` |
| **Expected Result** | Display shows **1** |
| **Actual Result** | PASS |

---

### TC-COS-02 — cos(π) ≈ -1 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | cos(3.14159) ≈ -1 |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `3.14159`<br>2. Press `cos` |
| **Expected Result** | Display shows approximately **-1** |
| **Actual Result** | PASS |

---

### TC-COS-03 — cos with Empty Display → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | cos with no number shows "Error" |
| **Precondition** | Display empty |
| **Steps** | 1. Press `cos` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

### TC-TAN-01 — tan(0) = 0 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | tan(0) = 0 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`<br>2. Press `tan` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | PASS |

---

### TC-TAN-02 — tan(1 radian) ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | tan(1) ≈ 1.5574 (radians) |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `1`<br>2. Press `tan` |
| **Expected Result** | Display shows approximately **1.5574077246549023** |
| **Actual Result** | PASS |

---

### TC-TAN-03 — tan with Empty Display → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | tan with no number shows "Error" |
| **Precondition** | Display empty |
| **Steps** | 1. Press `tan` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

### TC-SQRT-01 — √9 = 3 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Square root of 9 equals 3 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `9`<br>2. Press `√` |
| **Expected Result** | Display shows **3** |
| **Actual Result** | PASS |

---

### TC-SQRT-02 — √4 = 2 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | √4 = 2 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `4`<br>2. Press `√` |
| **Expected Result** | Display shows **2** |
| **Actual Result** | PASS |

---

### TC-SQRT-03 — √2 ≈ 1.4142 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | √2 ≈ 1.4142135623730951 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `2`<br>2. Press `√` |
| **Expected Result** | Display shows approximately **1.4142135623730951** |
| **Actual Result** | PASS |

---

### TC-SQRT-04 — √0 = 0 ⚠️ EDGE

| Field | Detail |
|-------|--------|
| **Title** | √0 = 0 (boundary: zero input) |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`<br>2. Press `√` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | PASS |

---

### TC-SQRT-05 — √(−4) should show "Error" ⚠️ EDGE 🐛 BUG-006

| Field | Detail |
|-------|--------|
| **Title** | Square root of a negative number should display "Error" |
| **Precondition** | Display holds a negative value |
| **Steps** | 1. Set display to `-4` (via prior subtraction)<br>2. Press `√` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | ❌ Shows **NaN** |
| **Severity** | Medium |
| **Bug ID** | BUG-006 |

---

### TC-SQRT-06 — √ with Empty Display → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | √ with no number shows "Error" |
| **Precondition** | Display empty |
| **Steps** | 1. Press `√` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

### TC-LOG-01 — log(100) = 2 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | log base-10 of 100 equals 2 |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `100`<br>2. Press `log` |
| **Expected Result** | Display shows **2** |
| **Actual Result** | PASS |

---

### TC-LOG-02 — log(10) = 1 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | log(10) = 1 |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `10`<br>2. Press `log` |
| **Expected Result** | Display shows **1** |
| **Actual Result** | PASS |

---

### TC-LOG-03 — log(1) = 0 ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | log(1) = 0 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `1`<br>2. Press `log` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | PASS |

---

### TC-LOG-04 — log(0) → Error ⚠️ EDGE 🐛 BUG-007

| Field | Detail |
|-------|--------|
| **Title** | log(0) should display "Error" not "-Infinity" |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`<br>2. Press `log` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | ❌ Shows **-Infinity** |
| **Severity** | Medium |
| **Bug ID** | BUG-007 |

---

### TC-LOG-05 — log with Empty Display → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | log with no number shows "Error" |
| **Precondition** | Display empty |
| **Steps** | 1. Press `log` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

## 4. Parentheses & Grouping

---

### TC-PAR-01 — Simple Grouping ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | (2 + 3) = 5 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `(`, `2`, `+`, `3`, `)`, `=` |
| **Expected Result** | Display shows **5** |
| **Actual Result** | PASS |

---

### TC-PAR-02 — Group then Add ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | (4 + 6) + 2 = 12 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `(`, `4`, `+`, `6`, `)`, `+`, `2`, `=` |
| **Expected Result** | Display shows **12** |
| **Actual Result** | PASS |

---

### TC-PAR-03 — Post-Paren Multiply ⚠️ EDGE 🐛 BUG-005

| Field | Detail |
|-------|--------|
| **Title** | (2 + 3) × 4 = 20 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `(`, `2`, `+`, `3`, `)`, `×`, `4`, `=` |
| **Expected Result** | Display shows **20** |
| **Actual Result** | ❌ Shows **5** — parser skips `×` token after `)` (off-by-one XOR: `326947^326945=2`) |
| **Severity** | High |
| **Bug ID** | BUG-005 |

---

### TC-PAR-04 — Group × Group ⚠️ EDGE 🐛 BUG-005

| Field | Detail |
|-------|--------|
| **Title** | (1 + 1) × (2 + 2) = 8 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `(`, `1`, `+`, `1`, `)`, `×`, `(`, `2`, `+`, `2`, `)`, `=` |
| **Expected Result** | Display shows **8** |
| **Actual Result** | ❌ BUG-005 |

---

### TC-PAR-05 — Post-Paren Divide ⚠️ EDGE 🐛 BUG-005 + BUG-003

| Field | Detail |
|-------|--------|
| **Title** | (10 + 2) ÷ 4 = 3 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `(`, type `10`, `+`, `2`, `)`, `÷`, `4`, `=` |
| **Expected Result** | Display shows **3** |
| **Actual Result** | ❌ Affected by both BUG-005 (skips ÷ token) and BUG-003 (reversed division) |

---

### TC-PAR-06 — Mismatched Parens → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | Unclosed parenthesis should show "Error" |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `(`, `5`, `+`, `2` (no closing paren)<br>2. Press `=` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

### TC-PAR-07 — Closing Paren Without Opening → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | `)` without prior `(` should show "Error" |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `5`, `)`<br>2. Press `=` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

## 5. Edge Cases & Error Handling

---

### TC-EDG-01 — 5 ÷ 0 → Error/Infinity ⚠️ EDGE 🐛 BUG-008

| Field | Detail |
|-------|--------|
| **Title** | Dividing by zero should show "Error" or "Infinity" |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `5`, `÷`, `0`, `=` |
| **Expected Result** | Display shows **Error** or **Infinity** |
| **Actual Result** | ❌ Shows **0** — division reversal (BUG-003) causes 0÷5 = 0, masking the true undefined result |
| **Severity** | Medium |
| **Bug ID** | BUG-008 |

---

### TC-EDG-02 — 0 ÷ 5 Current Behaviour ⚠️ EDGE

| Field | Detail |
|-------|--------|
| **Title** | 0 ÷ 5 currently shows Infinity (due to reversed division) — documenting regression baseline |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`, `÷`, `5`, `=` |
| **Expected Result (correct)** | **0** |
| **Actual Result (current / buggy)** | **Infinity** (reversed: 5÷0) |

---

### TC-EDG-03 — Equals on Empty Display → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | Pressing "=" with no input shows "Error" |
| **Precondition** | Display empty |
| **Steps** | 1. Press `=` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

### TC-EDG-04 — Operator Alone → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | Pressing "+" then "=" with nothing else shows "Error" |
| **Precondition** | Display empty |
| **Steps** | 1. Press `+`, `=` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

### TC-EDG-05 — Clear After Result ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | "C" clears the display after a successful calculation |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `5`, `+`, `5`, `=` (display = **10**)<br>2. Press `C` |
| **Expected Result** | Display shows **""** (empty) |
| **Actual Result** | PASS |

---

### TC-EDG-06 — Clear After Error ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | "C" clears the display after an Error state |
| **Precondition** | Display shows "Error" (from TC-EDG-03) |
| **Steps** | 1. Press `=` (display = Error)<br>2. Press `C` |
| **Expected Result** | Display shows **""** |
| **Actual Result** | PASS |

---

### TC-EDG-07 — Floating-Point Arithmetic ⚠️ EDGE

| Field | Detail |
|-------|--------|
| **Title** | 0.1 + 0.2 ≈ 0.3 (within JS floating-point tolerance) |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`, `.`, `1`, `+`, `0`, `.`, `2`, `=` |
| **Expected Result** | Display shows a value within 1e-10 of **0.3** |
| **Actual Result** | PASS |

---

### TC-EDG-08 — Leading Decimal ⚠️ EDGE

| Field | Detail |
|-------|--------|
| **Title** | `.5 + .5 = 1` (leading decimal without leading zero) |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `.`, `5`, `+`, `.`, `5`, `=` |
| **Expected Result** | Display shows **1** |
| **Actual Result** | PASS |

---

### TC-EDG-09 — Large Number ⚠️ EDGE

| Field | Detail |
|-------|--------|
| **Title** | 9999999 + 1 = 10000000 |
| **Precondition** | Page loaded |
| **Steps** | 1. Type `9999999`, press `+`, press `1`, press `=` |
| **Expected Result** | Display shows **10000000** |
| **Actual Result** | PASS |

---

### TC-EDG-10 — Zero Multiplication ⚠️ EDGE

| Field | Detail |
|-------|--------|
| **Title** | 0 × 0 = 0 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`, `×`, `0`, `=` |
| **Expected Result** | Display shows **0** |
| **Actual Result** | PASS |

---

### TC-EDG-11 — sqrt(negative) → Error ⚠️ EDGE 🐛 BUG-006

| Field | Detail |
|-------|--------|
| **Title** | Square root of a negative value should show "Error" |
| **Precondition** | Display set to a negative value |
| **Steps** | 1. Inject `-4` into display<br>2. Press `√` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | ❌ Shows **NaN** |
| **Bug ID** | BUG-006 |

---

### TC-EDG-12 — log(0) → Error ⚠️ EDGE 🐛 BUG-007

| Field | Detail |
|-------|--------|
| **Title** | log(0) should show "Error" not "-Infinity" |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `0`<br>2. Press `log` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | ❌ Shows **-Infinity** |
| **Bug ID** | BUG-007 |

---

### TC-EDG-13 — log(negative) → Error ⚠️ EDGE 🐛 BUG-007

| Field | Detail |
|-------|--------|
| **Title** | log of a negative number should show "Error" not "NaN" |
| **Precondition** | Display holds a negative value |
| **Steps** | 1. Inject `-1` into display<br>2. Press `log` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | ❌ Shows **NaN** |
| **Bug ID** | BUG-007 |

---

### TC-EDG-14 — Chained Result ✅ POS

| Field | Detail |
|-------|--------|
| **Title** | Result of one calculation is used in the next: (2+3) then +5 = 10 |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `2`, `+`, `3`, `=` (display = 5)<br>2. Press `+`, `5`, `=` |
| **Expected Result** | Display shows **10** |
| **Actual Result** | PASS |

---

### TC-EDG-15 — Expression Ending with Operator → Error ❌ NEG

| Field | Detail |
|-------|--------|
| **Title** | Pressing "=" on incomplete expression (trailing operator) shows "Error" |
| **Precondition** | Page loaded |
| **Steps** | 1. Press `5`, `+`, `=` |
| **Expected Result** | Display shows **Error** |
| **Actual Result** | PASS |

---

## Summary

| Category | Total | PASS | FAIL (Bugs) |
|----------|-------|------|-------------|
| UI       | 8     | 6    | 2 (BUG-001, BUG-002) |
| Addition | 4     | 4    | 0 |
| Subtraction | 3  | 0    | 3 (BUG-002) |
| Multiplication | 3 | 3  | 0 |
| Division | 3     | 0    | 3 (BUG-003) |
| Key binding | 2  | 0    | 2 (BUG-001) |
| Chained ops | 2  | 2    | 0 |
| sin      | 4     | 1    | 3 (BUG-004) |
| cos      | 3     | 3    | 0 |
| tan      | 3     | 3    | 0 |
| sqrt     | 6     | 4    | 2 (BUG-006) |
| log      | 5     | 3    | 2 (BUG-007) |
| Parentheses | 7  | 2    | 5 (BUG-005, BUG-003) |
| Edge/Error  | 15 | 10   | 5 (BUG-006, BUG-007, BUG-008) |
| **Total**   | **68** | **41** | **27** |
