import { type Page, type Locator } from '@playwright/test';

export class CalculatorPage {
  readonly page: Page;
  readonly display: Locator;

  constructor(page: Page) {
    this.page = page;
    this.display = page.locator('#display');
  }

  async goto(): Promise<void> {
    await this.page.goto('/calculator/index.html');
  }

  async getDisplay(): Promise<string> {
    return this.display.inputValue();
  }

  async clickButton(label: string): Promise<void> {
    await this.page.getByRole('button', { name: label, exact: true }).click();
  }

  async pressDigit(digit: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'): Promise<void> {
    await this.clickButton(digit);
  }

  async pressDecimal(): Promise<void> {
    await this.clickButton('.');
  }

  async pressAdd(): Promise<void> {
    await this.clickButton('+');
  }

  async pressSubtract(): Promise<void> {
    await this.clickButton('−');
  }

  async pressMultiply(): Promise<void> {
    await this.clickButton('×');
  }

  async pressDivide(): Promise<void> {
    await this.clickButton('÷');
  }

  async pressOpenParen(): Promise<void> {
    await this.clickButton('(');
  }

  async pressCloseParen(): Promise<void> {
    await this.clickButton(')');
  }

  async pressEquals(): Promise<void> {
    await this.clickButton('=');
  }

  async pressClear(): Promise<void> {
    await this.clickButton('C');
  }

  async pressSin(): Promise<void> {
    await this.clickButton('sin');
  }

  async pressCos(): Promise<void> {
    await this.clickButton('cos');
  }

  async pressTan(): Promise<void> {
    await this.clickButton('tan');
  }

  async pressSqrt(): Promise<void> {
    await this.clickButton('√');
  }

  async pressLog(): Promise<void> {
    await this.clickButton('log');
  }

  async typeNumber(value: string): Promise<void> {
    for (const ch of value) {
      if (ch === '.') {
        await this.pressDecimal();
      } else {
        await this.pressDigit(ch as Parameters<CalculatorPage['pressDigit']>[0]);
      }
    }
  }

  async clearAndVerify(): Promise<void> {
    await this.pressClear();
  }

  async getButtonBindings(): Promise<Array<{ label: string; onclick: string | null }>> {
    return this.page.evaluate(() =>
      Array.from(document.querySelectorAll('button')).map((b) => ({
        label: b.textContent?.trim() ?? '',
        onclick: b.getAttribute('onclick'),
      }))
    );
  }
}
