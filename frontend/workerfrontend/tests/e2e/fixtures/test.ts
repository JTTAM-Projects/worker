import { expect, test as base } from "@playwright/test";

// Laajennetaan Playwrightin oletusfixture palauttamaan mock-tilaan ja stubbaamaan kartat
export const test = base.extend({
  page: async ({ page }, runWithPage) => {
    // Merkitään init-skriptissä mock API resetoitavaksi ennen jokaista testiä
    await page.addInitScript(() => {
      (window as unknown as { __PLAYWRIGHT_RESET_MOCK_API__?: boolean }).__PLAYWRIGHT_RESET_MOCK_API__ = true;
    });
    // Korvataan Google Maps -pyynnöt stubilla, jotta testit eivät tee ulkoverkkoa
    await page.route("https://maps.googleapis.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `
          window.google = window.google || {};
          window.google.maps = window.google.maps || {
            Map: function(){},
            Marker: function(){},
            MarkerClusterer: function(){},
            Circle: function(){},
            InfoWindow: function(){},
            LatLngBounds: function(){ this.extend = function(){}; },
            event: { addListenerOnce: function(_, __, cb){ cb && cb(); } }
          };
        `,
      })
    );

    await runWithPage(page);
  },
});

export { expect };
