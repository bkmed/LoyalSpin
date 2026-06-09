import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking } from 'react-native';
import { useToast } from '../../../context/ToastContext';

interface ZonesScreenProps {
  t: any;
  supportWhatsAppDigits: string;
  supportWhatsAppNumber: string;
  interventionZones?: string[];
}

const ALL_CITIES_BY_ZONE: Record<string, { city: string; area: string }[]> = {
  'Grand Tunis': [
    { city: 'Tunis', area: 'Grand Tunis' },
    { city: 'Ariana', area: 'Grand Tunis' },
    { city: 'Ben Arous', area: 'Grand Tunis' },
    { city: 'La Manouba', area: 'Grand Tunis' },
  ],

  Sahel: [
    { city: 'Sousse', area: 'Sahel' },
    { city: 'Monastir', area: 'Sahel' },
    { city: 'Mahdia', area: 'Sahel' },
  ],

  Sfax: [{ city: 'Sfax', area: 'Sfax' }],
  Ariana: [{ city: 'Ariana', area: 'Ariana' }],
  Béja: [{ city: 'Béja', area: 'Béja' }],
  'Ben Arous': [{ city: 'Ben Arous', area: 'Ben Arous' }],
  Bizerte: [{ city: 'Bizerte', area: 'Bizerte' }],
  Gabès: [{ city: 'Gabès', area: 'Gabès' }],
  Gafsa: [{ city: 'Gafsa', area: 'Gafsa' }],
  Jendouba: [{ city: 'Jendouba', area: 'Jendouba' }],
  Kairouan: [{ city: 'Kairouan', area: 'Kairouan' }],
  Kasserine: [{ city: 'Kasserine', area: 'Kasserine' }],
  Kébili: [{ city: 'Kébili', area: 'Kébili' }],
  'Le Kef': [{ city: 'Le Kef', area: 'Le Kef' }],
  Mahdia: [{ city: 'Mahdia', area: 'Mahdia' }],
  'La Manouba': [{ city: 'La Manouba', area: 'La Manouba' }],
  Médenine: [{ city: 'Médenine', area: 'Médenine' }],
  Monastir: [{ city: 'Monastir', area: 'Monastir' }],
  Nabeul: [{ city: 'Nabeul', area: 'Nabeul' }],
  'Sidi Bouzid': [{ city: 'Sidi Bouzid', area: 'Sidi Bouzid' }],
  Siliana: [{ city: 'Siliana', area: 'Siliana' }],
  Sousse: [{ city: 'Sousse', area: 'Sousse' }],
  Tataouine: [{ city: 'Tataouine', area: 'Tataouine' }],
  Tozeur: [{ city: 'Tozeur', area: 'Tozeur' }],
  Tunis: [{ city: 'Tunis', area: 'Tunis' }],
  Zaghouan: [{ city: 'Zaghouan', area: 'Zaghouan' }],
};

const getZoneTranslationKey = (zone: string) => {
  return `zones.${zone
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')}`;
};

