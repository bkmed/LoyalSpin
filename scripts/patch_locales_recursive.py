import json
from pathlib import Path

updates = {
    'expertises_desc': 'LoyalSpin loyalty and engagement solutions designed to drive repeat purchases and referrals.',
    'plomberie_generale': 'LoyalSpin Rewards',
    'plomberie_desc_long': 'Collect and redeem loyalty points through our reward program, powered by LoyalSpin.',
    'plomberie_desc_1': 'Earn points on every purchase',
    'plomberie_desc_2': 'Redeem exclusive partner offers',
    'plomberie_desc_3': 'Unlock tiered loyalty perks',
    'climatisation': 'Member Benefits',
    'clim_desc_long': 'Premium rewards, member-exclusive experiences, and ongoing loyalty support.',
    'clim_desc_1': 'Priority access to deals',
    'clim_desc_2': 'Personalized bonus offers',
    'clim_desc_3': 'Dedicated loyalty support',
    'installation_gaz': 'Partner Network',
    'gaz_desc_long': 'Trusted reward partners with seamless benefits and verified promotions.',
    'gaz_desc_1': 'Verified partner offers',
    'gaz_desc_2': 'Secure loyalty redemption',
    'gaz_desc_3': 'Connected rewards across brands',
    'chauffage_central': 'Loyalty Analytics',
    'chauffage_desc_long': 'Insights and performance tracking to turn every interaction into a loyalty opportunity.',
    'chauffage_desc_1': 'Track member activity',
    'chauffage_desc_2': 'Optimize reward campaigns',
    'chauffage_desc_3': 'Improve retention with data',
    'service_before_plomberie': 'Before: low rewards visibility',
    'service_after_plomberie': 'After: clear loyalty value',
    'service_before_clim': 'Before: scattered member benefits',
    'service_after_clim': 'After: curated reward experiences',
    'service_before_gaz': 'Before: disconnected offers',
    'service_after_gaz': 'After: unified partner rewards',
    'service_before_chauffage': 'Before: low engagement',
    'service_after_chauffage': 'After: higher loyalty retention',
}

fr_updates = {
    'expertises_desc': 'Solutions de fidélité et d engagement client pour générer des recommandations et des achats répétés.',
    'plomberie_generale': 'Récompenses LoyalSpin',
    'plomberie_desc_1': 'Gagnez des points à chaque commande',
    'plomberie_desc_2': 'Profitez d offres partenaires exclusives',
    'plomberie_desc_3': 'Débloquez des avantages fidélité personnalisés',
    'climatisation': 'Avantages Membres',
    'clim_desc_1': 'Accès prioritaire aux meilleures offres',
    'clim_desc_2': 'Bonus personnalisés pour vos clients',
    'clim_desc_3': 'Support fidélité dédié',
    'installation_gaz': 'Réseau de Partenaires',
    'gaz_desc_1': 'Offres vérifiées par nos partenaires',
    'gaz_desc_2': 'Rédemption sécurisée des récompenses',
    'gaz_desc_3': 'Avantages connectés entre marques',
    'chauffage_central': 'Analytics de Fidélité',
    'chauffage_desc_1': 'Suivez l activité de vos membres',
    'chauffage_desc_2': 'Optimisez vos campagnes récompenses',
    'chauffage_desc_3': 'Augmentez la rétention grâce aux données',
    'service_before_plomberie': 'Avant : visiblité des récompenses insuffisante',
    'service_after_plomberie': 'Après : valeur fidélité claire et motivante',
    'service_before_clim': 'Avant : avantages membres dispersés',
    'service_after_clim': 'Après : expériences de récompense bien ciblées',
    'service_before_gaz': 'Avant : offres partenaires déconnectées',
    'service_after_gaz': 'Après : récompenses unifiées entre marques',
    'service_before_chauffage': 'Avant : engagement client trop faible',
    'service_after_chauffage': 'Après : rétention renforcée avec des offres personnalisées',
}


def patch_value(obj, key, new_value):
    if isinstance(obj, dict):
        for k, v in list(obj.items()):
            if k == key and obj[k] != new_value:
                obj[k] = new_value
                return True
            if isinstance(v, (dict, list)):
                if patch_value(v, key, new_value):
                    return True
    elif isinstance(obj, list):
        for item in obj:
            if patch_value(item, key, new_value):
                return True
    return False


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
    if path.name == 'fr.json':
        changed = patch_recursive(data, fr_updates) or changed
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('patched', path.name)
