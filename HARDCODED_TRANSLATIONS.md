# Hardcoded Arabic/French Translations - Ternary Expressions

## Summary
Found **50+ hardcoded translation pairs** across 5 files using the pattern: `currentLang === 'AR' ? '[ARABIC]' : '[FRENCH]'`

---

## File 1: [src/navigation/AppNavigator.web.tsx](src/navigation/AppNavigator.web.tsx)

### Translation Pairs Found: 4

| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 138-141 | Logout success toast | `تم تسجيل خروجك بنجاح` | `Déconnexion réussie ! A bientôt.` | Success message when user logs out |
| 155-158 | Favorite login required | `يرجى تسجيل الدخول لحفظ المفضلة` | `Veuillez vous connecter pour gérer vos favoris.` | Error message when anonymous user tries to favorite |
| 171-174 | Favorite removed | `تمت إزالته من المفضلة` | `Retiré des favoris` | Success message when product removed from favorites |
| 184-187 | Favorite added | `أضيف إلى المفضلة !` | `Ajouté aux favoris !` | Success message when product added to favorites |

---

## File 2: [src/features/loyalspin/screens/WebAuthScreen.tsx](src/features/loyalspin/screens/WebAuthScreen.tsx)

### Translation Pairs Found: 34

#### Sign In Form
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 267 | Sign in title | `تسجيل الدخول` | `Connexion` | Main heading in sign-in tab |
| 272 | Sign up title | `إنشاء حساب جديد` | `Inscription` | Main heading in sign-up tab |
| 275-276 | Forgot password title | `نسيت كلمة المرور` | `Mot de passe oublié` | Main heading in password reset tab |
| 283-286 | Sign in subtitle | `سجل دخولك للوصول إلى حسابك الفاخر` | `Connectez-vous pour accéder à votre espace premium.` | Subtitle under sign-in form |
| 290-292 | Sign up subtitle | `قم بإنشاء حسابك المجاني في ثوانٍ معدودة` | `Créez votre compte client gratuit en quelques secondes.` | Subtitle under sign-up form |
| 295-298 | Forgot password subtitle | `أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور.` | `Entrez votre email pour recevoir les instructions de réinitialisation.` | Subtitle under password reset form |

#### Form Labels
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 307 | Email label | `البريد الإلكتروني` | `Adresse Email` | Form input label |
| 326 | Password label | `كلمة المرور` | `Mot de Passe` | Form input label |
| 349-352 | Forgot password link | `هل نسيت كلمة المرور؟` | `Forgot Password?` | Button to navigate to password reset |
| 354 | Secure login badge | `تسجيل آمن` | `Secure login` | Security badge text |
| 364 | Sign in button | `دخول آمن` | `Connexion Sécurisée` | Submit button text |
| 372-374 | Demo accounts label | `حسابات التجربة الفورية` | `COMPTES DE DÉMO LOYALSPIN (ACCÈS DIRECT)` | Section header for demo accounts |

#### Demo Account Messages
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 386-387 | Signing in toast | `جاري تسجيل الدخول...` | `Connexion en cours...` | Loading message during login |
| 409-410 | Admin welcome | `مرحباً بك حضرة المدير` | `Bienvenue dans votre espace d'administration !` | Toast message for admin login |
| 429-430 | User welcome | `مرحباً بك أحمد بن علي` | `Ravi de vous revoir, Ahmed Ben Ali !` | Toast message for user login |

#### Sign In Form Controls
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 451-453 | Invalid credentials | `البريد الإلكتروني أو كلمة المرور غير صحيحة` | `Identifiants invalides` | Error message for wrong credentials |
| 471-473 | New account question | `ليس لديك حساب؟` | `Nouveau sur ${businessName} ?` | Question to encourage sign-up |
| 486-487 | Create account link | `أنشئ حساباً جديداً` | `Créer un compte` | Link to sign-up form |

#### Forgot Password Form
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 501-503 | Password reset confirmation | `تم إرسال رابط إعادة تعيين كلمة المرور بنجاح !` | `Le lien de réinitialisation a été envoyé !` | Success message after sending reset link |
| 512-514 | Reset link button | `إرسال رابط إعادة التعيين` | `Send reset link` | Submit button for password reset |
| 537-539 | Back to sign in | `العودة إلى تسجيل الدخول` | `Back to sign in` | Link to return to sign-in form |

