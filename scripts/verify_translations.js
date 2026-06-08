const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const localesDir = path.join(__dirname, '../src/i18n/locales');
const languages = ['en', 'fr', 'ar', 'de', 'es', 'zh', 'hi'];
const referenceLanguage = 'en';

function skipWhitespace(str, index) {
  while (index < str.length && /\s/.test(str[index])) {
    index += 1;
  }
  return index;
}

function readString(str, index) {
  let i = index + 1;
  let value = '';

  while (i < str.length) {
    if (str[i] === '"' && str[i - 1] !== '\\') {
      break;
    }
    value += str[i];
    i += 1;
  }

  return { value, next: i + 1 };
}

function findDuplicateKeys(rawContent) {
  const duplicates = [];
  const stack = [];
  let i = 0;

  while (i < rawContent.length) {
    const char = rawContent[i];

    if (char === '"') {
      const { value: key, next } = readString(rawContent, i);
      let j = skipWhitespace(rawContent, next);

      if (j < rawContent.length && rawContent[j] === ':') {
        const current = stack[stack.length - 1];

        if (current && current.type === 'object') {
          if (current.keys.has(key)) {
            duplicates.push({ path: current.path.slice(), key });
          }
          current.keys.add(key);
        }

        const nextValueIndex = skipWhitespace(rawContent, j + 1);

        if (nextValueIndex < rawContent.length) {
          const nextValueChar = rawContent[nextValueIndex];

          if (nextValueChar === '{') {
            const path = current ? current.path.concat(key) : [key];
            stack.push({ type: 'object', keys: new Set(), path });
            i = nextValueIndex + 1;
            continue;
          }

          if (nextValueChar === '[') {
            const path = current ? current.path.slice() : [];
            stack.push({ type: 'array', path });
            i = nextValueIndex + 1;
            continue;
          }
        }

        i = nextValueIndex;
        continue;
      }

      i = next;
      continue;
    }

    if (char === '{') {
      const parent = stack[stack.length - 1];
      stack.push({
        type: 'object',
        keys: new Set(),
        path: parent ? parent.path.slice() : [],
      });
      i += 1;
      continue;
    }

    if (char === '}') {
      const current = stack[stack.length - 1];
      if (current && current.type === 'object') {
        stack.pop();
      }
      i += 1;
      continue;
    }

    if (char === '[') {
      const parent = stack[stack.length - 1];
      stack.push({ type: 'array', path: parent ? parent.path.slice() : [] });
      i += 1;
      continue;
    }

    if (char === ']') {
      const current = stack[stack.length - 1];
      if (current && current.type === 'array') {
        stack.pop();
      }
      i += 1;
      continue;
    }

    i += 1;
  }

  return duplicates;
}

// Recursively get all keys from a nested object
function getAllKeys(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

function loadTranslations() {
  const translations = {};
  const duplicateIssues = {};

  for (const lang of languages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    let raw;

    try {
      raw = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(
        `${colors.red}Error reading ${lang}.json: ${error.message}${colors.reset}`,
      );
      process.exit(1);
    }

    const duplicates = findDuplicateKeys(raw);
    if (duplicates.length > 0) {
      duplicateIssues[lang] = duplicates;
    }

    try {
      translations[lang] = JSON.parse(raw);
    } catch (error) {
      console.error(
        `${colors.red}Error parsing ${lang}.json: ${error.message}${colors.reset}`,
      );
      process.exit(1);
    }
  }

  return { translations, duplicateIssues };
}

function writeCleanFile(lang, content) {
  const filePath = path.join(localesDir, `${lang}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
}

function verifyTranslations() {
  console.log(
    `${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`,
  );
  console.log(
    `${colors.cyan}║  Translation Keys Verification Script  ║${colors.reset}`,
  );
  console.log(
    `${colors.cyan}╚════════════════════════════════════════╝${colors.reset}\n`,
  );

  const args = process.argv.slice(2);
  const fixDuplicates =
    args.includes('--fix') || args.includes('--fix-duplicates');

  const { translations, duplicateIssues } = loadTranslations();
  const allKeys = {};

  if (fixDuplicates) {
    console.log(
      `${colors.blue}Running in fix mode: duplicate keys will be cleaned.${colors.reset}\n`,
    );
  }

  for (const lang of languages) {
    allKeys[lang] = new Set(getAllKeys(translations[lang]));
    console.log(
      `${colors.blue}${lang.toUpperCase()}:${colors.reset} ${
        allKeys[lang].size
      } keys`,
    );
  }

  console.log('');

  let hasIssues = false;
  const referenceKeys = allKeys[referenceLanguage];
  const missingKeys = {};
  const extraKeys = {};

  for (const lang of languages) {
    if (lang === referenceLanguage) continue;

    missingKeys[lang] = [];
    extraKeys[lang] = [];

    for (const key of referenceKeys) {
      if (!allKeys[lang].has(key)) {
        missingKeys[lang].push(key);
      }
    }

    for (const key of allKeys[lang]) {
      if (!referenceKeys.has(key)) {
        extraKeys[lang].push(key);
      }
    }
  }

  for (const lang of languages) {
    const duplicates = duplicateIssues[lang] || [];
    if (duplicates.length > 0) {
      hasIssues = true;
      console.log(
        `${colors.yellow}━━━ ${lang.toUpperCase()} Duplicate Keys ━━━${
          colors.reset
        }`,
      );
      duplicates.forEach(item => {
        const path =
          item.path.length > 0
            ? `${item.path.join('.')}.${item.key}`
            : item.key;
        console.log(`  - ${path}`);
      });

      if (fixDuplicates) {
        writeCleanFile(lang, translations[lang]);
        console.log(
          `${colors.green}✓ Cleaned duplicate keys in ${lang}.json${colors.reset}`,
        );
      }

      console.log('');
    }
  }

  for (const lang of languages) {
    if (lang === referenceLanguage) continue;

    if (missingKeys[lang].length > 0 || extraKeys[lang].length > 0) {
      hasIssues = true;
      console.log(
        `${colors.yellow}━━━ ${lang.toUpperCase()} Issues ━━━${colors.reset}`,
      );

      if (missingKeys[lang].length > 0) {
        console.log(
          `${colors.red}Missing ${missingKeys[lang].length} keys:${colors.reset}`,
        );
        missingKeys[lang].forEach(key => console.log(`  - ${key}`));
      }

      if (extraKeys[lang].length > 0) {
        console.log(
          `${colors.yellow}Extra ${
            extraKeys[lang].length
          } keys (not in ${referenceLanguage.toUpperCase()}):${colors.reset}`,
        );
        extraKeys[lang].forEach(key => console.log(`  + ${key}`));
      }

      console.log('');
    }
  }

  if (!hasIssues) {
    console.log(
      `${colors.green}✓ All translation files are in sync!${colors.reset}`,
    );
    console.log(
      `${colors.green}✓ All ${referenceKeys.size} keys are present in all languages.${colors.reset}\n`,
    );
    return 0;
  }

  console.log(
    `${colors.red}✗ Translation files are out of sync!${colors.reset}`,
  );
  console.log(
    `${colors.yellow}⚠ Please fix the missing/extra/duplicate keys above.${colors.reset}\n`,
  );
  return 1;
}

const exitCode = verifyTranslations();
process.exit(exitCode);
