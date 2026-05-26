const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');
const webTranslationsPath = path.join(__dirname, '../src/features/loyalspin/utils/webTranslations.ts');

// Languages in the project
const languages = ['en', 'fr', 'ar', 'de', 'es', 'zh', 'hi', 'it', 'tr'];

// 1. Manually compiled list of inline texts to be added to "web" namespace
const inlineTranslations = {
  ar: {
    "logoutSuccess": "تم تسجيل خروجك بنجاح",
    "favoriteLoginRequired": "يرجى تسجيل الدخول لحفظ المفضلة",
    "favoriteRemoved": "تمت إزالته من المفضلة",
    "favoriteAdded": "أضيف إلى المفضلة !",
    "accueil": "الرئيسية",
    "gestionAnnonce": "إدارة الإعلانات",
    "gestionCategorie": "إدارة الأصناف",
    "login_signup": "تسجيل الدخول",
    "logout": "خروج",
    "loading_premium": "جاري تحميل التطبيق الفاخر...",
    "plumbing_ac_gas_heater": "سباكة · تكييف · غاز · تدفئة مركزية",
    "signinTitle": "تسجيل الدخول",
    "signupTitle": "إنشاء حساب جديد",
    "signinSubtitle": "سجل دخولك للوصول إلى حسابك الفاخر",
    "signupSubtitle": "قم بإنشاء حسابك المجاني في ثوانٍ معدودة",
    "emailLabel": "البريد الإلكتروني",
    "passwordLabel": "كلمة المرور",
    "secureLoginButton": "دخول آمن",
    "demoAccountsLabel": "حسابات التجربة الفورية",
    "signingIn": "جاري تسجيل الدخول...",
    "welcomeUser": "مرحباً بك أحمد بن علي",
    "welcomeAdmin": "مرحباً بك حضرة المدير",
    "noAccountText": "ليس لديك حساب؟",
    "signUpLink": "أنشئ حساباً جديداً",
    "fullNameLabel": "الاسم الكامل",
    "emailPlaceholder": "البريد الإلكتروني",
    "phonePlaceholder": "الهاتف",
    "cityLabel": "المدينة / الولاية",
    "passwordPlaceholder": "كلمة المرور",
    "confirmPasswordPlaceholder": "تأكيد كلمة المرور",
    "createClientAccountButton": "إنشاء حساب جديد",
    "hasAccountText": "لديك حساب بالفعل؟",
    "signInLink": "تسجيل الدخول",
    "guest_access_allowed": "تصفح بصفتك زائر",
    "continue_as_guest": "المواصلة كزائر (مجهول) ←",
    "gallery_realizations": "معرض الأعمال",
    "gallery_photos_real": "صور حقيقية من التدخلات",
    "gallery_desc": "استعرض صور المشاريع الحقيقية التي تم تنفيذها بواسطة فريقنا، مع عناوين ووصف موجز لكل عمل.",
    "gallery_empty": "لا توجد صور متوفرة حالياً. يرجى الرجاء العودة لاحقاً لاستعراض أعمالنا.",
    "services": {
      "title": "إدارة الخدمات",
      "subtitle": "إضافة، تعديل أو حذف الخدمات المتاحة للمستخدمين.",
      "add": "إضافة خدمة",
      "list": "قائمة الخدمات",
      "empty": "لا توجد خدمات محددة.",
      "edit": "تعديل",
      "delete": "حذف",
      "updated": "تم تحديث الخدمة بنجاح.",
      "added": "تم إضافة الخدمة بنجاح.",
      "deleted": "تم حذف الخدمة بنجاح.",
      "placeholder_name": "رمز الاسم (مثال: plomberie_generale)",
      "placeholder_icon": "الأيقونة (plumbing|ac|gas|heater)",
      "placeholder_desc": "رمز الوصف (مثال: plomberie_desc_long)",
      "placeholder_pts": "الرموز الفرعية مفصولة بفاصلة ,"
    },
    "gallery": {
      "title": "إدارة معرض الصور",
      "subtitle": "استخدم هذا الزر لإضافة أو تعديل الصور في المعرض.",
      "add": "إضافة صورة جديدة",
      "list": "قائمة الصور المعروضة",
      "list_subtitle": "إدارة الصور التي تظهر في صفحة المعرض.",
      "empty": "لا توجد صور مضافة حالياً.",
      "label_image": "صورة المعرض",
      "placeholder_title": "العنوان",
      "placeholder_subtitle": "العنوان الفرعي",
      "placeholder_desc": "الوصف",
      "updated": "تم تحديث صورة المعرض بنجاح.",
      "added": "تم إضافة الصورة إلى المعرض بنجاح.",
      "deleted": "تم حذف الصورة من المعرض بنجاح.",
      "error_title_req": "العنوان مطلوب.",
      "error_img_req": "يرجى اختيار صورة.",
      "items_count": "عناصر",
      "item_count": "عنصر",
      "updated_at": "تم التحديث في",
      "advice_title": "نصيحة:",
      "advice_1": "اختر صورة واضحة وممثلة للعمل.",
      "advice_2": "أضف عنواناً قصيراً وعنواناً فرعياً مناسباً.",
      "advice_3": "الوصف يساعد العملاء على فهم الإنجاز."
    },
    "admin": {
      "dashboard_title": "لوحة قيادة الإدارة",
      "dashboard_subtitle": "تابع حالة المخزون العام لقطع الغيار والأعضاء المسجلين.",
      "active_listings": "الإعلانات النشطة",
      "active_listings_desc": "قطع غيار في الكتالوج",
      "categories_desc": "أصناف ديناميكية",
      "members_desc": "عملاء مسجلين",
      "leads_desc": "طلب تدخل سريع",
      "recent_logs_title": "سجل العمليات الأخير للإدارة",
      "log_intervention": "قام {{name}} بطلب تدخل سريع بجهة {{city}}.",
      "log_part_added": "تمت إضافة قطعة غيار جديدة : \"{{title}}\" في الكتالوج.",
      "log_category_created": "تم إنشاء صنف جديد : \"{{name}}\".",
      "log_user_status": "تم تحديث وضعية الحريف {{email}}."
    },
    "home": {
      "hero_badge": "تونس للتدخل السريع 24/7",
      "hero_title": "أفضل وأسرع خدمات الترصيص والصيانة في تونس",
      "hero_subtitle": "نحن هنا لتلبية جميع احتياجاتكم في صيانة الترصيص، تكييف الهواء، والتدفئة المركزية مع توفير سوق قطع غيار مستعملة وموثوقة.",
      "support_badge": "الدعم الفني 24/7",
      "service_desc_plumbing": "إصلاح التسربات وتجديد شبكات المياه المنزلية والعمومية.",
      "service_desc_ac": "تركيب المكيفات، صيانة شاملة وشحن الغاز المعتمد.",
      "service_desc_gas": "تمديد وتوصيل مواسير الغاز المنزلي مع السلامة الكلية.",
      "service_desc_heater": "صيانة وضبط المراجل الحرارية والمشعات للتوفير.",
      "gallery_section_title": "صور من عملنا الحقيقي",
      "gallery_section_desc": "استعرض صور المشاريع الحقيقية التي تم تنفيذها بواسطة فريقنا، مع عناوين ووصف موجز لكل عمل.",
      "gallery_section_empty": "لم يتم إضافة أي صورة بعد. ستظهر هنا الصور الواقعية بمجرد إضافتها من قبل المسؤول.",
      "parts_section_desc": "استعرض أحدث قطع الغيار المستعملة المضمونة المتوفرة في الكتالوج لدينا.",
      "call_to_buy": "اتصل لشراء"
    },
    "buy_piece_msg": "مرحباً، أنا مهتم بشراء قطعة الغيار المستعملة: {{title}} - بسعر {{price}} د.ت."
  },
  fr: {
    "logoutSuccess": "Déconnexion réussie ! A bientôt.",
    "favoriteLoginRequired": "Veuillez vous connecter pour gérer vos favoris.",
    "favoriteRemoved": "Retiré des favoris",
    "favoriteAdded": "Ajouté aux favoris !",
    "accueil": "Accueil",
    "gestionAnnonce": "Gestion Annonce",
    "gestionCategorie": "Gestion Catégorie",
    "login_signup": "Connexion / S'inscrire",
    "logout": "Déconnexion",
    "loading_premium": "Chargement premium...",
    "plumbing_ac_gas_heater": "Plomberie · Climatisation · Gaz · Chauffage",
    "signinTitle": "Connexion",
    "signupTitle": "Inscription",
    "signinSubtitle": "Connectez-vous pour accéder à votre espace premium.",
    "signupSubtitle": "Créez votre compte client gratuit en quelques secondes.",
    "emailLabel": "Adresse Email",
    "passwordLabel": "Mot de Passe",
    "secureLoginButton": "Connexion Sécurisée",
    "demoAccountsLabel": "COMPTES DE DÉMO DE PLOMBERIE (ACCÈS DIRECT)",
    "signingIn": "Connexion en cours...",
    "welcomeUser": "Ravi de vous revoir, Ahmed Ben Ali !",
    "welcomeAdmin": "Bienvenue dans votre espace d'administration !",
    "noAccountText": "Nouveau sur LoyalSpin ?",
    "signUpLink": "Créer un compte",
    "fullNameLabel": "Nom Complet",
    "emailPlaceholder": "Email",
    "phonePlaceholder": "Téléphone",
    "cityLabel": "Ville / Gouvernorat",
    "passwordPlaceholder": "Mot de Passe",
    "confirmPasswordPlaceholder": "Confirmation",
    "createClientAccountButton": "Créer mon compte client",
    "hasAccountText": "Déjà inscrit ?",
    "signInLink": "Se connecter",
    "guest_access_allowed": "Accès Invité autorisé.",
    "continue_as_guest": "Continuer en tant qu'invité (Anonyme) →",
    "gallery_realizations": "Galerie Réalisations",
    "gallery_photos_real": "Photos réelles des interventions",
    "gallery_desc": "Retrouvez ici les dernières réalisations ajoutées par l'administrateur, avec titre, sous-titre et description pour chaque projet.",
    "gallery_empty": "Aucune photo disponible pour le moment. Revenez bientôt pour découvrir nos réalisations récentes.",
    "services": {
      "title": "Gérer les services",
      "subtitle": "Ajoutez, modifiez ou supprimez les services disponibles aux utilisateurs.",
      "add": "+ Ajouter un service",
      "list": "Liste des services",
      "empty": "Aucun service défini.",
      "edit": "Modifier",
      "delete": "Supprimer",
      "updated": "Service mis à jour.",
      "added": "Service ajouté.",
      "deleted": "Service supprimé.",
      "placeholder_name": "clé nom (ex: plomberie_generale)",
      "placeholder_icon": "icone (plumbing|ac|gas|heater)",
      "placeholder_desc": "clé description (ex: plomberie_desc_long)",
      "placeholder_pts": "clés bullets séparées par ,"
    },
    "gallery": {
      "title": "Gérer la galerie",
      "subtitle": "Utilisez ce bouton pour ajouter ou modifier les photos de la galerie via une fenêtre modale.",
      "add": "+ Ajouter une image",
      "list": "Liste des images de la galerie",
      "list_subtitle": "Gérez les visuels qui s’affichent sur la page Galerie.",
      "empty": "Aucune image ajoutée pour le moment.",
      "label_image": "Image de la galerie",
      "placeholder_title": "Titre",
      "placeholder_subtitle": "Sous-titre",
      "placeholder_desc": "Description",
      "updated": "Image de la galerie mise à jour.",
      "added": "Image ajoutée à la galerie.",
      "deleted": "Image supprimée de la galerie.",
      "error_title_req": "Le titre est requis.",
      "error_img_req": "Veuillez sélectionner une image.",
      "items_count": "éléments",
      "item_count": "élément",
      "updated_at": "Mis à jour le",
      "advice_title": "Conseil :",
      "advice_1": "Choisissez une image claire et représentative.",
      "advice_2": "Ajoutez un titre court et un sous-titre pertinent.",
      "advice_3": "La description aide vos clients à comprendre la réalisation."
    },
    "admin": {
      "dashboard_title": "Tableau de Bord Administration",
      "dashboard_subtitle": "Suivez l'état général des stocks de pièces détachées et des membres inscrits.",
      "active_listings": "Annonces Actives",
      "active_listings_desc": "Pièces en catalogue",
      "categories_desc": "Familles de produits",
      "members_desc": "Clients enregistrés",
      "leads_desc": "Demandes d'interventions",
      "recent_logs_title": "Historique Récents des Actions Admin",
      "log_intervention": "{{name}} a sollicité une intervention plomberie d'urgence à {{city}}.",
      "log_part_added": "Nouvelle pièce ajoutée : {{title}} dans le catalogue.",
      "log_category_created": "Catégorie '{{name}}' créée par Admin.",
      "log_user_status": "Statut réactivé pour le client {{email}}."
    },
    "home": {
      "hero_badge": "Tunisie Dépannage Express 24h/7j",
      "hero_title": "Vos Urgences Plomberie Réglées en un Record",
      "hero_subtitle": "Artisans loyalspins qualifiés à votre service pour les fuites, pannes thermiques et raccordements gaz dans tout le pays.",
      "support_badge": "Support 24/7",
      "service_desc_plumbing": "Recherche de fuites, installations de sanitaires et de chauffe-eau.",
      "service_desc_ac": "Installation de climatiseurs split, recharges de gaz et entretien.",
      "service_desc_gas": "Tuyauteries de gaz conformes, branchements et détection de fuites.",
      "service_desc_heater": "Chaudières, détartrages de radiateurs et régulations connectées.",
      "gallery_section_title": "Nos Réalisations en Images",
      "gallery_section_desc": "Découvrez une sélection de projets réels ajoutés par l’administrateur, accompagnés de titres, sous-titres et descriptions.",
      "gallery_section_empty": "Aucune photo ajoutée pour le moment. Les réalisations réelles apparaîtront ici dès qu’elles seront publiées par l’administrateur.",
      "parts_section_desc": "Équipez-vous au meilleur prix avec nos pièces d'occasion révisées et testées.",
      "call_to_buy": "Commander"
    },
    "buy_piece_msg": "Bonjour, je suis intéressé par l'achat de la pièce d'occasion : {{title}} - {{price}} DT."
  },
  en: {
    "logoutSuccess": "Logout successful! See you soon.",
    "favoriteLoginRequired": "Please log in to manage your favorites.",
    "favoriteRemoved": "Removed from favorites",
    "favoriteAdded": "Added to favorites!",
    "accueil": "Home",
    "gestionAnnonce": "Manage Listings",
    "gestionCategorie": "Manage Categories",
    "login_signup": "Login / Register",
    "logout": "Logout",
    "loading_premium": "Loading premium...",
    "plumbing_ac_gas_heater": "Plumbing · Air Conditioning · Gas · Heating",
    "signinTitle": "Sign In",
    "signupTitle": "Sign Up",
    "signinSubtitle": "Sign in to access your premium space.",
    "signupSubtitle": "Create your free customer account in seconds.",
    "emailLabel": "Email Address",
    "passwordLabel": "Password",
    "secureLoginButton": "Secure Login",
    "demoAccountsLabel": "DEMO PLUMBING ACCOUNTS (DIRECT ACCESS)",
    "signingIn": "Signing in...",
    "welcomeUser": "Welcome back, Ahmed Ben Ali!",
    "welcomeAdmin": "Welcome to your admin space!",
    "noAccountText": "New to Plumber?",
    "signUpLink": "Create an account",
    "fullNameLabel": "Full Name",
    "emailPlaceholder": "Email",
    "phonePlaceholder": "Phone",
    "cityLabel": "City / Governorate",
    "passwordPlaceholder": "Password",
    "confirmPasswordPlaceholder": "Confirm Password",
    "createClientAccountButton": "Create customer account",
    "hasAccountText": "Already registered?",
    "signInLink": "Log In",
    "guest_access_allowed": "Guest access allowed.",
    "continue_as_guest": "Continue as guest (Anonymous) →",
    "gallery_realizations": "Project Gallery",
    "gallery_photos_real": "Real photos of interventions",
    "gallery_desc": "Browse photos of real projects executed by our team, with titles, subtitles and descriptions.",
    "gallery_empty": "No photos available at the moment. Check back soon to discover our recent projects.",
    "services": {
      "title": "Manage Services",
      "subtitle": "Add, edit or delete services available to users.",
      "add": "+ Add service",
      "list": "Services List",
      "empty": "No services defined.",
      "edit": "Edit",
      "delete": "Delete",
      "updated": "Service updated successfully.",
      "added": "Service added successfully.",
      "deleted": "Service deleted successfully.",
      "placeholder_name": "Name key (e.g., plomberie_generale)",
      "placeholder_icon": "Icon (plumbing|ac|gas|heater)",
      "placeholder_desc": "Description key (e.g., plomberie_desc_long)",
      "placeholder_pts": "Bullet keys separated by ,"
    },
    "gallery": {
      "title": "Manage Gallery",
      "subtitle": "Use this button to add or modify gallery photos.",
      "add": "+ Add image",
      "list": "Gallery Images List",
      "list_subtitle": "Manage the visuals that appear on the Gallery page.",
      "empty": "No images added yet.",
      "label_image": "Gallery Image",
      "placeholder_title": "Title",
      "placeholder_subtitle": "Subtitle",
      "placeholder_desc": "Description",
      "updated": "Gallery image updated successfully.",
      "added": "Image added to gallery.",
      "deleted": "Image deleted from gallery.",
      "error_title_req": "Title is required.",
      "error_img_req": "Please select an image.",
      "items_count": "items",
      "item_count": "item",
      "updated_at": "Updated at",
      "advice_title": "Advice:",
      "advice_1": "Choose a clear and representative image.",
      "advice_2": "Add a short title and a relevant subtitle.",
      "advice_3": "The description helps your clients understand the realization."
    },
    "admin": {
      "dashboard_title": "Administration Dashboard",
      "dashboard_subtitle": "Follow the general status of spare parts stocks and registered members.",
      "active_listings": "Active Listings",
      "active_listings_desc": "Parts in catalog",
      "categories_desc": "Product families",
      "members_desc": "Registered customers",
      "leads_desc": "Intervention requests",
      "recent_logs_title": "Recent Admin Action History",
      "log_intervention": "{{name}} requested an emergency plumbing intervention in {{city}}.",
      "log_part_added": "New part added: {{title}} in the catalog.",
      "log_category_created": "Category '{{name}}' created by Admin.",
      "log_user_status": "Status reactivated for client {{email}}."
    },
    "home": {
      "hero_badge": "Tunisia Express Troubleshooting 24/7",
      "hero_title": "Your Plumbing Emergencies Solved in Record Time",
      "hero_subtitle": "Qualified plumbers at your service for leaks, thermal breakdowns and gas connections nationwide.",
      "support_badge": "Support 24/7",
      "service_desc_plumbing": "Leak detection, sanitary installation and water heater repairs.",
      "service_desc_ac": "Split AC installation, gas recharge and maintenance.",
      "service_desc_gas": "Compliant gas piping, connection and leak detection.",
      "service_desc_heater": "Boilers, radiator descaling and smart thermostat regulation.",
      "gallery_section_title": "Our Projects in Images",
      "gallery_section_desc": "Discover a selection of real projects added by the administrator, with titles, subtitles and descriptions.",
      "gallery_section_empty": "No photos added yet. Real projects will appear here as soon as they are published by the admin.",
      "parts_section_desc": "Equip yourself at the best price with our tested and inspected used parts.",
      "call_to_buy": "Order Now"
    },
    "buy_piece_msg": "Hello, I am interested in purchasing the used spare part: {{title}} - {{price}} DT."
  }
};