#### Sign Up Form
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 565 | Full name label | `الاسم الكامل` | `Nom Complet` | Form input label |
| 583 | Email label (signup) | `البريد الإلكتروني` | `Email` | Form input label |
| 599 | Phone label | `الهاتف` | `Téléphone` | Form input label |
| 617-619 | City/Governorate label | `المدينة / الولاية` | `Ville / Gouvernorat` | Form select label |
| 641 | Password label (signup) | `كلمة المرور` | `Mot de Passe` | Form input label |
| 657-659 | Confirm password label | `تأكيد كلمة المرور` | `Confirmation` | Form input label |
| 679-681 | Create account button | `إنشاء حساب جديد` | `Créer mon compte client` | Submit button for sign-up |
| 689-691 | Already registered question | `لديك حساب بالفعل؟` | `Déjà inscrit ?` | Question to encourage sign-in |
| 707 | Sign in link | `تسجيل الدخول` | `Se connecter` | Link to sign-in form |

#### Guest Access
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 726-728 | Continue as guest | `تصفح بصفتك زائر` | `Accès Invité autorisé.` | Toast message when browsing as guest |
| 738-740 | Continue as guest button | `المواصلة كزائر (مجهول) ←` | `Continuer en tant qu'invité (Anonyme) →` | Button text to bypass authentication |

---

## File 3: [src/features/loyalspin/components/WebNavbar.tsx](src/features/loyalspin/components/WebNavbar.tsx)

### Translation Pairs Found: 18

#### Admin Navigation Links (Desktop)
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 86 | Home link | `الرئيسية` | `Accueil` | Admin dashboard home |
| 93-95 | Manage announcements | `إدارة الإعلانات` | `Gestion Annonce` | Admin section for managing announcements |
| 102-104 | Manage categories | `إدارة الأصناف` | `Gestion Catégorie` | Admin section for managing product categories |
| 109 | Gallery management | `المعرض` | `galleryManageLabel` (variable) | Admin gallery management |
| 113 | Services management | `الخدمات` | `Services` | Admin services section |
| 117 | User management | `المستخدمين` | `Gestion User` | Admin user management |
| 121 | Admin profile | `ملف الإدارة` | `Profil` | Admin profile section |
| 126 | Analytics | `التحليلات الماليّة` | `Analytics` | Financial analytics dashboard |

#### Logout & Authentication
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 228-230 | Sign in / Register button | `تسجيل الدخول` | `Connexion / S'inscrire` | Button to trigger authentication modal |
| 242 | Logout button | `خروج` | `Déconnexion` | Logout action button |

#### Admin Navigation Links (Mobile)
| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 256 | Mobile home link | `الرئيسية` | `Accueil` | Mobile admin dashboard home |
| 260 | Mobile announcements | `الإعلانات` | `Annonces` | Mobile admin announcements |
| 264 | Mobile categories | `الأصناف` | `Catégories` | Mobile admin categories |
| 268 | Mobile gallery | `المعرض` | `galleryManageLabel` (variable) | Mobile gallery management |
| 272 | Mobile services | `الخدمats` | `Services` | Mobile services (NOTE: Arabic text has typo "خدمats") |
| 276 | Mobile users | `المستخدمين` | `Membres` | Mobile user management |
| 280 | Mobile admin profile | `الملف` | `Profil` | Mobile admin profile |
| 284 | Mobile analytics | `التحليلات` | `Analytics` | Mobile analytics |

---

## File 4: [src/features/loyalspin/screens/ZonesScreen.tsx](src/features/loyalspin/screens/ZonesScreen.tsx)

### Translation Pairs Found: 1

| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 229 | Urgent status badge | `حالة طوارئ قصوى` | `URGENT` | Badge label on intervention request form |

---

## File 5: [src/features/loyalspin/components/WebSplashScreen.tsx](src/features/loyalspin/components/WebSplashScreen.tsx)

### Translation Pairs Found: 1

| Line | Context | Arabic | French | Purpose |
|------|---------|--------|--------|---------|
| 73-74 | Loading message | `جاري تحميل التطبيق الفاخر...` | `Chargement premium...` | Splash screen loading indicator text |

---

## Summary Statistics

| File | Total Pairs | Lines |
|------|-----------|-------|
| AppNavigator.web.tsx | 4 | 138-187 |
| WebAuthScreen.tsx | 34 | 267-740 |
| WebNavbar.tsx | 18 | 86-284 |
| ZonesScreen.tsx | 1 | 229 |
| WebSplashScreen.tsx | 1 | 73-74 |
| **TOTAL** | **58** | - |

