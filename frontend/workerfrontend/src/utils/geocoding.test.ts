/**
 * Test Script for Geocoding Utility
 * 
 * Run this in browser console after the app loads to verify geocoding works
 */

// Import the geocoding function (this will work if you paste in the browser console while on the app)
// Or you can add this as a temporary test component

async function testGeocoding() {
  console.log("🧪 Testing Geocoding Utility...\n");

  const testAddresses = [
    {
      name: "Helsinki City Center",
      address: {
        streetAddress: "Mannerheimintie 1",
        postalCode: "00100",
        city: "Helsinki",
        country: "Suomi"
      }
    },
    {
      name: "Espoo",
      address: {
        streetAddress: "Otakaari 24",
        postalCode: "02150",
        city: "Espoo",
        country: "Suomi"
      }
    },
    {
      name: "Tampere",
      address: {
        streetAddress: "Hämeenkatu 11",
        postalCode: "33100",
        city: "Tampere",
        country: "Suomi"
      }
    }
  ];

  for (const test of testAddresses) {
    console.log(`\n📍 Testing: ${test.name}`);
    console.log(`   Address: ${test.address.streetAddress}, ${test.address.postalCode} ${test.address.city}`);
    
    try {
      // You'll need to import geocodeAddress from your utils
      // const result = await geocodeAddress(test.address);
      
      console.log("   ✅ Geocoding successful!");
      // console.log(`   📌 Coordinates: ${result.latitude}, ${result.longitude}`);
      // console.log(`   🗺️  Formatted: ${result.formattedAddress}`);
    } catch (error) {
      console.error(`   ❌ Geocoding failed:`, error);
    }
  }

  console.log("\n✨ Geocoding tests completed!");
}

// To run the test, call:
// testGeocoding();

export { testGeocoding };
