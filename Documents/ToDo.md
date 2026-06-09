1. click sur logo et first connection when sign do no go to dhasboard user the new one it go to ancienne fashboard fix that web and mobile
2. navbar key web.history et web.notifications web.coupons not plugid i18n
3. routtle page blanche je voi rien
4. roullette page , notification page et history page et carte de fidalite page not pluged i18n enleve tt les text en dur

5) fix loading screen with the new logo et pluger le bussnes name

### BUG FIXES PRIORITAIRES - LOYALSPIN

Avant toute modification :

- Analyser les routes existantes.
- Analyser la navigation Web et Mobile.
- Analyser les menus.
- Analyser les traductions i18n.
- Identifier pourquoi certaines pages utilisent encore l'ancien projet.

Ne pas créer une nouvelle architecture.

Respecter la structure existante.

Compatible :

- Android
- iOS
- Web

Aucun :

- .web.tsx
- .native.tsx

Aucun HTML.

Utiliser uniquement React Native + React Native Web.

---

## BUG 1 — REDIRECTION VERS L'ANCIEN DASHBOARD

PROBLÈME

Lorsque :

- je clique sur le logo
- je me connecte pour la première fois
- je crée un compte

l'application redirige encore vers l'ancien Dashboard du projet précédent.

Le Dashboard LoyalSpin existe déjà mais n'est pas utilisé.

MISSION

Identifier :

- route par défaut
- navigation après login
- navigation après register
- navigation après first login
- navigation après clic sur logo

Corriger pour que :

USER

→ Dashboard LoyalSpin

ADMIN

→ Dashboard Admin LoyalSpin

SUPER_ADMIN

→ Dashboard Global LoyalSpin

sur :

- Android
- iOS
- Web

Aucune redirection vers les anciennes pages.

---

## BUG 2 — CLÉS I18N AFFICHÉES DANS LA NAVIGATION

PROBLÈME

Dans la navbar Web j'obtiens :

```txt
web.history
web.notifications
web.coupons
```

au lieu du texte traduit.

MISSION

Identifier :

- les clés manquantes
- les namespaces manquants
- les erreurs de traduction

Vérifier :

fr.json

en.json

ar.json

Ajouter toutes les clés manquantes.

Corriger les appels :

Mauvais :

t('web.history')

Correct :

clé existante dans les fichiers de traduction.

Plus aucune clé brute affichée dans l'interface.

---

## BUG 3 — PAGE ROULETTE BLANCHE

PROBLÈME

La page Roulette est vide.

J'obtiens une page blanche.

MISSION

Identifier :

- erreur React
- erreur de rendu
- erreur navigation
- erreur composant
- erreur hook
- erreur Redux
- erreur données

Vérifier :

- console Web
- logs Android
- logs iOS

Corriger la cause racine.

La page Roulette doit afficher :

- roulette
- bouton tourner
- récompenses
- niveau fidélité
- historique des gains

sans erreur.

---

## BUG 4 — TEXTES EN DUR

PROBLÈME

Les écrans suivants utilisent encore des textes en dur :

- Roulette
- Notifications
- Purchase History
- Carte Fidélité

MISSION

Faire un audit complet.

Rechercher :

Text

title

placeholder

alert

toast

button

label

subtitle

description

message

Toutes les chaînes doivent être déplacées vers :

fr.json

en.json

ar.json

---

### INTERDIT

Exemple :

```tsx
<Text>Notifications</Text>
```

```tsx
<Button title="Play" />
```

```tsx
<Text>History</Text>
```

---

### OBLIGATOIRE

```tsx
<Text>{t('notifications.title')}</Text>
```

```tsx
<Button title={t('roulette.play')} />
```

```tsx
<Text>{t('history.title')}</Text>
```

---

## VÉRIFICATION I18N

Roulette

- titre
- boutons
- messages
- récompenses
- erreurs

Notifications

- titres
- catégories
- actions

History

- titres
- filtres
- recherche
- résumés

Carte Fidélité

- niveau
- progression
- QR Code
- statistiques

Tout doit être traduit.

---

## LIVRABLE ATTENDU

Fournir :

1. Cause exacte du problème de redirection.
2. Cause exacte de la page blanche Roulette.
3. Liste des clés i18n manquantes.
4. Liste des fichiers modifiés.
5. Corrections appliquées.
6. Vérification Web.
7. Vérification Android.
8. Vérification iOS.

IMPORTANT

Ne pas ajouter de contournement temporaire.

Corriger la cause racine.

Ne pas créer de nouveaux écrans.

Ne pas créer une nouvelle navigation.

Réutiliser les écrans LoyalSpin existants.

Réutiliser les traductions existantes.

Conserver une seule base de code Android / iOS / Web.
