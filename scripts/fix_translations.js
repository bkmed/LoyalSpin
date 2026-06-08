/**
 * fix_translations.js
 * -------------------
 * Syncs all language files to the reference (en.json):
 *  - Missing keys  → added with the English value as a fallback
 *  - Extra keys    → removed (keys not present in en.json)
 *  - Nested order  → preserved to match the reference structure
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const languages = ['en', 'fr', 'ar', 'de', 'es', 'zh', 'hi'];
const refLang = 'en';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Returns an object whose structure matches `reference`.
 * - Keys present in both  → keep the `target` value (recurse for objects)
 * - Keys only in reference → use `reference` value (English fallback)
 * - Keys only in target    → dropped (extra / stale keys)
 */
function syncToReference(reference, target) {
  const result = {};

  for (const key of Object.keys(reference)) {
    const refVal = reference[key];
    const tgtVal = target[key];

    const refIsObj =
      refVal !== null && typeof refVal === 'object' && !Array.isArray(refVal);
    const tgtIsObj =
      tgtVal !== null && typeof tgtVal === 'object' && !Array.isArray(tgtVal);

    if (!(key in target)) {
      // Missing in target → fall back to English
      result[key] = refVal;
    } else if (refIsObj && tgtIsObj) {
      // Both objects → recurse
      result[key] = syncToReference(refVal, tgtVal);
    } else {
      // Leaf value in target → keep as-is
      result[key] = tgtVal;
    }
  }

  return result;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const refPath = path.join(localesDir, `${refLang}.json`);
const reference = JSON.parse(fs.readFileSync(refPath, 'utf8'));

let totalFixed = 0;

for (const lang of languages) {
  if (lang === refLang) {
    console.log(`⏭  Skipping reference: ${lang}.json`);
    continue;
  }

  const filePath = path.join(localesDir, `${lang}.json`);

  let target;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    target = JSON.parse(raw);
  } catch (err) {
    console.error(`✗ Could not read/parse ${lang}.json: ${err.message}`);
    continue;
  }

  const fixed = syncToReference(reference, target);

  fs.writeFileSync(filePath, JSON.stringify(fixed, null, 2) + '\n', 'utf8');
  console.log(`✓ Fixed ${lang}.json`);
  totalFixed++;
}

console.log(`\nDone — ${totalFixed} files updated.`);
