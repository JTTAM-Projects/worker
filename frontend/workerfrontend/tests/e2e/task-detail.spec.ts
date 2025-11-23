import { expect } from "@playwright/test";
import { test } from "./fixtures/test";

test.describe("Task detail and application workflow", () => {
  test("renders task information and handles back navigation", async ({ page }) => {
    // Avataan työntekijän tehtävä mock-datasta
    await page.goto("/worker/tasks/1");
    await expect(page.getByRole("heading", { level: 1, name: "Asunnon siivous" })).toBeVisible();
    await expect(page.getByText("Kaksion perusteellinen viikkosiivous keskustassa.")).toBeVisible();
    // Palataan listaukseen reitin varmistamiseksi
    await page.getByRole("link", { name: /Takaisin työilmoituksiin/ }).click();
    await expect(page).toHaveURL(/worker\/tasks/);
  });

  test("user can create new application when none exists", async ({ page }) => {
    // Avataan tehtävä ilman hakemusta ja avataan lomake
    await page.goto("/worker/tasks/3");
    await page.getByRole("button", { name: "Hae työhön" }).click();
    // Täytetään hinta, aikaehdotus ja kuvaus
    await page.getByLabel("Hintatarjous (€) *").fill("210");
    await page.getByLabel("Aikaehdotus *").fill("2025-03-20T09:00");
    await page.getByLabel("Lisätiedot").fill("Olen muuttomies.");
    // Lähetetään ja odotetaan onnistumisilmoitusta
    await page.getByRole("button", { name: /Lähetä hakemus/ }).click();
    await expect(page.getByText("Hakemus lähetettiin onnistuneesti!")).toBeVisible();
  });

  test("user can edit and delete existing application", async ({ page }) => {
    // Siirrytään tehtävään, jolla on hakemus
    await page.goto("/worker/tasks/1");
    await page.getByRole("button", { name: "Muokkaa hakemusta" }).click();
    // Päivitetään tiedot ja tallennetaan
    await page.getByLabel("Lisätiedot").fill("Päivitetty kuvaus");
    await page.getByRole("button", { name: "Tallenna muutokset" }).click();
    await expect(page.getByText("Hakemus päivitettiin onnistuneesti!")).toBeVisible();

    // Hyväksytään dialogi ja perutaan hakemus
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: /Peru hakemus/ }).click();
    await expect(page.getByText("Hakemus peruttiin onnistuneesti.").first()).toBeVisible();
  });
});
