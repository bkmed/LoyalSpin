import json
from pathlib import Path

key_mapping = {
    'plomberie_generale': 'loyalspin_rewards',
    'plomberie_desc_long': 'loyalspin_desc_long',
    'plomberie_desc_1': 'loyalspin_desc_1',
    'plomberie_desc_2': 'loyalspin_desc_2',
    'plomberie_desc_3': 'loyalspin_desc_3',
    'service_before_plomberie': 'service_before_rewards',
    'service_after_plomberie': 'service_after_rewards',
    'service_desc_plumbing': 'service_desc_rewards',
}


def rename_keys(obj):
    if isinstance(obj, dict):
        for old_key in list(obj.keys()):
            value = obj.pop(old_key)
            new_key = key_mapping.get(old_key, old_key)
            obj[new_key] = value
            rename_keys(value)
    elif isinstance(obj, list):
        for item in obj:
            rename_keys(item)


for path in Path('src/i18n/locales').glob('*.json'):
    data = json.loads(path.read_text(encoding='utf-8'))
    rename_keys(data)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('patched', path.name)
