import json
from pathlib import Path

updates = {
    'credits': '© 2026 LoyalSpin. All rights reserved.',
    'noAccountText': 'New to LoyalSpin?',
    'hero_subtitle': 'LoyalSpin rewards experts ready to help you earn, redeem and manage loyalty benefits nationwide.',
}


def patch_recursive(obj, mapping):
    changed = False
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in mapping and obj[k] != mapping[k]:
                obj[k] = mapping[k]
                changed = True
            changed = patch_recursive(v, mapping) or changed
    elif isinstance(obj, list):
        for item in obj:
            changed = patch_recursive(item, mapping) or changed
    return changed

for path in Path('src/i18n/locales').glob('*.json'):
    data = json.loads(path.read_text(encoding='utf-8'))
    changed = patch_recursive(data, updates)
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('patched', path.name)
