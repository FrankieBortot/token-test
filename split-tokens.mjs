/**
 * split-tokens.mjs
 *
 * Legge design_tokens.json (formato multi-dimensionale con $extensions.mode)
 * e genera i file separati che Style Dictionary si aspetta.
 */

import fs from 'fs';
import path from 'path';

const SOURCE = 'design_tokens.json';
const OUT    = 'tokens';

fs.mkdirSync(OUT, { recursive: true });

const raw = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));

// ─── Utility ──────────────────────────────────────────────────────────────────

// Rimuove .$value dai riferimenti: {brand.neutral.white.$value} → {brand.neutral.white}
function cleanRef(value) {
  if (typeof value === 'string') {
    return value.replace(/\.\$value}/g, '}');
  }
  return value;
}

function extractMode(obj, modeName) {
  if (typeof obj !== 'object' || obj === null) return obj;

  // Separa le chiavi figlio dai campi token ($type, $value, $extensions, $description)
  const tokenKeys   = ['$type', '$value', '$extensions', '$description'];
  const childKeys   = Object.keys(obj).filter(k => !tokenKeys.includes(k));
  const isTokenLeaf = '$value' in obj;

  const result = {};

  // Se è un token foglia, estrae il valore per la mode corretta
  if (isTokenLeaf) {
    const modeOverrides = obj.$extensions?.mode ?? {};
    const rawValue = modeName in modeOverrides
      ? modeOverrides[modeName]
      : obj.$value;

    result.$type  = obj.$type;
    result.$value = cleanRef(rawValue);
    if (obj.$description) result.$description = obj.$description;
  }

  // Processa comunque i figli (un token può essere sia foglia che gruppo)
  for (const key of childKeys) {
    result[key] = extractMode(obj[key], modeName);
  }

  return result;
}

function write(filename, collectionKey, data) {
  const dest = path.join(OUT, filename);
  const wrapped = { [collectionKey]: data };
  fs.writeFileSync(dest, JSON.stringify(wrapped, null, 2));
  console.log(`  ✔ ${dest}`);
}

// ─── Split ────────────────────────────────────────────────────────────────────

console.log('\n📦 Split tokens start\n');

write('primitives.json', 'primitives', raw.primitives);

for (const brand of ['sisal', 'snai', 'pokerstars', 'sisalCasino']) {
  write(`brand.${brand}.json`, 'brand', extractMode(raw.brand, brand));
}

for (const theme of ['light', 'dark']) {
  write(`mode.${theme}.json`, 'mode', extractMode(raw.mode, theme));
}

write('component.json', 'component', extractMode(raw.component, ''));

for (const os of ['ios', 'android']) {
  write(`os.${os}.json`, 'operative system', extractMode(raw['operative system'], os));
}

console.log('\n✅ Split completato → tokens/\n');
