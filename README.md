# JTransport - Plateforme de Transport et Logistique

JTransport est une application mobile complète de marketplace pour tous les domaines du transport et de la logistique.

## ?? Fonctionnalités Principales

### ?? Gestion des Colis et Envois
- Création et suivi de colis avec codes de suivi uniques
- Modes : Routier, Maritime, Aérien, Ferroviaire, Multimodal
- Types de cargo : Colis, Marchandise, Véhicules, Conteneurs
- Historique immuable avec traçabilité complète

### ?? Douane et International
- Configuration flexible des exigences douanières
- Gestion des frais (estimés vs officiels)
- Support des codes HS et incoterms

### ?? Gestion des Utilisateurs
- 3 types de comptes : Particulier, Professionnel/Entreprise, Transporteur
- Rôles : Administrateur, Dispatcher, Chauffeur
- Authentification JWT sécurisée
- RBAC (Role-Based Access Control)

## ?? Stack Technologique

**Frontend:** React Native + Expo + TypeScript
**Backend:** Node.js + Express + Prisma + SQLite
**Testing:** Vitest + Supertest

## ?? Installation

### Backend
```bash
cd app/backend
npm install
npx prisma db push
npm run dev
```

### Mobile
```bash
cd app/mobile
npm install
npx expo start
```

## ?? Tests
```bash
cd app/backend
npm test
```
? 88 tests passants

## ?? Sécurité
- JWT authentification
- RBAC
- Validation côté serveur
- Historique immuable

## ?? Contact
patrickbandoba6@gmail.com

**Statut :** ?? En développement actif
