import { test as base, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

type CalcFixtures = {
  calc: CalculatorPage;
};

export const test = base.extend<CalcFixtures>({
  calc: async ({ page }, use) => {
    const calc = new CalculatorPage(page);
    await calc.goto();
    await use(calc);
  },
});

export { expect };
