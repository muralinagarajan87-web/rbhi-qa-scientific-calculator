#  Scientific Calculator — QA Playwright Framework

Automated E2E test suite for the [Scientific Calculator](https://rbihubcodechallenge.github.io/calculator/index.html) 

## Tech Stack

- [Playwright](https://playwright.dev/) v1.44 — test runner & browser automation
- TypeScript
- Page Object Model (POM)
- Data-driven tests via typed data arrays
- GitHub Actions CI (Chromium / Firefox / WebKit)

## Project Structure

```
calculator-tests/
├── data/
│   └── calculatorData.ts        # All test data — add cases here, not in specs
├── fixtures/
│   └── index.ts                 # calc fixture — auto-navigates before each test
├── pages/
│   └── CalculatorPage.ts        # POM — all UI interactions in one place
├── tests/
│   ├── basic-arithmetic.spec.ts
│   ├── scientific-functions.spec.ts
│   ├── parentheses.spec.ts
│   ├── edge-cases.spec.ts
│   └── ui.spec.ts
├── .github/
│   └── workflows/ci.yml         # GitHub Actions matrix (3 browsers)
├── playwright.config.ts
├── BUG_REPORT.md                # 12 bugs with root causes and fix guidance
└── TEST_CASES.md                # 68 manual test cases (Positive / Negative / Edge)
```

## Installation

```bash
npm install
npx playwright install --with-deps
```

## Running Tests

| Command | What it does |
|---|---|
| `npm test` | All tests, headless, all three browsers |
| `npm run test:headed` | All tests, visible browser window |
| `npx playwright test --project=chromium` | Chromium only |
| `npx playwright test --grep @smoke` | Smoke / sanity suite (~12 tests, critical path) |
| `npx playwright test --grep @regression` | Full regression suite (all tests) |
| `npx playwright test --grep @bug` | Known-bug confirmations only |
| `npm run test:report` | Open the last HTML report |

### Tag reference

| Tag | Purpose |
|---|---|
| `@smoke` | Sanity / smoke — run before every deploy |
| `@regression` | Full regression — run on every PR |
| `@bug` | Known defect — test is marked `test.fail()`, CI stays green |

## Test Results Summary

91 tests across 5 spec files. All pass in CI (known bugs use `test.fail()` so they count as expected failures, not broken builds).

| Spec | Tests | Passing | Expected failures (bugs) |
|---|---|---|---|
| basic-arithmetic | 17 | 11 | 6 |
| scientific-functions | 16 | 10 | 6 |
| parentheses | 7 | 1 | 6 |
| edge-cases | 22 | 14 | 8 |
| ui | 29 | 27 | 2 |
| **Total** | **91** | **63** | **28** |

## Bugs Found

12 defects discovered by decoding the obfuscated calculator JavaScript:

| ID | Severity | Summary |
|---|---|---|
| BUG-001 | Critical | "3" button appends "0" instead of "3" |
| BUG-002 | Critical | "−" button appends "/" instead of "-" |
| BUG-003 | Critical | Division is reversed: `a÷b` evaluates as `b÷a` |
| BUG-004 | Critical | `sin()` hardcoded to return 1 (XOR artefact) |
| BUG-005 | High | Parser skips token after `)`, breaking post-paren operations |
| BUG-006 | Medium | `√(negative)` shows "NaN" instead of "Error" |
| BUG-007 | Medium | `log(0)` and `log(negative)` show "-Infinity"/"NaN" instead of "Error" |
| BUG-008 | Medium | `5÷0` never reaches Infinity due to BUG-003 reversal |
| BUG-009 | Medium | Pressing `=` on empty display shows "undefined" instead of "Error" |
| BUG-010 | Medium | Operator-only expression (e.g. `+`) shows "NaN" instead of "Error" |
| BUG-011 | Low | Unclosed parenthesis silently evaluates instead of showing "Error" |
| BUG-012 | Low | Stray `)` is ignored instead of showing "Error" |

Full details (steps to reproduce, root cause, fix) in [BUG_REPORT.md](BUG_REPORT.md).

## Release Recommendation

**Do not release** in current state. BUG-001 through BUG-004 are Critical — basic arithmetic and the most-used digit are broken. Fix all Critical and High severity bugs and re-run the regression suite before shipping.

## CI

GitHub Actions runs the full suite on push and pull request to `main`/`master` across Chromium, Firefox, and WebKit. HTML and JUnit reports are uploaded as artifacts (14-day retention).
