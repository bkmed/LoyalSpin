const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const languages = ['en', 'fr', 'ar', 'de', 'es', 'zh', 'hi', 'it', 'tr'];

// Dedicated translations for French
const frAdditions = {
  checkout: {
    proceedToPayment: 'Procéder au paiement',
    placeOrder: 'Passer commande',
    orderSummary: 'Résumé de la commande',
    subtotal: 'Sous-total',
    shippingCost: 'Livraison',
    tax: 'Taxes',
    total: 'Total',
    selectAddress: "Choisir l'adresse de livraison",
    selectPaymentMethod: 'Choisir le mode de paiement',
    selectDelivery: 'Choisir le mode de livraison',
    myAddresses: 'Mes adresses',
    noAddresses: 'Aucune adresse enregistrée',
    addFirstAddress: 'Ajouter votre première adresse',
    addAddress: 'Ajouter une adresse',
    editAddress: "Modifier l'adresse",
    addressAdded: 'Adresse ajoutée avec succès',
    addressUpdated: 'Adresse mise à jour avec succès',
    fullName: 'Nom complet',
    enterFullName: 'Entrez votre nom complet',
    addressLine1: 'Adresse ligne 1',
    addressLine2: 'Adresse ligne 2',
    enterAddress: "Adresse, boîte postale, nom d'entreprise",
    apartment: 'Appartement, suite, unité, bâtiment, étage, etc.',
    city: 'Ville',
    enterCity: 'Ville',
    state: 'Province / État',
    enterState: 'Province',
    postalCode: 'Code postal',
    enterPostalCode: 'Code postal',
    country: 'Pays',
    enterCountry: 'Pays',
    phone: 'Numéro de téléphone',
    enterPhone: 'Numéro de téléphone',
    addressType: "Type d'adresse",
    setAsDefault: 'Définir comme adresse par défaut',
    default: 'Par défaut',
    setDefault: 'Définir par défaut',
    paymentMethods: 'Modes de paiement',
    noPaymentMethods: 'Aucun mode de paiement enregistré',
    addPaymentMethod: 'Ajouter un mode de paiement',
    securityNote: 'Vos informations de paiement sont cryptées et sécurisées',
    deliveryOptions: 'Options de livraison',
    estimatedDelivery: 'Livraison estimée',
    standardDelivery: 'Livraison standard',
    expressDelivery: 'Livraison express',
    overnightDelivery: 'Livraison le lendemain',
    storePickup: 'Retrait en magasin',
    free: 'Gratuit',
    confirmationSent: 'Un e-mail de confirmation a été envoyé à',
    continueShopping: 'Continuer les achats',
    viewOrders: 'Voir mes commandes',
  },
  suppliers: {
    title: 'Fournisseurs',
    list: 'Liste des fournisseurs',
    add: 'Ajouter un fournisseur',
    edit: 'Modifier le fournisseur',
    detail: 'Détails du fournisseur',
    name: 'Nom du fournisseur',
    namePlaceholder: 'Entrez le nom du fournisseur',
    nameRequired: 'Le nom du fournisseur est obligatoire',
    emailRequired: "L'e-mail est obligatoire",
    contactPerson: 'Personne de contact',
    contactPersonPlaceholder: 'Entrez le nom du contact',
    contactInfo: 'Informations de contact',
    emailPlaceholder: 'fournisseur@exemple.com',
    phonePlaceholder: '+33 1 23 45 67 89',
    addressPlaceholder: "Entrez l'adresse complète",
    websitePlaceholder: 'https://exemple.com',
    notesPlaceholder: 'Notes supplémentaires...',
    website: 'Site Web',
    notes: 'Notes',
    isActive: 'Statut actif',
    products: 'Produits',
    noProducts: 'Aucun produit associé à ce fournisseur',
    noSuppliers: 'Aucun fournisseur trouvé',
    searchPlaceholder: 'Rechercher des fournisseurs...',
    added: 'Fournisseur ajouté avec succès',
    updated: 'Fournisseur mis à jour avec succès',
    deleted: 'Fournisseur supprimé avec succès',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer {{name}} ?',
    preferred: 'Préféré',
  },
  stockReception: {
    title: 'Réception de stock',
    list: 'Liste des réceptions',
    add: 'Nouvelle réception',
    detail: 'Détails de la réception',
    receive: 'Recevoir du stock',
    verify: 'Vérifier les quantités',
    complete: 'Terminer la réception',
    reference: 'Numéro de référence',
    referencePlaceholder: 'N° de bon de commande ou facture',
    expectedQuantity: 'Qté attendue',
    receivedQuantity: 'Qté reçue',
    expectedDate: 'Date attendue',
    receivedDate: 'Date de réception',
    receivedBy: 'Reçu par',
    status: 'Statut',
    pending: 'En attente',
    inProgress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
    items: 'Articles',
    totalCost: 'Coût total',
    noReceptions: 'Aucune réception de stock trouvée',
    added: 'Réception créée avec succès',
    updated: 'Réception mise à jour avec succès',
    completedSuccess: 'Réception de stock terminée',
  },
  pickPack: {
    title: 'Préparation & Emballage',
    list: 'Commandes à traiter',
    detail: 'Détails de la commande',
    pick: 'Préparer les articles',
    pack: 'Emballer les articles',
    ship: 'Marquer comme expédié',
    orders: 'Commandes',
    orderNumber: 'Numéro de commande',
    customer: 'Client',
    status: 'Statut',
    pending: 'En attente',
    picking: 'En cours de préparation',
    packing: "En cours d'emballage",
    readyToShip: 'Prêt à être expédié',
    shipped: 'Expédié',
    priority: 'Priorité',
    low: 'Basse',
    normal: 'Normale',
    high: 'Haute',
    urgent: 'Urgente',
    assignedTo: 'Assigné à',
    location: 'Emplacement',
    picked: 'Préparé',
    packed: 'Emballé',
    noOrders: 'Aucune commande à traiter',
    pickItems: 'Préparer les articles',
    packItems: 'Emballer les articles',
    shipOrder: 'Expédier la commande',
    markPicked: 'Marquer comme préparé',
    markPacked: 'Marquer comme emballé',
    shippingMethod: "Méthode d'expédition",
    trackingNumber: 'Numéro de suivi',
  },
  adminPurchases: {
    title: 'Gestion des achats',
    list: 'Tous les achats',
    viewPurchases: 'Voir les achats',
    filterByUser: 'Filtrer par utilisateur',
    filterByStatus: 'Filtrer par statut',
    totalPurchases: 'Total des achats',
    totalRevenue: 'Revenu total',
    details: "Détails de l'achat",
  },
};

