import StyleDictionary from 'style-dictionary';

// ─── Costanti ─────────────────────────────────────────────────────────────────
const BRANDS = ['sisal', 'snai', 'pokerstars', 'sisal-casino'];
const MODES  = ['light', 'dark'];
const OS     = ['ios', 'android'];

// ─── Helper: config per una singola combinazione brand × mode ─────────────────
function getConfig(brand, mode) {
  return {
    source: [
      // 1. Primitives – valori raw, nessun riferimento esterno
      'tokens/primitives/value.json',

      // 2. Brand – mappa le primitive sui ruoli semantici (neutral, accent, ecc.)
      //    Carica SOLO il brand corrente per evitare conflitti
      `tokens/brands/${brand}.json`,

      // 3. Theme / Mode – definisce l'uso (bg, text, border…)
      //    mappato sui token del brand
      `tokens/theme/${mode}.json`,

      // 4. Component – token specifici per componente
      //    referenzia i token del theme
      'tokens/component/value.json',
    ],

    platforms: {
      css: {
        transformGroup: 'css',   // transform group built-in di Style Dictionary
        prefix: 'dt',            // tutte le var avranno prefisso --dt-
        buildPath: 'dist/css/',
        files: [
          {
            destination: `${brand}.${mode}.css`,
            format: 'css/variables',
            options: {
              selector: `:root[data-brand="${brand}"][data-theme="${mode}"]`,
              outputReferences: true,  // mantiene i var() invece di risolvere i valori
            },
          },
        ],
      },
    },
  };
}

// ─── Helper: config per una singola combinazione brand × mode × os ────────────
function getConfigWithOS(brand, mode, os) {
  return {
    source: [
      'tokens/primitives/value.json',
      `tokens/brands/${brand}.json`,
      `tokens/theme/${mode}.json`,
      'tokens/component/value.json',
      `tokens/os/${os}.json`,
    ],

    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'dt',
        buildPath: 'dist/css/',
        files: [
          {
            destination: `${brand}.${mode}.${os}.css`,
            format: 'css/variables',
            options: {
              selector: `:root[data-brand="${brand}"][data-theme="${mode}"][data-os="${os}"]`,
              outputReferences: true,
            },
          },
        ],
      },
    },
  };
}

// ─── Build ────────────────────────────────────────────────────────────────────
async function run() {
  console.log('🚀 Style Dictionary build start\n');

  // brand × mode  →  sisal.light.css, sisal.dark.css, snai.light.css, …
  for (const brand of BRANDS) {
    for (const mode of MODES) {
      console.log(`  building ${brand}.${mode}.css …`);
      const sd = new StyleDictionary(getConfig(brand, mode));
      await sd.buildAllPlatforms();
    }
  }

  // brand × mode × os  →  sisal.light.ios.css, sisal.dark.android.css, …
  // Decommenta il blocco sotto se vuoi generare anche questi file
  /*
  for (const brand of BRANDS) {
    for (const mode of MODES) {
      for (const os of OS) {
        console.log(`  building ${brand}.${mode}.${os}.css …`);
        const sd = new StyleDictionary(getConfigWithOS(brand, mode, os));
        await sd.buildAllPlatforms();
      }
    }
  }
  */

  console.log('\n✅ Build completata → dist/css/');
}

run().catch(console.error);
