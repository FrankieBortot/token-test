import StyleDictionary from 'style-dictionary';

// ─── Costanti ─────────────────────────────────────────────────────────────────
const BRANDS = ['sisal', 'snai', 'pokerstars', 'sisalcasino'];
const MODES  = ['light', 'dark'];
const OS     = ['ios', 'android'];

// ─── Helper: config per una singola combinazione brand × mode ─────────────────
function getConfig(brand, mode) {
  return {
    usesDtcg: true,
    log: { verbosity: 'verbose' },

    source: [
      'tokens/primitives-value.json',
      `tokens/brands-${brand}.json`,
      `tokens/mode-${mode}.json`,
      'tokens/component-value.json',
    ],

    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'dt',
        buildPath: 'dist/css/',
        files: [
          {
            destination: `${brand}.${mode}.css`,
            format: 'css/variables',
            options: {
              selector: `:root[data-brand="${brand}"][data-theme="${mode}"]`,
              outputReferences: true,
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
    usesDtcg: true,
    log: { verbosity: 'verbose' },

    source: [
      'tokens/primitives-value.json',
      `tokens/brands-${brand}.json`,
      `tokens/mode-${mode}.json`,
      'tokens/component-value.json',
      `tokens/operative-system-${os}.json`,
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

  for (const brand of BRANDS) {
    for (const mode of MODES) {
      console.log(`  building ${brand}.${mode}.css …`);
      const sd = new StyleDictionary(getConfig(brand, mode));
      await sd.buildAllPlatforms();
    }
  }

  // brand × mode × os — decommenta se vuoi generare anche questi file
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
