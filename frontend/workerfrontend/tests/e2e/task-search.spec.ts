import { expect } from "@playwright/test";
import { test } from "./fixtures/test";

test.describe("Task search and filtering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/worker/tasks");
    await expect(page.getByRole("heading", { name: "Selaa tehtäviä" })).toBeVisible();
  });

  test("applies text, category and price filters and reflects them in URL", async ({ page }) => {
    // Käytetään tekstihakuja, kategorioita ja hintarajaa
    await page.getByPlaceholder("Etsi otsikosta tai kuvauksesta...").fill("siivous");
    await page.locator("label", { hasText: "Cleaning" }).click();
    await page.locator('input[type="number"]').first().fill("50");
    await page.locator('input[type="number"]').nth(1).fill("120");

    // Suoritetaan haku ja varmistetaan että URL ja chipit päivittyvät
    await page.getByRole("button", { name: "Hae tehtäviä" }).click();
    await expect(page).toHaveURL(/searchText=siivous/);
    await expect(page.getByRole("button", { name: /€50 - €120/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Cleaning/ })).toBeVisible();
  });

  test("removes active filter chips and resets pagination", async ({ page }) => {
    // Suoritetaan haku, jotta chip syntyy
    await page.getByPlaceholder("Etsi otsikosta tai kuvauksesta...").fill("puu");
    await page.getByRole("button", { name: "Hae tehtäviä" }).click();
    // Poistetaan chip ja varmistetaan että parametri poistuu
    await page.getByRole("button", { name: /Haku:/ }).click();
    await expect(page.getByRole("button", { name: /Haku:/ })).toHaveCount(0);
    expect(page.url()).not.toContain("searchText=");
  });

  test("changes sort order and toggles between list and map view", async ({ page }) => {
    // Vaihdetaan järjestystä ja tarkistetaan URL
    await page.selectOption("#sort-select", "priceDesc");
    await expect(page).toHaveURL(/sortBy=priceDesc/);
    // Vaihdetaan karttanäkymään ja tarkistetaan latausviesti
    await page.getByRole("button", { name: "Kartta" }).click();
    await expect(page).toHaveURL(/view=map/);
    await expect(page.getByText("Ladataan karttaa...")).toBeVisible();
  });

  test("paginates list view results", async ({ page }) => {
    // Käynnistetään haku, jotta sivutus näkyy
    await page.getByRole("button", { name: "Hae tehtäviä" }).click();
    // Siirrytään seuraavalle sivulle ja varmistetaan että Edellinen aktivoituu
    await page.getByRole("button", { name: "Seuraava" }).click();
    await expect(page.getByRole("button", { name: "Edellinen" })).toBeEnabled();
  });
});