// 2. Read and parse webTranslations.ts
console.log('Reading webTranslations.ts...');
const content = fs.readFileSync(webTranslationsPath, 'utf8');

// Slice content starting from 'export const translations =' to only get JavaScript objects
const startIndex = content.indexOf('export const translations =');
if (startIndex === -1) {
  console.error("Could not find 'export const translations =' in webTranslations.ts");
  process.exit(1);
}
let jsContent = content.slice(startIndex);
jsContent = jsContent.replace('export const translations =', 'const translations =');
jsContent += '\nmodule.exports = { translations };';

fs.writeFileSync(path.join(__dirname, 'temp_webTranslations.js'), jsContent);

const { translations } = require('./temp_webTranslations');
console.log('Loaded translations from webTranslations.ts successfully!');

// Clean up temporary file
fs.unlinkSync(path.join(__dirname, 'temp_webTranslations.js'));

// Language dictionaries to modify
const localeData = {};
for (const lang of languages) {
  const filePath = path.join(localesDir, `${lang}.json`);
  console.log(`Reading ${lang}.json...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  localeData[lang] = data;
}

// 3. Merge translations
for (const lang of languages) {
  // Ensure "web" namespace exists
  if (!localeData[lang].web) {
    localeData[lang].web = {};
  }
  
  // Merge keys from webTranslations.ts
  const srcLang = lang === 'fr' ? 'FR' : (lang === 'ar' ? 'AR' : 'EN'); // fallback to EN for other languages
  const baseTranslations = translations[srcLang] || translations.EN;
  
  // Assign all keys
  for (const [key, val] of Object.entries(baseTranslations)) {
    localeData[lang].web[key] = val;
  }
  
  // Merge inline translations
  const inlineDict = inlineTranslations[lang] || inlineTranslations.en; // fallback to en
  for (const [key, val] of Object.entries(inlineDict)) {
    if (typeof val === 'object' && val !== null) {
      if (!localeData[lang].web[key]) {
        localeData[lang].web[key] = {};
      }
      for (const [subKey, subVal] of Object.entries(val)) {
        localeData[lang].web[key][subKey] = subVal;
      }
    } else {
      localeData[lang].web[key] = val;
    }
  }
}

// 3.5. Synchronize all non-English languages with English as reference
console.log('Synchronizing all language files to match en.json keys exactly...');
const referenceData = localeData['en'];

function syncKeys(ref, target) {
  let modified = false;
  
  // Remove keys not in reference
  for (const key in target) {
    if (!(key in ref)) {
      delete target[key];
      modified = true;
    }
  }
  
  // Add missing keys or recursively sync
  for (const key in ref) {
    if (!(key in target)) {
      target[key] = JSON.parse(JSON.stringify(ref[key]));
      modified = true;
    } else if (typeof ref[key] === 'object' && ref[key] !== null && !Array.isArray(ref[key])) {
      if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
        target[key] = {};
        modified = true;
      }
      if (syncKeys(ref[key], target[key])) {
        modified = true;
      }
    }
  }
  
  return modified;
}

for (const lang of languages) {
  if (lang === 'en') continue;
  syncKeys(referenceData, localeData[lang]);
}

// 4. Save locale JSON files
for (const lang of languages) {
  const filePath = path.join(localesDir, `${lang}.json`);
  console.log(`Writing merged translations to ${lang}.json...`);
  fs.writeFileSync(filePath, JSON.stringify(localeData[lang], null, 2) + '\n', 'utf8');
}

console.log('Merge and synchronization complete!');
