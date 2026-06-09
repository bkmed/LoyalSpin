# LoyalSpin

Ben Khedher Mohamed - LoyalSpin React React native
 [This is the link to my LoyalSpin](https://bkmed.github.io/LoyalSpin/)

# 🚀 Mohamed Ben Khedher | Full-Stack & Mobile Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ben-khedher-mohamed-78aa1510a/)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github)](https://github.com/bkmed)
[![Portfolio](https://img.shields.io/badge/Live-Portfolio-success?style=flat-square)](https://bkmed.github.io/Portfolio/)

# LoyaltySpin

## Overview

LoyaltySpin is a cross-platform loyalty and rewards platform built with React Native and React Native Web.

The platform allows businesses to engage customers through promotional campaigns, reward systems, coupons, and a configurable lucky wheel experience.

The application supports:

* iOS
* Android
* Web

using a shared codebase.

---

# Features

## Customer Features

* User registration
* User authentication
* Profile management
* Lucky wheel participation
* Coupon management
* Purchase history
* Notifications
* Marketplace access
* Services directory
* Gallery access
* Multi-language support

## Administrator Features

* User management
* Coupon management
* Lucky wheel management
* Analytics dashboard
* Announcements management
* Categories management
* Services management
* Gallery management
* Zone management
* Settings management

## Super Administrator Features

* Full platform access
* Admin management
* Global configuration
* Global analytics
* Role and permission management

---

# Technology Stack

## Frontend

* React Native
* React Native Web
* TypeScript

## State Management

* Redux Toolkit

## Backend Services

* Firebase

## Internationalization

* i18next

## Analytics

* Firebase Analytics

---

# Project Structure

```text
src/
├── components/
├── config/
├── context/
├── database/
├── features/
│   └── loyalspin/
│       ├── components/
│       ├── screens/
│       └── utils/
├── i18n/
├── navigation/
├── screens/
├── services/
├── store/
├── theme/
├── types/
└── utils/
```

---

# LoyaltySpin Feature Structure

All LoyaltySpin developments must follow the existing project architecture.

```text
src/features/loyalspin/
├── components/
├── screens/
└── utils/
```

## Components

Reusable UI components.

```text
src/features/loyalspin/components/
```

Examples:

* FooterLinks
* WebNavbar
* ProductDetailModal
* LogoSVG

## Screens

Feature screens.

```text
src/features/loyalspin/screens/
```

Examples:

* HomeScreen
* MarketplaceScreen
* ServicesScreen
* GalleryScreen
* ProfileScreen
* AdminDashboard
* AdminRoulette
* AdminUsers
* AdminAnalyticsScreen

## Utilities

Feature-specific helper functions.

```text
src/features/loyalspin/utils/
```

---

# User Roles

## Super Admin

Permissions:

* Manage administrators
* Manage users
* Manage zones
* Manage categories
* Manage services
* Manage announcements
* Manage rewards
* Manage galleries
* Manage lucky wheel campaigns
* Manage platform settings
* Access global analytics

---

## Admin

Permissions:

* Dashboard access
* User management
* Announcement management
* Category management
* Service management
* Gallery management
* Lucky wheel management
* Coupon management
* Analytics access
* Profile management

Restrictions:

* No access to super admin features
* No access to global platform settings

---

## Customer

Permissions:

* Registration
* Login
* Profile management
* Lucky wheel participation
* Coupon access
* Marketplace access
* Services access
* Gallery access
* Notifications
* Purchase history

Restrictions:

* No administrative access

---

# Development Rules

## Mandatory

* TypeScript
* React Native
* React Native Web
* Redux Toolkit
* Existing Firebase configuration
* Existing i18n configuration

---

## Architecture Rules

Always respect the existing project structure.

Do not create a new architecture.

Do not move existing files unless explicitly required.

---

## Cross Platform Rules

Every feature must work on:

* iOS
* Android
* Web

using a single implementation.

---

## Forbidden

Do not create:

```text
*.web.tsx
*.web.ts
*.native.tsx
*.native.ts
```

for new LoyaltySpin developments.

Do not duplicate code between mobile and web.

Do not create separate implementations for each platform.

---

## UI Rules

Use only React Native components:

* View
* Text
* Image
* Pressable
* TouchableOpacity
* ScrollView
* FlatList
* Modal
* SafeAreaView
* TextInput

Avoid HTML elements.

---

# Internationalization

All user-facing strings must be translated using the existing i18n system.

Supported languages:

* English
* French
* Arabic
* Spanish
* German
* Italian
* Turkish
* Hindi
* Chinese

Translation files are located in:

```text
src/i18n/locales/
```

---

# State Management

Redux store location:

```text
src/store/
```

Redux slices:

```text
src/store/slices/
```

Create a new slice only when necessary.

Example:

```text
src/store/slices/loyalSpinSlice.ts
```

---

# Services

Shared services are located in:

```text
src/services/
```

Examples:

* authService
* analyticsService
* notificationService
* emailService

Create additional services only when required.

---

# Navigation

Navigation files:

```text
src/navigation/
```

Any new route must integrate with the existing navigation architecture.

---

# Quality Standards

* TypeScript strict typing
* Reusable components
* Responsive design
* ESLint compliant
* Prettier compliant
* Production-ready code
* No duplicated business logic

---

# Build Targets

Supported platforms:

* Web
* Android
* iOS

Single codebase strategy.

---

# License

Private project.
All rights reserved.


**LoyalSpin Tunisie** is a premium business showcase and second-hand plumbing parts marketplace. It allows customers to view plumbing, heating, gas, and AC services in Tunisia (Grand Tunis and Sahel), request emergency interventions via an interactive coverage zone map, browse and save second-hand plumbing parts, and contact sellers directly via phone or WhatsApp. It also features a fully functional administration panel for managing announcements, categories, user roles, and viewing analytics.

## Key Features

### Premium Web Client Showcase
- **Accueil (Home)**: High-impact hero banner, emergency support links, technical expertise quick views, a preview grid of featured second-hand parts, and trust metrics.
- **Services**: In-depth description of technical services (Plomberie, Climatisation, Gaz de ville, Chauffage central) with reusable SVG `ServiceIcon` visuals, before/after comparison grids, and direct quote requests.
- **Zone d'intervention (Coverage Zones)**: Interactive Tunisia coverage zone map with an SVG/CSS mockup. Users can check covered regions (Tunis, Sousse, Sfax, Monastir, Ariana, Ben Arous) and submit quick emergency intervention forms.
- **Pièces d'occasion (Used Parts Marketplace)**: Comprehensive marketplace for refurbished plumbing parts with category/condition filters, maximum price sliders, sorting, and direct action triggers ("📞 Appeler" / "💬 WhatsApp").
- **Profil (Profile Settings)**: Form to view/update profile settings, password management, and a dedicated favorite items manager. Invites guests to sign up or sign in.
- **Paiement (Online Payment - Coming Soon)**: Visual checkout mockup highlighting upcoming integrations with local secure payment methods (ClicToPay / Sobflous).

### Administration Dashboard
- **Accueil (Overview)**: Summary metrics (listings, categories, active users, inquiries) and recent system activity logs.
- **Gestion annonce (Announcements CRUD)**: Full management panel to publish, modify, or delete used part listings, modify availability/featured status, and update details.
- **Gestion catégorie**: Dynamic category creation, modification, and removal tool synced to the Redux store.
- **Gestion user**: Management table listing all registered users with administrative actions to toggle roles (user/admin) or suspend/restore accounts.
- **Profil**: Administrator profile page for security, credential settings, editable public site title, years of experience, email/support WhatsApp contact details, and client-side validation.
- **Analytics**: Dashboard charts representing monthly revenue splits, category distribution, service volumes, regional performance, stock alerts, response times, open leads, average basket, and conversion rate.

### Web Translation Keys
- Local web navigation strings in `AppNavigator.web.tsx` now include `nos_services`, `nos_services_subtitle`, `voir_tout`, `services_title`, `services_subtitle`, `view_all`, `admin_edit_email`, and `admin_edit_phone`.
- Shared locale files also expose these values under `webServices` and `admin` for FR/EN translation coverage.

## Architecture Target

- **Single app codebase**: React Native + React Native Web. Web and mobile should share screens, Redux slices, validation helpers, and UI components.
- **No monolith screens**: new or refactored files should stay under 300 lines. Large views must be split into sections, cards, forms, hooks, and data modules.
- **Redux as source of truth**: auth session, users, listings, categories, favorites, wallet data, settings, public business name, years of experience, admin email, and support WhatsApp should be persisted through Redux Toolkit + redux-persist.
- **Platform-specific code stays thin**: web/mobile differences belong in shell/navigation wrappers, not in duplicated business logic.
- **Cleanup rule**: remove unused old screens, duplicate local state, dead helpers, and web-only mock logic once shared replacements exist.

## Current Migration Notes

- The current web showcase is functional but still resolves through `AppNavigator.web.tsx`.
- Web auth/demo sessions now sync to Redux auth persistence so refresh does not disconnect the user.
- The next target is splitting services, zones, marketplace, admin profile, analytics, auth, and shell layout into shared React Native components.

## Tech Stack

- **Framework**: React 19 + React Native 0.82 + React Native Web
- **State Management**: Redux Toolkit + redux-persist
- **Routing & Flow**: React Navigation with platform-aware shell wrappers
- **Styling**: NativeWind/Tailwind utility classes
- **Development Tooling**: Webpack 5, TypeScript 5, ESLint, Prettier.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Running the Web Application

To run the application locally on the webpack-dev-server:

```bash
npm run start-web-dev-nossr
```

The application will be accessible at `http://localhost:8002/`.

### Running Lint Verification

```bash
npm run lint
```

## Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| Admin | `admin@demo.com` | `admin123` |
| User | `user@demo.com` | `user123` |

## License

MIT
