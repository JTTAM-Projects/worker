import { expect } from "@playwright/test";
import { test } from "./fixtures/test";

test.describe("Public landing experience", () => {
  test.beforeEach(async ({ page }) => {
    // Ländäri avataan ennen jokaista testiä
    await page.goto("/");
  });

  test("landing page highlights CTA blocks and navigation", async ({ page }) => {
    await test.step("Hero näyttää ensisijaiset CTA-linkit", async () => {
      // Hero-otsikko kertoo tärkeimmän viestin
      await expect(
        page.getByRole("heading", { level: 1, name: /Saa enemmän aikaan WorkerAppilla!/i })
      ).toBeVisible();
      // Hero tarjoaa työnantajan ja työntekijän CTA-linkit
      await expect(page.getByRole("link", { name: "Luo tehtävä" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Selaa tehtäviä" })).toBeVisible();
    });

    await test.step("Promo-kortit näkyvät molemmille kohderyhmille", async () => {
      // Molemmille kohderyhmille on oma korttiotsikko
      await expect(page.getByRole("heading", { name: "Työnantajalle" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Työntekijälle" })).toBeVisible();
    });

    await test.step("Työntekijän navigaatio tarjoaa syvät linkit", async () => {
      // Yläpalkissa on logo ja tärkeät navigointilinkit
      await expect(page.getByRole("link", { name: "LOGO" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Työilmoitukset" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Omat tehtävät" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Hakemukset" })).toBeVisible();
    });

    await test.step("Footerissa näkyvät lakisivujen linkit", async () => {
      // Footerin tulee sisältää perusyritystiedot ja lakilinkit
      await expect(page.getByText("Tietoa meistä")).toBeVisible();
      await expect(page.getByText("Yhteystiedot")).toBeVisible();
      await expect(page.getByText("Tietosuojakäytäntö")).toBeVisible();
    });
  });
});