const ZonesScreen = ({
  t,
  supportWhatsAppDigits,
  supportWhatsAppNumber,
  interventionZones,
}: ZonesScreenProps) => {
  const { showToast } = useToast();

  const tCommon = (key: string, defaultValue?: string) => {
    if (typeof t === 'function') {
      return t(key, { defaultValue });
    }
    return t?.[key] || defaultValue;
  };

  const activeZones =
    interventionZones && interventionZones.length > 0
      ? interventionZones
      : ['Grand Tunis', 'Sahel', 'Sfax'];

  const coverageCities = activeZones.flatMap(
    zone => ALL_CITIES_BY_ZONE[zone] || [{ city: zone, area: zone }],
  );

  const cityOptions = coverageCities.map(item => item.city);

  const [selectedGovernorat, setSelectedGovernorat] = useState<string | null>(
    activeZones[0] || 'Grand Tunis',
  );
  const [interventionName, setInterventionName] = useState('');
  const [interventionPhone, setInterventionPhone] = useState('');
  const [interventionGov, setInterventionGov] = useState('');

  useEffect(() => {
    if (cityOptions.length > 0 && !cityOptions.includes(interventionGov)) {
      setInterventionGov(cityOptions[0]);
    }
  }, [cityOptions, interventionGov]);
  const [interventionProblem, setInterventionProblem] = useState("Fuite d'eau");
  const [interventionDetails, setInterventionDetails] = useState('');

  const handleSubmit = () => {
    if (!interventionName || !interventionPhone) {
      showToast(
        tCommon('web.request_name_phone_required', 'Nom et téléphone requis'),
        'error',
      );
      return;
    }

    showToast(
      tCommon('web.request_submitted', 'Demande envoyée avec succès'),
      'success',
    );
    setInterventionName('');
    setInterventionPhone('');
    setInterventionDetails('');
  };

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in text-left">
      <View className="text-center max-w-3xl mx-auto mb-16">
        <Text className="bg-[#1E3A5F] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest leading-none">
          {tCommon('web.zones_directes', "Zones d'intervention directes")}
        </Text>
        <Text className="text-3xl sm:text-4xl font-black tracking-tight mt-6 text-slate-900 dark:text-slate-100">
          {tCommon('zones.zones', 'Zones Couvertes')}
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-3 font-semibold">
          {tCommon(
            'zones.zone_tagline',
            'Nous intervenons rapidement dans ces régions.',
          )}
        </Text>
      </View>

      <View className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <View className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[500px]">
          <View>
            <Text className="text-base font-black text-slate-800 dark:text-slate-100">
              {tCommon('zones.carte_interactive', 'Carte Interactive')}
            </Text>
            <Text className="text-slate-400 text-xs mt-1 font-semibold dark:text-slate-300">
              {tCommon(
                'web.zone_map_instructions',
                'Cliquez sur une zone pour plus de détails',
              )}
            </Text>
          </View>

          <View className="flex justify-center py-8 relative">
            <svg
              width="220"
              height="380"
              viewBox="0 0 100 180"
              fill="none"
              className="filter drop-shadow-md"
            >
              <path
                d="M38 12 C 43 8, 48 9, 52 14 L 46 22 Z"
                fill={
                  selectedGovernorat === 'Grand Tunis' ? '#f97316' : '#1e3a5f'
                }
                className="cursor-pointer transition hover:opacity-85"
                onClick={() => setSelectedGovernorat('Grand Tunis')}
              />

              <path
                d="M48 20 C 53 18, 55 24, 52 28 L 45 26 Z"
                fill={
                  selectedGovernorat === 'Grand Tunis' ? '#F97316' : '#2563EB'
                }
                className="cursor-pointer transition hover:scale-105 transform origin-center"
                onClick={() => setSelectedGovernorat('Grand Tunis')}
              />

              <path
                d="M53 23 C 58 18, 68 20, 61 31 L 52 28 Z"
                fill={selectedGovernorat === 'Sahel' ? '#F97316' : '#3B82F6'}
                className="cursor-pointer transition hover:opacity-85"
                onClick={() => setSelectedGovernorat('Sahel')}
              />

              <path
                d="M52 30 C 58 31, 62 42, 57 52 L 48 40 Z"
                fill={selectedGovernorat === 'Sahel' ? '#F97316' : '#1D4ED8'}
                className="cursor-pointer transition hover:scale-105 transform origin-center"
                onClick={() => setSelectedGovernorat('Sahel')}
              />

              <path
                d="M46 54 C 54 58, 58 70, 52 82 L 38 72 Z"
                fill={selectedGovernorat === 'Sfax' ? '#F97316' : '#60A5FA'}
                className="cursor-pointer transition hover:opacity-85"
                onClick={() => setSelectedGovernorat('Sfax')}
              />

              <path
                d="M36 24 L44 38 L38 52 L36 68 L22 88 L14 118 L24 140 L38 170 L52 145 L48 112 L44 86 L40 70 Z"
                fill="#E2E8F0"
                className="opacity-30 pointer-events-none"
              />
            </svg>

            {selectedGovernorat && (
              <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 text-white p-4 rounded-2xl border border-[#F97316]/30 shadow-xl max-w-[220px] backdrop-blur-sm animate-fade-in text-center">
                <Text className="text-[10px] font-black text-[#F97316] uppercase tracking-wider">
                  {tCommon(
                    getZoneTranslationKey(selectedGovernorat),
                    selectedGovernorat,
                  )}
                </Text>
                <Text className="text-xs font-black mt-1 text-white">
                  {tCommon(
                    'zones.intervention_express',
                    'Intervention Express',
                  )}
                </Text>
                <Text className="text-[10.5px] text-slate-300 mt-1 leading-relaxed">
                  {selectedGovernorat === 'Grand Tunis'
                    ? tCommon(
                        'web.zone_grand_tunis_info',
                        'Intervention rapide dans le Grand Tunis',
                      )
                    : selectedGovernorat === 'Sahel'
                    ? tCommon(
                        'web.zone_sahel_info',
                        'Intervention rapide au Sahel',
                      )
                    : tCommon('web.zone_other_info', 'Intervention disponible')}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedGovernorat(null)}
                  className="mt-2.5 text-[9px] font-black text-rose-500 uppercase tracking-widest block mx-auto underline"
                >
                  {tCommon('zones.fermer', 'Fermer')}
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
            <View className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <Text className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                {tCommon('zones.villes_couvertes', 'Villes Couvertes')}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://wa.me/${supportWhatsAppDigits}?text=${encodeURIComponent(
                      tCommon(
                        'zones.whatsapp_msg',
                        "Bonjour, j'ai besoin d'une intervention urgente.",
                      ),
                    )}`,
                  )
                }
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-emerald-700"
              >
                <Text className="text-white text-center font-bold">
                  {tCommon('zones.appeler_whatsapp', 'Contacter WhatsApp')}:{' '}
                  {supportWhatsAppNumber}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {coverageCities.map(item => (
                <View
                  key={item.city}
                  className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  <Text className="text-xs font-black text-slate-800 dark:text-slate-100">
                    {tCommon(getZoneTranslationKey(item.city), item.city)}
                  </Text>
                  <Text className="text-[9px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-300">
                    {tCommon(getZoneTranslationKey(item.area), item.area)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="border-t border-slate-100 dark:border-slate-700 pt-5 flex items-center justify-between">
            <Text className="text-xs font-bold text-slate-500 dark:text-slate-400">
              *{' '}
              {tCommon(
                'zones.urgentCoverageText',
                'Les zones colorées sont couvertes en moins de 30 minutes.',
              )}
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://maps.google.com')}
              className="text-xs font-black text-[#1E3A5F] dark:text-sky-400 hover:underline"
            >
              <Text className="text-[#1E3A5F] dark:text-sky-400 font-bold">
                {tCommon('zones.ouvrir_maps', 'Ouvrir dans Google Maps')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <View>
            <Text className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-extrabold text-[8.5px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              {tCommon('zones.urgentStatusBadge', 'Intervention Urgente')}
            </Text>
            <Text className="text-xl font-black text-slate-800 dark:text-slate-100 mt-3">
              {tCommon('zones.demande_intervention', "Demande d'intervention")}
            </Text>
          </View>

          <View className="space-y-4 font-semibold text-xs">
            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                {tCommon('zones.nom_complet', 'Nom Complet')} *
              </Text>
              <TextInput
                placeholder={tCommon(
                  'zones.nom_placeholder',
                  'Ex: Mohamed Ben Khedher',
                )}
                value={interventionName}
                onChangeText={setInterventionName}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#F97316] text-slate-900 dark:text-slate-100"
              />
            </View>

            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                {tCommon('zones.telephone', 'Téléphone')} *
              </Text>
              <TextInput
                placeholder={supportWhatsAppNumber || '+216 22 456 789'}
                value={interventionPhone}
                onChangeText={setInterventionPhone}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#F97316] text-slate-900 dark:text-slate-100"
              />
            </View>

            <View className="grid grid-cols-2 gap-4">
              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                  {tCommon('zones.ville', 'Ville')}
                </Text>
                <select
                  value={interventionGov}
                  onChange={e => setInterventionGov(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                >
                  {cityOptions.map(city => (
                    <option key={city} value={city}>
                      {tCommon(getZoneTranslationKey(city), city)}
                    </option>
                  ))}
                </select>
              </View>

              <View className="space-y-2">
                <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                  {tCommon('zones.type_probleme', 'Type Problème')}
                </Text>
                <select
                  value={interventionProblem}
                  onChange={e => setInterventionProblem(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                >
                  <option value="Fuite d'eau">
                    {tCommon('zones.prob_fuite', "Fuite d'eau / Tuyau cassé")}
                  </option>
                  <option value="Panne Chauffe-eau">
                    {tCommon('zones.prob_chauffe_eau', 'Panne Chauffe-eau')}
                  </option>
                  <option value="Climatisation">
                    {tCommon('zones.prob_climatiseur', 'Problème Climatiseur')}
                  </option>
                  <option value="Gaz STEG">
                    {tCommon('zones.prob_gaz', 'Tuyauterie Gaz / Sécurité')}
                  </option>
                </select>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                {tCommon('zones.description', 'Description')}
              </Text>
              <TextInput
                multiline={true}
                placeholder={tCommon(
                  'zones.desc_placeholder',
                  'Précisez votre adresse, étage, ou problème...',
                )}
                value={interventionDetails}
                onChangeText={setInterventionDetails}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#F97316] text-slate-900 dark:text-slate-100"
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider hover:scale-[1.01] transform"
            >
              <Text className="text-white text-center font-bold">
                {tCommon('zones.envoyer_demande', 'Envoyer la demande')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ZonesScreen;
