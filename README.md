# Worker - Mobiilisovellus

## 📱 Yleiskuvaus

Worker app:n mobiiliversio, joka on ajettavissa Android emulaattorilla, jonka asennusohjeet löytyvät tästä tiedostosta. **Projektia ei voi ajaa Expo Go -sovelluksella**, koska käytän projektin autentikoinnin toteutuksena Auth0 palveluntarjoajaa, joka mainitsee [dokumentaatiossaan](https://auth0.com/docs/quickstart/native/react-native-expo/interactive) että Expo Go **ei ole yhteensopiva**. Helpoiten pääsee kun asentaa ohjeiden mukaan Android emulaattorin. Proktin tavoitteena on rakentaa worker -käyttäjälle käyttöliittymä, jonka avulla käyttäjä pystyy kirjautumaan, listata olemassa olevia työilmoituksia, hakemaan niihin, sekä tarkastella omia työhakemuksia. Projektin api-funktiot ja tyypit löydät [freatures](../worker/packages/shared/features/)-kansiosta, joita sekä web- että mobiilisovellus käyttää. Projektissa pakettien jakamiseen käytetään mpm Workspaces.

## 🚀 Aloitus

### Esivaatimukset

Ennen asennusta varmista, että sinulla on asennettuna:

- Node.js (versio 16.x tai uudempi)
- npm tai yarn
- [Android Studio](https://developer.android.com/studio) (Android-kehitykseen)

Ohjeet

### Asennus & frontend -setup

1. Kloonaa repositorio:

```bash
git clone https://github.com/JTTAM-Projects/worker.git
cd ohjelmistoprojekti2/worker
```

2. Asenna riippuvuudet:

Asentaa riippuvuudet sekä mobiili että web käyttöliittymälle.

Aja projektin juurihakemistossa:

```bash
npm install
# tai
yarn install
```

3. Luo .env-tiedosto ja määrittele Auth0-asetukset:

```bash
cd apps/mobiili
```

Luo `.env` tiedosto `apps/mobiili` -hakemistoon seuraavalla sisällöllä:

```env
AUTH0_DOMAIN=your-domain.eu.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
```

Korvaa arvot omilla Auth0-tunnuksillasi, jotka löydät [Auth0 Dashboard](https://manage.auth0.com/) -sivulta, kohdasta applications -> mobiili -> setting

### Kehitysympäristö

#### Android

Ohjeet Android emulaattorin asennukseen sekä konfigurointiin [täältä](https://docs.expo.dev/workflow/android-studio-emulator/). Muista valita oikeat ohjeet tab -valikoista, esimerkiksi Windows.

```bash

# Käynnistä Android-emulaattorissa tai laitteessa
npx expo run:android
```
### Backend Setup

1. **Navigoi glig -hakemistoon:**
   ```bash
   cd apps/backend/glig
   ```

2. **Määrittele application.properties:**
   - Kehitysvaiheessa käytetään H2-tietokantaa (konfiguroitu `application-dev.yml`)
   - Päivitä Auth0 tunnukset ja domainit tänne `application.yml`:
     ```yaml
     okta:
       oauth2:
         issuer: https://your-auth0-domain.auth0.com/
         audience: https://your-api-audience
     ```

3. **Aja sovellus:**
   ```bash
   ./mvnw spring-boot:run
   ```

## 🔧 Konfiguraatio

### Ympäristömuuttujat

Luo `.env` tiedosto `apps/mobiili` -hakemistoon:

```env
AUTH0_DOMAIN=your-domain.eu.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
```

**Huom:** Älä koskaan committaa `.env` tiedostoa versionhallintaan!

## 🛠️ Kehitystyökalut

- **Debugging:** React Native Debugger
- **Linting:** ESLint - `npm run lint`
- **Formatting:** Prettier - `npm run format`

## 📱 Tuki ja yhteensopivuus

- **Android:** 6.0 (API level 23) tai uudempi

huom. tämä ohje ei sisällä ios asennuksia
