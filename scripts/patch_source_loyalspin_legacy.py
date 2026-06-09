from pathlib import Path

replacements = {
    "name: 'plomberie_generale'": "name: 'loyalspin_rewards'",
    "icon: 'plumbing'": "icon: 'rewards'",
    "desc: 'plomberie_desc_long'": "desc: 'loyalspin_desc_long'",
    "pts: ['plomberie_desc_1', 'plomberie_desc_2', 'plomberie_desc_3']": "pts: ['loyalspin_desc_1', 'loyalspin_desc_2', 'loyalspin_desc_3']",
    "imgBefore: 'service_before_plomberie'": "imgBefore: 'service_before_rewards'",
    "imgAfter: 'service_after_plomberie'": "imgAfter: 'service_after_rewards'",
    "title: tCommon('web.plomberie_generale')": "title: tCommon('web.loyalspin_rewards')",
    "desc: tCommon('web.home.service_desc_plumbing')": "desc: tCommon('web.home.service_desc_rewards')",
    "const [icon, setIcon] = useState('plumbing')": "const [icon, setIcon] = useState('rewards')",
    "setIcon('plumbing')": "setIcon('rewards')",
    "serviceIconPaths.plumbing": "serviceIconPaths.rewards",
}
files = [
    'src/navigation/webData.ts',
    'src/navigation/AppNavigator.tsx',
    'src/navigation/AppNavigator.web.tsx',
    'src/navigation/WebAppNavigator.tsx',
    'src/features/loyalspin/screens/HomeScreen.tsx',
    'src/features/loyalspin/screens/AdminServicesEditor.tsx',
    'src/components/ServiceIcon.tsx',
    'src/components/serviceIconAssets.ts',
    'src/components/ServiceIcon.test.tsx',
]

for file in files:
    path = Path(file)
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in replacements.items():
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding='utf-8')
        print('patched', file)
