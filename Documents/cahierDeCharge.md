Cahier des charges – LoyaltySpin
1. Présentation

LoyaltySpin est une plateforme de fidélisation permettant aux clients de gagner des récompenses via une roue de la fortune, des coupons, des offres promotionnelles et un système de gestion administrateur.

L'application doit fonctionner sur :

Web
Android
iOS

Avec une seule base de code React Native + React Native Web.

2. Objectifs
Pour les entreprises
Fidéliser les clients.
Distribuer des coupons promotionnels.
Augmenter les ventes.
Analyser les performances marketing.
Gérer les récompenses et campagnes.
Pour les clients
Participer à des tirages.
Gagner des coupons.
Consulter les promotions.
Accéder aux partenaires.
Gérer leur profil.
3. Rôles utilisateurs
Super Admin

Accès total à la plateforme.

Permissions
Gestion des administrateurs
Gestion des utilisateurs
Gestion des zones
Gestion des catégories
Gestion des services
Gestion des annonces
Gestion des récompenses
Gestion de la galerie
Gestion des paramètres globaux
Consultation des statistiques globales
Gestion des campagnes roulette
Gestion des droits d'accès
Suppression de tout contenu
Admin

Gestion de son espace métier.

Permissions
Dashboard
Gestion des utilisateurs de sa zone
Gestion des annonces
Gestion des catégories
Gestion des services
Gestion galerie
Gestion roulette
Gestion coupons
Consultation statistiques
Gestion profil
Gestion paramètres
Restrictions
Pas d'accès aux Super Admins
Pas d'accès aux paramètres système globaux
Utilisateur / Client

Compte client classique.

Permissions
Connexion
Inscription
Modifier profil
Consulter annonces
Consulter services
Consulter galerie
Participer à la roulette
Consulter coupons gagnés
Historique des gains
Notifications
Gestion langue
Restrictions
Aucun accès administration
4. Modules fonctionnels
Authentification
Fonctionnalités
Inscription
Connexion
Déconnexion
Mot de passe oublié
Réinitialisation mot de passe
Profil
Fonctionnalités
Modifier informations
Modifier photo
Changer mot de passe
Historique participation
Historique gains
Dashboard Admin
Indicateurs
Nombre utilisateurs
Nombre participations
Nombre coupons distribués
Nombre récompenses utilisées
Activité récente
Roulette
Fonctionnalités
Affichage roue
Animation
Tirage aléatoire
Récompenses configurables
Limite quotidienne
Historique participation
Vérification éligibilité
Coupons
Fonctionnalités
Génération coupon
QR Code
Code unique
Date expiration
Statut utilisé/non utilisé
Marketplace
Fonctionnalités
Liste produits
Recherche
Filtre catégories
Détail produit
Services
Fonctionnalités
Liste services
Recherche
Filtres
Galerie
Fonctionnalités
Photos
Vidéos
Albums
Notifications
Fonctionnalités
Push mobile
Notifications web
Historique notifications
Zones
Fonctionnalités
Création zone
Modification zone
Affectation utilisateurs
Catégories
Fonctionnalités
CRUD catégories
Annonces
Fonctionnalités
Création
Modification
Publication
Archivage
Analytics
KPIs
Utilisateurs actifs
Participations roulette
Récompenses distribuées
Récompenses utilisées
Taux conversion
Répartition géographique
5. Structure technique à respecter
src/features/loyalspin/
├── components/
├── screens/
└── utils/

Tous les écrans :

src/features/loyalspin/screens

Tous les composants :

src/features/loyalspin/components

Tous les helpers :

src/features/loyalspin/utils
6. Contraintes techniques
Obligatoire
React Native
React Native Web
TypeScript
Redux existant
Firebase existant
i18n existant
Interdit
Créer une nouvelle architecture
Créer des fichiers .web.tsx
Créer des fichiers .native.tsx
Dupliquer le code mobile/web
Utiliser des balises HTML
Composants autorisés
View
Text
Image
Pressable
FlatList
ScrollView
Modal
SafeAreaView
TextInput
7. Écrans existants
Administration
AdminDashboard
AdminAnalyticsScreen
AdminUsers
AdminCategories
AdminServicesEditor
AdminGalleryEditor
AdminRoulette
AdminAnnonces
AdminSettings
AdminManage
AdminSticker
AdminProfileScreen
SuperAdminDashboard
Utilisateur
HomeScreen
MarketplaceScreen
ServicesScreen
GalleryScreen
NotificationsScreen
ProfileScreen
PurchaseHistory
CouponMobile
UserDashboardMobile
Auth
WebAuthScreen
Système
LegalPages
ZonesScreen