import { test, expect, Page } from '@playwright/test';

async function testView(page: Page, viewCalendar: string) {
  await page.goto(`http://localhost:5000/?viewDate=2024-04-17&viewCalendar=${viewCalendar}`);
  await page.waitForSelector('div.App', { state: 'visible' });

  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${viewCalendar}View.png`);

  // Darkmode
  await page.click('#Toggle19');
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${viewCalendar}ViewDarkmode.png`);
}

['day', 'week', 'month'].forEach(view => {
  test(`${view}View visual regression`, async ({ page }) => {
    // Needed so Zimbra won't go down.
    await page.waitForTimeout(5000);
    await testView(page, view);
  });
});