import { expect } from "@playwright/test";
import { test } from "./fixtures/test";

test.describe("Employer task management flow", () => {
  test("lists employer tasks and opens detail/application views", async ({ page }) => {
    // Siirrytään työnantajan ilmoituslistaukseen
    await page.goto("/employer/my-tasks");
    // Varmistetaan että otsikko ja CTA näkyvät
    await expect(page.getByRole("heading", { name: "Omat työilmoitukset" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Uusi ilmoitus" })).toBeVisible();

    // Avataan ensimmäinen ilmoitus ja vaihdetaan hakemuksiin
    await page.getByRole("button", { name: "Näytä" }).first().click();
    await expect(page).toHaveURL(/employer\/my-tasks\/\d+\/details/);
    await expect(page.getByRole("heading", { level: 1, name: /Asunnon siivous/ })).toBeVisible();
    await page.getByRole("button", { name: "Hakemukset" }).click();
    await expect(page).toHaveURL(/applications/);
    await expect(page.getByRole("heading", { name: "Hakemukset" })).toBeVisible();
  });

  test("creates a new task through the wizard", async ({ page }) => {
    // Avataan julkinen ilmoituksenluonti
    await page.goto("/employer/create-task/public-task");
    await expect(page.getByRole("heading", { name: "Luo uusi työilmoitus" })).toBeVisible();

    // Täytetään vaihe 1: perustiedot, kategoria, aikataulu, sijainti
    await page.getByLabel("Otsikko").fill("Testitehtävä");
    await page.getByLabel("Kuvaus").fill("Pitkä kuvaus tehtävästä.");
    await page.getByLabel("Kategoria").selectOption("Cleaning");
    await page.getByLabel("Hinta (€)").fill("99");
    await page.getByLabel("Alkamisaika").fill("2025-03-25T09:00");
    await page.getByLabel("Päättymisaika").fill("2025-03-25T12:00");
    await page.getByLabel("Katuosoite").fill("Testikatu 1");
    await page.getByLabel("Postinumero").fill("00100");
    await page.getByLabel("Kaupunki").fill("Helsinki");
    await page.getByLabel("Maa").fill("Suomi");
    await page.getByRole("button", { name: "Jatka" }).click();

    // Täytetään vaihe 2: yhteystiedot
    await page.getByLabel("Etunimi").fill("Maija");
    await page.getByLabel("Sukunimi").fill("Meikäläinen");
    await page.getByLabel("Puhelinnumero").fill("0401234567");
    await page.getByLabel("Sähköposti").fill("maija@example.com");
    await page.getByRole("button", { name: "Jatka" }).click();

    // Tarkistetaan viimeistely ja lähetetään
    await expect(page.getByRole("heading", { level: 2, name: "Viimeistely" })).toBeVisible();
    await page.getByRole("button", { name: "Luo ilmoitus" }).click();
    await expect(
      page.getByText("Ilmoitus luotiin onnistuneesti! Uudelleenohjataan omiin työilmoituksiin...")
    ).toBeVisible();
  });
});
