Refactoriser et développer la feature LoyaltySpin en respectant STRICTEMENT l’architecture existante du projet.

ARCHITECTURE OBLIGATOIRE

Ne jamais créer une nouvelle architecture.
Ne jamais déplacer les autres features.
Ne jamais créer de structure différente de celle déjà utilisée dans :

src/features/loyalspin

Tous les nouveaux écrans doivent être créés dans :

src/features/loyalspin/screens

Tous les composants réutilisables doivent être créés dans :

src/features/loyalspin/components

Les utilitaires doivent être créés dans :

src/features/loyalspin/utils

Structure à respecter :

src/features/loyalspin/
├── components/
├── screens/
└── utils/

RÈGLES REACT NATIVE / WEB

L'application doit fonctionner sur :

- iOS
- Android
- Web

Ne jamais créer :

- *.web.tsx
- *.web.ts
- *.native.tsx
- *.native.ts

Tout doit fonctionner avec un seul fichier partagé.

Exemple :

Bon :

components/
└── LoyaltyCard.tsx

Interdit :

components/
├── LoyaltyCard.tsx
└── LoyaltyCard.web.tsx

INTERDICTION HTML

Ne jamais utiliser :

- div
- span
- p
- h1
- h2
- h3
- button
- input
- img
- section
- article
- header
- footer

Utiliser uniquement :

- View
- Text
- Image
- Pressable
- TouchableOpacity
- ScrollView
- FlatList
- SectionList
- Modal
- TextInput
- SafeAreaView

CODE RESPONSIVE

Le responsive doit fonctionner avec React Native.

Utiliser les helpers existants du projet :

src/utils/responsive.ts

Ne jamais écrire du code spécifique web.

Ne jamais utiliser :

Platform.OS === 'web'

sauf si absolument indispensable.

LOGIQUE MÉTIER

La logique doit être séparée de l'UI.

Les screens doivent uniquement :

- gérer la navigation
- orchestrer les composants
- appeler les services

Les composants doivent être réutilisables.

SERVICES

Réutiliser les services existants :

src/services

Si un nouveau service est nécessaire :

src/services/loyalSpinService.ts

STORE

Réutiliser le store Redux existant :

src/store

Créer un nouveau slice uniquement si nécessaire.

Exemple :

src/store/slices/loyalSpinSlice.ts

I18N

Toutes les chaînes doivent être traduisibles.

Utiliser :

src/i18n

Aucun texte en dur dans les composants.

STYLE

Respecter le système de thème existant :

src/theme

Respecter :

- ESLint
- TypeScript
- Prettier

NAVIGATION

Ne pas casser :

src/navigation

Ajouter uniquement les nouvelles routes nécessaires.

OBJECTIF

Créer ou modifier LoyaltySpin en suivant exactement le même pattern que les fichiers déjà présents dans :

src/features/loyalspin/components
src/features/loyalspin/screens

Conserver l'organisation actuelle du projet.
Ne pas inventer une nouvelle architecture.
Ne pas créer de doublons mobile/web.
Ne pas créer de fichiers .web.
Ne pas utiliser de balises HTML.
Un seul composant = un seul fichier partagé pour iOS, Android et Web.