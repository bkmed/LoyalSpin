# ✅ TODO LIST - Refonte complète de l'application

## 🔴 Super Admin

### Dashboard
- [ ] Supprimer **Accueil Admin** du menu.
- [ ] Refaire complètement le Dashboard Super Admin.
- [ ] Ajouter des statistiques globales.
- [ ] Ajouter une navigation dédiée au Super Admin.

### Gestion des projets
- [ ] Créer un projet.
- [ ] Modifier un projet.
- [ ] Supprimer un projet.
- [ ] Activer/Désactiver un projet.
- [ ] Associer automatiquement un Admin au projet.
- [ ] Gérer l'état du paiement (Payé / En attente / Expiré).
- [ ] Gérer la date d'expiration.
- [ ] Ajouter le renouvellement d'abonnement.
- [ ] Afficher la liste des projets.

### Configuration du projet
- [ ] Configurer le titre.
- [ ] Configurer le logo.
- [ ] Configurer la description.
- [ ] Configurer l'adresse.
- [ ] Configurer Google Maps.
- [ ] Configurer Facebook.
- [ ] Configurer Instagram.
- [ ] Configurer TikTok.
- [ ] Configurer le site Web.
- [ ] Configurer le téléphone.
- [ ] Configurer l'email.

### Gestion des Admins
- [ ] Créer un Admin.
- [ ] Modifier un Admin.
- [ ] Désactiver un Admin.
- [ ] Supprimer un Admin.
- [ ] Réinitialiser le mot de passe.
- [ ] Un Admin = un seul projet.

### Gestion des Users
- [ ] Voir tous les Users.
- [ ] Filtrer par projet.
- [ ] Filtrer par statut.
- [ ] Filtrer par date.
- [ ] Bloquer/Débloquer un User.

### Configuration Roulette
- [ ] Supprimer la configuration actuelle.
- [ ] Corriger toute la logique de configuration.
- [ ] Le Super Admin sélectionne un projet avant toute configuration.
- [ ] Configurer le nombre de cases.
- [ ] Configurer les cadeaux.
- [ ] Configurer les probabilités.
- [ ] Configurer les couleurs.
- [ ] Configurer les textes.
- [ ] Configurer les images.
- [ ] Configurer les icônes.
- [ ] Configurer les animations.
- [ ] Configurer les sons.
- [ ] Configurer les limites de participation.
- [ ] Sauvegarder toute la configuration en base.

### Configuration Sticker
- [ ] Créer une vraie interface.
- [ ] Configurer les modèles.
- [ ] Configurer les images.
- [ ] Configurer les couleurs.
- [ ] Configurer les textes.
- [ ] Configurer le QR Code.
- [ ] Activer/Désactiver.
- [ ] Gérer l'expiration.

### Paramètres globaux
- [ ] Remplacer la valeur fixe **200** par un paramètre configurable.
- [ ] Supprimer toutes les valeurs codées en dur.
- [ ] Ajouter une page "Configuration globale".

### Profil Super Admin
- [ ] Modifier le profil.
- [ ] Modifier la photo.
- [ ] Modifier le nom.
- [ ] Modifier l'email.
- [ ] Modifier le téléphone.
- [ ] Modifier le mot de passe.
- [ ] Ajouter les paramètres du compte.

---

# 🔵 Authentification

- [ ] Supprimer les faux boutons de connexion sociale.
- [ ] Implémenter une vraie authentification Google.
- [ ] Implémenter une vraie authentification Facebook.
- [ ] Implémenter une vraie authentification Apple (iOS).
- [ ] Implémenter TikTok si disponible.
- [ ] Implémenter Instagram (si techniquement possible via Meta).
- [ ] Ajouter l'inscription.
- [ ] Ajouter la connexion.
- [ ] Ajouter "Mot de passe oublié".
- [ ] Ajouter la vérification de l'email.

---

# 🟢 Admin

## Dashboard
- [ ] Supprimer complètement l'ancien Dashboard.
- [ ] Créer un Dashboard dédié à l'Admin.
- [ ] L'Admin ne doit voir que son projet.

## Gestion du projet
- [ ] Modifier le titre.
- [ ] Modifier le logo.
- [ ] Modifier la description.
- [ ] Modifier l'adresse.
- [ ] Modifier Google Maps.
- [ ] Modifier Facebook.
- [ ] Modifier Instagram.
- [ ] Modifier TikTok.
- [ ] Modifier le téléphone.
- [ ] Modifier l'email.
- [ ] Modifier les horaires.

