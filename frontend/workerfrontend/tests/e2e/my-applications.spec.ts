import { expect } from "@playwright/test";
import { test } from "./fixtures/test";

test.describe("Worker my applications area", () => {
  test("filters active applications and navigates to task details", async ({ page }) => {
    // Avataan aktiiviset hakemukset ja varmistetaan suodattimet
    await page.goto("/worker/my-applications/active");
    await expect(page.getByRole("heading", { name: "Suodattimet" })).toBeVisible();

    // Syötetään hakusana ja käynnistetään haku
    await page.getByPlaceholder("Etsi otsikosta tai kuvauksesta...").fill("siivous");
    await page.getByRole("button", { name: "Hae tehtäviä" }).click();

    // Avataan ensimmäinen kortti ja tarkistetaan tehtävän tiedot
    const applicationCard = page.getByRole("heading", { name: /Asunnon siivous/ }).first();
    await applicationCard.click();
    await expect(page).toHaveURL(/worker\/my-applications\/\d+\/task-details/);
    await expect(page.getByRole("heading", { level: 1, name: "Asunnon siivous" })).toBeVisible();
  });

  test("switches between task details and application editor tabs", async ({ page }) => {
    // Aloitetaan tehtävän tiedoista
    await page.goto("/worker/my-applications/1/task-details");
    // Vaihdetaan hakemuksen tietoihin ja varmistetaan lomake
    await page.getByRole("button", { name: /^Hakemuksen tiedot/ }).click();
    await expect(page).toHaveURL(/application-details/);
    await expect(page.getByLabel("Hintatarjous (€) *")).toBeVisible();
    // Palataan tehtävän tietoihin ja tarkistetaan kuvaus
    await page.getByRole("button", { name: "Tehtävän tiedot" }).click();
    await expect(page.getByText("Perusteellinen")).toBeVisible();
  });

  test("shows accepted applications in past tab", async ({ page }) => {
    // Siirrytään menneisiin hakemuksiin ja varmistetaan tila
    await page.goto("/worker/my-applications/past");
    await expect(page.getByRole("button", { name: "Menneet" })).toHaveAttribute("class", /text-green-600/);
    await expect(page.getByText("Hyväksytty")).toBeVisible();
    // Palataan aktiivisiin ja varmistetaan URL
    await page.getByRole("button", { name: "Aktiiviset" }).click();
    await expect(page).toHaveURL(/active/);
  });
});
