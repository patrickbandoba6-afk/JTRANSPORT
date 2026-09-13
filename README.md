# JTransport - Plateforme de Transport et Logistique

JTransport est une application mobile compl�te de marketplace pour tous les domaines du transport et de la logistique.

## ?? Fonctionnalit�s Principales

### ?? Gestion des Colis et Envois
- Cr�ation et suivi de colis avec codes de suivi uniques
- Modes : Routier, Maritime, A�rien, Ferroviaire, Multimodal
- Types de cargo : Colis, Marchandise, V�hicules, Conteneurs
- Historique immuable avec tra�abilit� compl�te

### ?? Douane et International
- Configuration flexible des exigences douani�res
- Gestion des frais (estim�s vs officiels)
- Support des codes HS et incoterms

### ?? Gestion des Utilisateurs
- 3 types de comptes : Particulier, Professionnel/Entreprise, Transporteur
- R�les : Administrateur, Dispatcher, Chauffeur
- Authentification JWT s�curis�e
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

## ?? S�curit�
- JWT authentification
- RBAC
- Validation c�t� serveur
- Historique immuable

## ?? Contact
patrickbandoba6@gmail.com

**Statut :** ?? En d�veloppement actif

## Sauvegarde automatique

Toute modification faite sur ce projet via l'assistant est automatiquement
committée et poussée sur ce dépôt GitHub (`origin/main`) — aucune action
manuelle n'est nécessaire pour que les nouveautés soient enregistrées ici,
même si l'ordinateur s'éteint juste après.