## Gestion Roulette
- [ ] Refaire entièrement la page.
- [ ] Configurer les cadeaux.
- [ ] Configurer les probabilités.
- [ ] Configurer les couleurs.
- [ ] Configurer les images.
- [ ] Configurer les textes.
- [ ] Configurer les animations.
- [ ] Configurer les sons.
- [ ] Configurer le nombre de cases.
- [ ] Activer/Désactiver la roulette.
- [ ] Historique des modifications.

## Gestion Sticker
- [ ] Refaire complètement la page.
- [ ] Ajouter une configuration fonctionnelle.
- [ ] Sauvegarder les paramètres.

## Gestion Coupons
- [ ] Créer un coupon.
- [ ] Modifier un coupon.
- [ ] Supprimer un coupon.
- [ ] Activer/Désactiver.
- [ ] Définir la période de validité.
- [ ] Définir la quantité disponible.
- [ ] Définir la limite par utilisateur.

## Gestion des Users
- [ ] Voir uniquement les Users du projet.
- [ ] Voir les coupons attribués.
- [ ] Voir la date d'attribution.
- [ ] Voir la date d'expiration.
- [ ] Voir si le coupon est utilisé.
- [ ] Voir l'historique des gains.
- [ ] Voir l'historique des spins.

---

# 🟡 User

## Fonctionnalités

- [ ] Ajouter un scanner QR Code.
- [ ] Ouvrir automatiquement le bon projet après le scan.
- [ ] Charger les informations du projet.
- [ ] Accéder directement au Dashboard Client.

---

# 🟣 Dashboard Client (B2C)

## Nouveau Dashboard
- [ ] Créer un Dashboard Client distinct du Dashboard Admin.
- [ ] Chaque projet possède son Dashboard Client.
- [ ] Dashboard entièrement configurable par l'Admin.

## Interface
- [ ] Logo.
- [ ] Bannière.
- [ ] Couleurs personnalisées.
- [ ] Description.
- [ ] QR Code.
- [ ] Bouton Spin.
- [ ] Historique.
- [ ] Cadeaux gagnés.

## Avant le Spin
- [ ] Mode sans connexion.
- [ ] Mode avec connexion.
- [ ] Choix du mode par l'Admin.

## Connexion
- [ ] Google.
- [ ] Facebook.
- [ ] Apple.
- [ ] TikTok.
- [ ] Instagram (si disponible).

## Après le Spin
- [ ] Afficher un message personnalisé.
- [ ] Redirection Google Review.
- [ ] Redirection Facebook.
- [ ] Redirection Instagram.
- [ ] Redirection TikTok.
- [ ] Redirection Site Web.
- [ ] Afficher un coupon.
- [ ] Télécharger un coupon.
- [ ] Envoyer le coupon par email.
- [ ] Toutes les actions doivent être configurables par projet.

---

# ⚙️ Base de données

- [ ] Revoir complètement le schéma.
- [ ] Créer la relation SuperAdmin → Project → Admin → Users.
- [ ] Ajouter la table Roulette.
- [ ] Ajouter la table Sticker.
- [ ] Ajouter la table Coupons.
- [ ] Ajouter la table Spin History.
- [ ] Ajouter la table Rewards.
- [ ] Ajouter la table Payments.
- [ ] Ajouter la table Settings.
- [ ] Normaliser toutes les relations.

---

# 🛠️ Technique

- [ ] Nettoyer le code hérité d'anciens projets.
- [ ] Supprimer les pages inutiles.
- [ ] Supprimer les fonctionnalités mortes.
- [ ] Supprimer les données mockées.
- [ ] Architecture modulaire.
- [ ] Composants réutilisables.
- [ ] Validation des formulaires.
- [ ] Gestion complète des erreurs.
- [ ] Gestion des permissions par rôle.
- [ ] API sécurisée.
- [ ] Responsive Web/Mobile.
- [ ] UX/UI moderne.
- [ ] Aucune page vide.
- [ ] Toutes les fonctionnalités doivent être réellement implémentées et connectées à la base de données.
- [ ] Vérifier que l'ensemble du parcours fonctionne de bout en bout (Super Admin → Admin → User → Dashboard Client).