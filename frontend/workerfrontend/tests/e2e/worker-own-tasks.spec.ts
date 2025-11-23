import { expect } from "@playwright/test";
import { test } from "./fixtures/test";

test.describe("Worker own tasks execution", () => {
  test("lists accepted tasks and opens execution wizard", async ({ page }) => {
    // Työntekijän "toteutettavat" sisältää hyväksytyt työt
    await page.goto("/worker/own-tasks/to-do");
    await expect(page.getByRole("heading", { name: "Toteutettavat työt" })).toBeVisible();
    const startButton = page.getByRole("button", { name: "Aloita toteutus" }).first();
    await startButton.click();
    await expect(page).toHaveURL(/worker\/own-tasks\/to-do\/\d+/);

    await page.getByRole("button", { name: "Aloita työ" }).click();
    await expect(page.getByRole("heading", { name: "Työ käynnissä" })).toBeVisible();
    // Käydään läpi lopetus ja tarkistetaan ilmoitus
    await page.getByRole("button", { name: "Lopeta työ" }).click();
    await page.getByRole("button", { name: "Lopeta työ" }).click();
    await expect(page.getByText("Työ merkitty valmiiksi")).toBeVisible();
    // Palataan listaan ja varmistetaan reitti
    await page.getByRole("button", { name: "Palaa listoihin" }).click();
    await expect(page).toHaveURL(/worker\/own-tasks\/to-do$/);
  });
});
