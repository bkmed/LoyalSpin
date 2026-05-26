# LoyalSpin Tunisie

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