---

## Unique Translations (No Duplicates)

### Authentication & Forms (21 unique)
- Sign in: `تسجيل الدخول` → `Connexion`
- Sign up: `إنشاء حساب جديد` → `Inscription`
- Forgot password: `نسيت كلمة المرور` → `Mot de passe oublié`
- Email: `البريد الإلكتروني` → `Adresse Email`/`Email`
- Password: `كلمة المرور` → `Mot de Passe`
- Phone: `الهاتف` → `Téléphone`
- City/Governorate: `المدينة / الولاية` → `Ville / Gouvernorat`
- Full name: `الاسم الكامل` → `Nom Complet`
- Confirm password: `تأكيد كلمة المرور` → `Confirmation`
- Secure login: `تسجيل آمن` → `Secure login`
- Secure connection: `دخول آمن` → `Connexion Sécurisée`
- Already registered: `لديك حساب بالفعل؟` → `Déjà inscrit ?`
- No account yet: `ليس لديك حساب؟` → `Nouveau sur ${businessName} ?`
- Create account: `أنشئ حساباً جديداً` → `Créer un compte`
- Connect as guest: `المواصلة كزائر (مجهول) ←` → `Continuer en tant qu'invité (Anonyme) →`
- Browse as guest: `تصفح بصفتك زائر` → `Accès Invité autorisé.`
- Invalid credentials: `البريد الإلكتروني أو كلمة المرور غير صحيحة` → `Identifiants invalides`
- Back to sign in: `العودة إلى تسجيل الدخول` → `Back to sign in`
- Forgot password link: `هل نسيت كلمة المرور؟` → `Forgot Password?`
- Reset link sent: `تم إرسال رابط إعادة تعيين كلمة المرور بنجاح !` → `Le lien de réinitialisation a été envoyé !`
- Send reset: `إرسال رابط إعادة التعيين` → `Send reset link`

### Navigation & Admin (18 unique)
- Home: `الرئيسية` → `Accueil`
- Announcements: `إدارة الإعلانات` → `Gestion Annonce` / `الإعلانات` → `Annonces`
- Categories: `إدارة الأصناف` → `Gestion Catégorie` / `الأصناف` → `Catégories`
- Gallery: `المعرض` → `galleryManageLabel`
- Services: `الخدمات` → `Services` (with typo variant: `الخدمats`)
- Users: `المستخدمين` → `Gestion User` / `Membres`
- Profile: `ملف الإدارة` → `Profil` / `الملف` → `Profil`
- Analytics: `التحليلات الماليّة` → `Analytics` / `التحليلات` → `Analytics`
- Logout: `خروج` → `Déconnexion`
- Login/Register: `تسجيل الدخول` → `Connexion / S'inscrire`

### User Messages (6 unique)
- Logout success: `تم تسجيل خروجك بنجاح` → `Déconnexion réussie ! A bientôt.`
- Favorite login required: `يرجى تسجيل الدخول لحفظ المفضلة` → `Veuillez vous connecter pour gérer vos favoris.`
- Removed from favorites: `تمت إزالته من المفضلة` → `Retiré des favoris`
- Added to favorites: `أضيف إلى المفضلة !` → `Ajouté aux favoris !`
- Signing in: `جاري تسجيل الدخول...` → `Connexion en cours...`
- Loading premium: `جاري تحميل التطبيق الفاخر...` → `Chargement premium...`

### Status/Labels (2 unique)
- Urgent: `حالة طوارئ قصوى` → `URGENT`
- Secure: `تسجيل آمن` → `Secure login`

---

## Recommendations

1. **Move to i18n**: All these translations should be migrated to the i18n translation files instead of being hardcoded in ternary expressions
2. **Typo Alert**: Fix `الخدمات` typo in WebNavbar.tsx line 272 (`الخدمats` should be `الخدمات`)
3. **Variable Usage**: Some labels use dynamic variables like `galleryManageLabel` while others are hardcoded - standardize this approach
4. **Create Translation Keys**: Define proper translation keys (e.g., `auth.signin.title`, `nav.admin.home`) for all these strings
5. **Use translate() Hook**: Replace ternary expressions with `t()` or `translate()` from the i18n system

