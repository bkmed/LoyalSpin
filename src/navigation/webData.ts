import { LocalCategory } from '../features/loyalspin/utils/webTranslations';

const now = new Date().toISOString();

export const initialWebCategories: LocalCategory[] = [
  'Robinetterie',
  'Chauffe-eau',
  'Canalisation',
  'Climatisation',
  'Radiateurs',
  'Vannes',
  'Autre',
].map((name, index) => ({
  id: `cat-${index + 1}`,
  name,
  createdAt: now,
  updatedAt: now,
}));

export const initialWebServices = [
  {
    id: 'srv-1',
    name: 'loyalspin_rewards',
    icon: 'rewards',
    desc: 'loyalspin_desc_long',
    pts: ['loyalspin_desc_1', 'loyalspin_desc_2', 'loyalspin_desc_3'],
    whatsappText: 'devis_msg',
    imgBefore: 'service_before_rewards',
    imgAfter: 'service_after_rewards',
  },
  {
    id: 'srv-2',
    name: 'climatisation',
    icon: 'ac',
    desc: 'clim_desc_long',
    pts: ['clim_desc_1', 'clim_desc_2', 'clim_desc_3'],
    whatsappText: 'devis_msg',
    imgBefore: 'service_before_clim',
    imgAfter: 'service_after_clim',
  },
  {
    id: 'srv-3',
    name: 'installation_gaz',
    icon: 'gas',
    desc: 'gaz_desc_long',
    pts: ['gaz_desc_1', 'gaz_desc_2', 'gaz_desc_3'],
    whatsappText: 'devis_msg',
    imgBefore: 'service_before_gaz',
    imgAfter: 'service_after_gaz',
  },
  {
    id: 'srv-4',
    name: 'chauffage_central',
    icon: 'heater',
    desc: 'chauffage_desc_long',
    pts: ['chauffage_desc_1', 'chauffage_desc_2', 'chauffage_desc_3'],
    whatsappText: 'devis_msg',
    imgBefore: 'service_before_chauffage',
    imgAfter: 'service_after_chauffage',
  },
];