// Dedicated translations for German
const deAdditions = {
  checkout: {
    proceedToPayment: 'Zur Kasse gehen',
    placeOrder: 'Bestellung aufgeben',
    orderSummary: 'Bestellübersicht',
    subtotal: 'Zwischensumme',
    shippingCost: 'Versandkosten',
    tax: 'Steuer',
    total: 'Gesamtsumme',
    selectAddress: 'Lieferadresse auswählen',
    selectPaymentMethod: 'Zahlungsmethode auswählen',
    selectDelivery: 'Versandart auswählen',
    myAddresses: 'Meine Adressen',
    noAddresses: 'Keine Adressen gespeichert',
    addFirstAddress: 'Erste Adresse hinzufügen',
    addAddress: 'Adresse hinzufügen',
    editAddress: 'Adresse bearbeiten',
    addressAdded: 'Adresse erfolgreich hinzugefügt',
    addressUpdated: 'Adresse erfolgreich aktualisiert',
    fullName: 'Vollständiger Name',
    enterFullName: 'Vollständigen Namen eingeben',
    addressLine1: 'Adresszeile 1',
    addressLine2: 'Adresszeile 2',
    enterAddress: 'Straße, Postfach, Firmenname',
    apartment: 'Wohnung, Suite, Einheit, Gebäude, Etage, usw.',
    city: 'Stadt',
    enterCity: 'Stadt eingeben',
    state: 'Bundesland / Kanton',
    enterState: 'Bundesland eingeben',
    postalCode: 'Postleitzahl',
    enterPostalCode: 'Postleitzahl eingeben',
    country: 'Land',
    enterCountry: 'Land eingeben',
    phone: 'Telefonnummer',
    enterPhone: 'Telefonnummer eingeben',
    addressType: 'Adresstyp',
    setAsDefault: 'Als Standardadresse festlegen',
    default: 'Standard',
    setDefault: 'Als Standard festlegen',
    paymentMethods: 'Zahlungsmethoden',
    noPaymentMethods: 'Keine Zahlungsmethoden gespeichert',
    addPaymentMethod: 'Zahlungsmethode hinzufügen',
    securityNote: 'Ihre Zahlungsinformationen sind verschlüsselt und sicher',
    deliveryOptions: 'Versandoptionen',
    estimatedDelivery: 'Voraussichtliche Lieferung',
    standardDelivery: 'Standardversand',
    expressDelivery: 'Expressversand',
    overnightDelivery: 'Lieferung am nächsten Tag',
    storePickup: 'Selbstabholung im Geschäft',
    free: 'Kostenlos',
    confirmationSent: 'Eine Bestätigung wurde gesendet an',
    continueShopping: 'Einkauf fortsetzen',
    viewOrders: 'Meine Bestellungen anzeigen',
  },
  suppliers: {
    title: 'Lieferanten',
    list: 'Lieferantenliste',
    add: 'Lieferant hinzufügen',
    edit: 'Lieferant bearbeiten',
    detail: 'Lieferantendetails',
    name: 'Lieferantenname',
    namePlaceholder: 'Lieferantennamen eingeben',
    nameRequired: 'Lieferantenname ist erforderlich',
    emailRequired: 'E-Mail ist erforderlich',
    contactPerson: 'Ansprechpartner',
    contactPersonPlaceholder: 'Name des Ansprechpartners eingeben',
    contactInfo: 'Kontaktinformationen',
    emailPlaceholder: 'lieferant@example.com',
    phonePlaceholder: '+49 30 12345678',
    addressPlaceholder: 'Vollständige Adresse eingeben',
    websitePlaceholder: 'https://example.com',
    notesPlaceholder: 'Zusätzliche Notizen...',
    website: 'Webseite',
    notes: 'Notizen',
    isActive: 'Aktivitätsstatus',
    products: 'Produkte',
    noProducts: 'Keine Produkte mit diesem Lieferanten verknüpft',
    noSuppliers: 'Keine Lieferanten gefunden',
    searchPlaceholder: 'Lieferanten suchen...',
    added: 'Lieferant erfolgreich hinzugefügt',
    updated: 'Lieferant erfolgreich aktualisiert',
    deleted: 'Lieferant erfolgreich gelöscht',
    deleteConfirm: 'Sind Sie sicher, dass Sie {{name}} löschen möchten ?',
    preferred: 'Bevorzugt',
  },
  stockReception: {
    title: 'Wareneingang',
    list: 'Wareneingangsliste',
    add: 'Neuer Wareneingang',
    detail: 'Wareneingangsdetails',
    receive: 'Waren erhalten',
    verify: 'Mengen überprüfen',
    complete: 'Wareneingang abschließen',
    reference: 'Referenznummer',
    referencePlaceholder: 'Bestell-Nr. oder Rechnungs-Nr.',
    expectedQuantity: 'Erwartete Menge',
    receivedQuantity: 'Erhaltene Menge',
    expectedDate: 'Erwartetes Datum',
    receivedDate: 'Erhaltenes Datum',
    receivedBy: 'Erhalten von',
    status: 'Status',
    pending: 'Ausstehend',
    inProgress: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    items: 'Artikel',
    totalCost: 'Gesamtkosten',
    noReceptions: 'Keine Wareneingänge gefunden',
    added: 'Wareneingang erfolgreich erstellt',
    updated: 'Wareneingang erfolgreich aktualisiert',
    completedSuccess: 'Wareneingang abgeschlossen',
  },
  pickPack: {
    title: 'Kommissionierung & Verpackung',
    list: 'Zu erfüllende Bestellungen',
    detail: 'Bestelldetails',
    pick: 'Artikel kommissionieren',
    pack: 'Artikel verpacken',
    ship: 'Als versandt markieren',
    orders: 'Bestellungen',
    orderNumber: 'Bestellnummer',
    customer: 'Kunde',
    status: 'Status',
    pending: 'Ausstehend',
    picking: 'Kommissionierung',
    packing: 'Verpackung',
    readyToShip: 'Bereit zum Versand',
    shipped: 'Versandt',
    priority: 'Priorität',
    low: 'Niedrig',
    normal: 'Normal',
    high: 'Hoch',
    urgent: 'Dringend',
    assignedTo: 'Zugewiesen an',
    location: 'Lagerort',
    picked: 'Kommissioniert',
    packed: 'Verpackt',
    noOrders: 'Keine zu erfüllenden Bestellungen',
    pickItems: 'Artikel kommissionieren',
    packItems: 'Artikel verpacken',
    shipOrder: 'Bestellung versenden',
    markPicked: 'Als kommissioniert markieren',
    markPacked: 'Als verpackt markieren',
    shippingMethod: 'Versandart',
    trackingNumber: 'Sendungsverfolgungsnummer',
  },
  adminPurchases: {
    title: 'Einkaufsverwaltung',
    list: 'Alle Einkäufe',
    viewPurchases: 'Einkäufe anzeigen',
    filterByUser: 'Nach Benutzer filtern',
    filterByStatus: 'Nach Status filtern',
    totalPurchases: 'Einkäufe insgesamt',
    totalRevenue: 'Gesamtumsatz',
    details: 'Einkaufsdetails',
  },
};

