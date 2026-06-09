import json
from pathlib import Path

updates = {
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

for path in Path('src/i18n/locales').glob('*.json'):
    text = path.read_text(encoding='utf-8')
    data = json.loads(text)
    changed = False
    if isinstance(data, dict):
        if 'services_local' in data and isinstance(data['services_local'], dict):
            for key, value in updates.items():
                if key in data['services_local'] and data['services_local'][key] != value:
                    data['services_local'][key] = value
                    changed = True
            if path.name == 'fr.json':
                for key, value in fr_updates.items():
                    if key in data['services_local'] and data['services_local'][key] != value:
                        data['services_local'][key] = value
                        changed = True
        for key, value in updates.items():
            if key in data and data[key] != value:
                data[key] = value
                changed = True
        if path.name == 'fr.json':
            for key, value in fr_updates.items():
                if key in data and data[key] != value:
                    data[key] = value
                    changed = True
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print('patched', path.name)
