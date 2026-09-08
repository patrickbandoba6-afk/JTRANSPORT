# JTransport API

Backend réel (Node.js/TypeScript, Express, Prisma) pour l'authentification, les rôles et la marketplace de missions.

## Démarrage

```bash
cp .env.example .env
npm install
npm run prisma:migrate   # crée prisma/dev.db (SQLite) et applique le schéma
npm run seed              # crée un compte client + transporteur + 1 mission de démo
npm run dev                # http://localhost:4000
```

Comptes de démo créés par `npm run seed` (mot de passe `password123`) :
- `client@jtransport.test` (rôle `PARTICULIER`)
- `transporteur@jtransport.test` (rôle `TRANSPORTEUR`)

## Tests

```bash
npm test
```

Les tests tournent contre `prisma/test.db` (SQLite dédié, recréé à chaque run) — aucune configuration externe requise.

## Passage en production (PostgreSQL)

1. Dans `prisma/schema.prisma`, changer `datasource db { provider = "sqlite" }` en `provider = "postgresql"`.
2. Pointer `DATABASE_URL` vers l'instance Postgres (Render/Neon/Supabase/RDS...).
3. Relancer `npx prisma migrate dev --name init` pour générer une migration Postgres (les migrations SQLite ne sont pas rejouables sur Postgres).
4. Déployer avec le `Dockerfile` fourni (`render.yaml` inclus pour Render — voir les commentaires du fichier).

## Entités couvertes (MVP)

`User, Mission, MissionOffer, MissionEvent`. Le reste des entités listées ci-dessous (Company, Driver, Vehicle, Order, Shipment, Payment, Commission, Payout, Review, Dispute, Notification, Availability, Favorite) suit dans les phases suivantes, module par module, selon le cahier des charges maître (`CAHIER_DES_CHARGES_JTRANSPORT_FINAL_UNIQUE.md` à la racine du projet).

## Règles métier actuelles

- Une mission publiée peut recevoir plusieurs offres.
- Une seule offre peut être acceptée ; les autres offres en attente sont automatiquement rejetées (transaction atomique).
- Une mission attribuée n'accepte plus de nouvelles offres.
- Chaque mission conserve un historique d'événements (`MissionEvent`) pour les changements de statut et les offres.
- RBAC minimal : seul un `TRANSPORTEUR` peut soumettre une offre ; seul le donneur d'ordre (propriétaire de la mission) peut consulter les offres reçues et en accepter une.
- Le JWT est transmis à la fois en cookie `httpOnly` (web) et dans le corps de la réponse (`token`, pour le mobile/Expo qui le stocke via `expo-secure-store`).

## API

| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | non | Créer un compte |
| POST | `/api/auth/login` | non | Connexion |
| POST | `/api/auth/logout` | non | Efface le cookie de session |
| GET | `/api/auth/me` | oui | Profil courant |
| GET | `/api/missions` | non | Recherche/liste (filtres `fromCity`, `toCity`, `vehicleType`, `status`) |
| GET | `/api/missions/:id` | non | Détail d'une mission |
| POST | `/api/missions` | oui | Publier une mission |
| GET | `/api/missions/:id/offers` | oui (propriétaire) | Offres reçues |
| POST | `/api/missions/:id/offers` | oui (`TRANSPORTEUR`) | Faire une offre |
| POST | `/api/missions/:id/offers/:offerId/accept` | oui (propriétaire) | Accepter une offre |
