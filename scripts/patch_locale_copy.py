import json
from pathlib import Path

common_updates = {
    'nameKey': 'name key (e.g., loyalspin_rewards)',
    'descKey': 'description key (e.g., loyalspin_desc)',
    'icon': 'icon (rewards|partners|offers|analytics)',
    'activityIntervention': 'Ahmed Ben Ali (user@demo.com) requested a loyalty support inquiry in Ariana.',
    'marketplaceIntro': 'Search and filter certified reward offers.',
    'servicePlumbingDesc': 'Discover offers, earn points, and unlock partner rewards.',
    'splashServiceList': 'Rewards · Coupons · Partners · Exclusive Offers',
    'plumbing_ac_gas_heater': 'Rewards · Coupons · Partners · Offers',
    'tagline': 'Rewards · Coupons · Partners · Offers',
    'demoAccountsLabel': 'DEMO LOYALSPIN ACCOUNTS (DIRECT ACCESS)',
    'demo_accounts_label': 'DEMO LOYALSPIN ACCOUNTS (DIRECT ACCESS)',
    'hero_title': 'Your loyalty rewards activated in record time',
    'service_desc_plumbing': 'Discover offers, earn points, and unlock partner rewards.',
    'foot_desc': 'The premier professional ecosystem in Tunisia for loyalty rewards and partner offers.',
    'whatsapp_msg': 'Hello, I need help with my LoyalSpin rewards.',
}

fr_updates = {
    'nameKey': 'clé nom (ex: loyalspin_rewards)',
    'descKey': 'clé description (ex: loyalspin_desc)',
    'icon': 'icone (rewards|partners|offers|analytics)',
    'activityIntervention': 'Ahmed Ben Ali (user@demo.com) a demandé une intervention fidélité à Ariana.',
    'marketplaceIntro': 'Recherchez et filtrez des offres partenaires vérifiées.',
    'servicePlumbingDesc': 'Découvrez des offres, gagnez des points et accédez à des récompenses partenaires.',
    'splashServiceList': 'Récompenses · Coupons · Partenaires · Offres exclusives',
    'plumbing_ac_gas_heater': 'Récompenses · Coupons · Partenaires · Offres',
    'tagline': 'Récompenses · Coupons · Partenaires · Offres',
    'demoAccountsLabel': 'COMPTES DE DÉMO LOYALSPIN (ACCÈS DIRECT)',
    'demo_accounts_label': 'COMPTES DE DÉMO LOYALSPIN (ACCÈS DIRECT)',
    'hero_title': 'Vos récompenses LoyalSpin activées en un éclair',
    'service_desc_plumbing': 'Découvrez des offres, gagnez des points et débloquez des récompenses partenaires.',
    'foot_desc': 'Le premier écosystème professionnel en Tunisie pour les récompenses LoyalSpin et les offres partenaires.',
    'whatsapp_msg': "Bonjour, j'ai besoin d'informations sur mes récompenses LoyalSpin.",
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
    changed = patch_recursive(data, common_updates)
    if path.name == 'fr.json':
        changed = patch_recursive(data, fr_updates) or changed
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('patched', path.name)