// ServicesScreen hardcoded labels additions for ALL languages
const servicesScreenLabels = {
  en: {
    services_local: {
      before_intervention: 'Before',
      after_intervention: 'After',
    },
  },
  fr: {
    services_local: {
      before_intervention: 'Avant',
      after_intervention: 'Après',
    },
  },
  ar: {
    services_local: {
      before_intervention: 'قبل التدخل',
      after_intervention: 'بعد التدخل',
    },
  },
  de: {
    services_local: {
      before_intervention: 'Vorher',
      after_intervention: 'Nachher',
    },
  },
  es: {
    services_local: {
      before_intervention: 'Antes',
      after_intervention: 'Después',
    },
  },
  zh: {
    services_local: {
      before_intervention: '干预前',
      after_intervention: '干预后',
    },
  },
  hi: {
    services_local: {
      before_intervention: 'पहले',
      after_intervention: 'बाद में',
    },
  },
  it: {
    services_local: {
      before_intervention: 'Prima',
      after_intervention: 'Dopo',
    },
  },
  tr: {
    services_local: {
      before_intervention: 'Önce',
      after_intervention: 'Sonra',
    },
  },
};

// Helper to deeply merge two objects
function deepMerge(target, source) {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Sync function
function syncAll() {
  const refFile = path.join(localesDir, 'en.json');
  const refContent = JSON.parse(fs.readFileSync(refFile, 'utf8'));

  // First apply additions to English
  if (servicesScreenLabels.en) {
    deepMerge(refContent, servicesScreenLabels.en);
  }
  fs.writeFileSync(refFile, JSON.stringify(refContent, null, 2) + '\n', 'utf8');
  console.log(`✓ Updated en.json with service labels.`);

  // Generate recursive sync keys skeleton based on the updated en.json
  function buildSkeleton(refObj, sourceObj, fallbackLangObj) {
    const targetObj = {};
    for (const key in refObj) {
      if (
        refObj[key] &&
        typeof refObj[key] === 'object' &&
        !Array.isArray(refObj[key])
      ) {
        targetObj[key] = buildSkeleton(
          refObj[key],
          sourceObj && sourceObj[key] ? sourceObj[key] : null,
          fallbackLangObj && fallbackLangObj[key] ? fallbackLangObj[key] : null,
        );
      } else {
        if (sourceObj && sourceObj[key] !== undefined) {
          targetObj[key] = sourceObj[key];
        } else if (fallbackLangObj && fallbackLangObj[key] !== undefined) {
          targetObj[key] = fallbackLangObj[key];
        } else {
          // Fallback to English value
          targetObj[key] = refObj[key];
        }
      }
    }
    return targetObj;
  }

  // Iterate over other languages
  for (const lang of languages) {
    if (lang === 'en') continue;

    const langFile = path.join(localesDir, `${lang}.json`);
    let rawContent = {};
    if (fs.existsSync(langFile)) {
      try {
        rawContent = JSON.parse(fs.readFileSync(langFile, 'utf8'));
      } catch (err) {
        console.error(`Error reading ${lang}.json:`, err);
      }
    }

    // Apply manual specific translations first
    if (lang === 'fr') {
      deepMerge(rawContent, frAdditions);
    } else if (lang === 'de') {
      deepMerge(rawContent, deAdditions);
    }

    // Apply service screen specific translations
    if (servicesScreenLabels[lang]) {
      deepMerge(rawContent, servicesScreenLabels[lang]);
    }

    // Recursively build final synced object mapping to en.json skeleton
    const syncedContent = buildSkeleton(refContent, rawContent, refContent);

    // Save synced file
    fs.writeFileSync(
      langFile,
      JSON.stringify(syncedContent, null, 2) + '\n',
      'utf8',
    );
    console.log(`✓ Synchronized and saved ${lang}.json`);
  }

  console.log('\n✓ ALL translations synced successfully!');
}

syncAll();
