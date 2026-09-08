# JTransport Marketplace — Starter

Starter de développement pour la Marketplace JTransport.

## Objectif
Créer une marketplace transport/logistique où :
- les clients publient des missions ;
- les transporteurs/chauffeurs/prestataires recherchent des missions ;
- les prestataires peuvent faire des offres ;
- les utilisateurs suivent les missions et communiquent ;
- l'administration contrôle les comptes, missions, offres et litiges.

## Stack proposée
- Web : Next.js + TypeScript
- Mobile : Expo React Native + TypeScript
- Backend à connecter : API REST/GraphQL + PostgreSQL
- Authentification : à connecter au fournisseur choisi
- Paiement : à connecter au prestataire de paiement choisi
- Cartographie/tracking : à connecter à un fournisseur cartographique et aux APIs de tracking.

## Démarrage
Le dossier `web` contient une interface web fonctionnelle de démonstration basée sur des données locales.
Le dossier `mobile` contient une base Expo.

Le backend, la base de données, l'authentification réelle, les paiements et les intégrations de tracking doivent être branchés avant production.

## Modules prévus
1. Clients
2. Prestataires
3. Missions
4. Offres
5. Matching
6. Messagerie
7. Réservation
8. Paiement/commissions
9. Tracking
10. Documents
11. Avis
12. Litiges
13. Flotte
14. Administration


## Module supplémentaire
`MODULE_CAPACITE_PROFESSIONNELLE.md` décrit le parcours de création d'entreprise de transport et la marketplace de gestionnaires de transport/qualifications, avec vérification et conformité.

## Facturation et devis

Le module `INTEGRATIONS_FACTURATION_DEVIS.md` définit la stratégie complète pour les devis, factures, avoirs, paiements, facturation électronique, Chorus Pro, Peppol et intégrations avec des plateformes de facturation.

`FACTURATION_DEVIS_CONFIG.json` fournit une configuration initiale destinée à Claude/backend. Le statut « plateforme agréée » doit toujours être vérifié dans la liste officielle DGFiP avant affichage à l'utilisateur.

## Module Dispatcher / livreurs

La version actuelle intègre aussi la conception d'une centrale Dispatcher et d'une application JTransport Driver. Voir :
- `MODULE_DISPATCHER_CENTRALE_LIVRAISON.md`
- `PLATEFORME_WEB_DESKTOP_RESPONSIVE.md`
- `PROCESSUS_GLOBAL_EXPEDITION.md`

Le scénario clé est : entreprise de transport → lot de colis → centrale Dispatcher → tournée → livreur → scans → livraison/POD → suivi temps réel → facturation.

## DOCUMENT CENTRAL

Pour transmettre l'ensemble de la vision à Claude, commencer par lire :
`CAHIER_DES_CHARGES_MASTER_CLAUDE.md`

Puis lire :
- `PROMPT_CLAUDE.md`
- `VISION_GLOBALE_JTRANSPORT.md`
- `MODULE_CAPACITE_PROFESSIONNELLE.md`
- `MODULE_CAPACITE_ET_MARKETPLACE_TRANSPORT_COMPLETE.md`
- `INTEGRATIONS_FACTURATION_DEVIS.md`
- `MODULE_DISPATCHER_CENTRALE_LIVRAISON.md`
- `PROCESSUS_GLOBAL_EXPEDITION.md`
- `PLATEFORME_WEB_DESKTOP_RESPONSIVE.md`

Références visuelles :
- `design/launch/JTransport_UX_Storyboard_Complet.png`
- `design/launch/JTransport_Splash_Loading.png`

Le produit doit gérer à la fois l'offre de transport (capacités disponibles) et la demande de transport (missions), avec matching, contrats, devis, factures, paiements, tracking, dispatching et livraison.

## Référence ajoutée — menu principal et contacts

- `MODULE_MENU_PRINCIPAL_CONTACTS.md` : spécification complète de l'accueil JTransport, navigation, catégories, services, contacts particulier↔entreprise, messagerie, sécurité et API.
- `design/reference-images/JTransport_Menu_Principal_Reference.jpeg` : image de référence fournie pour l'accueil.

## Nouveau module — Expédition internationale complète

Le starter contient désormais la spécification `MODULE_EXPEDITION_CONTAINER_DOUANE_PAIEMENT_TRACKING.md`.

Elle décrit le parcours complet : colis → groupage → conteneur → tracking → douane → documents → frais → paiement → dédouanement → livraison → POD.

Claude doit l'implémenter avec backend, base de données, API, authentification, permissions, persistance, webhooks, notifications, audit et tests. Les intégrations paiement, tracking et douane doivent être abstraites par des adaptateurs.
