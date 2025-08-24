import { test, expect, Page } from '@playwright/test';

let inputBox, inputContent, page: Page

test.describe.configure({ mode: "serial" })

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
})

test.beforeEach(async ({ page }) => {
  inputContent = ""

  await page.goto('/');
  await page.getByText("Search").click();

  inputBox = page.locator("#docsearch-input")
});

test.afterAll(async () => {
  await page.close()
})

test('Realizar una busqueda que no tenga resultados', async ({ page }) => {
  inputContent = "hasnocontent"

  await page.type("#docsearch-input", inputContent)

  // await page.getByPlaceholder('Search docs').click();
  // await page.getByPlaceholder('Search docs').fill('hascontent');

  const messageParagraph = page.locator('p.DocSearch-Title > strong')

  await expect(messageParagraph).toBeVisible();
  await expect(messageParagraph).toHaveText(inputContent);

})

test('Limpiar el input de busqueda', async ({ page }) => {
  inputContent = "somerandomtext"
  inputBox = page.locator("#docsearch-input")

  await inputBox.type(inputContent)

  await expect(inputBox).toHaveAttribute('value', inputContent);

  await page.click("button[title='Clear the query']");

  await expect(inputBox).toHaveAttribute('value', '');
});

test('Realizar una busqueda que genere al menos tenga un resultado', async ({ page }) => {
  inputContent = "havetext"
  await inputBox.type(inputContent);

  await expect(inputBox).toHaveAttribute('value', inputContent);

  // Verity there are sections in the results
  const containerSelector = ".DocSearch-Dropdown-Container section"
  await page.locator(containerSelector).nth(1).waitFor();
  const numberOfResults = await page.locator(containerSelector).count();
  await expect(numberOfResults).toBeGreaterThan(0);

});