# JTRANSPORT — MODULE MENU PRINCIPAL + CONTACTS PARTICULIERS / ENTREPRISES

## 1. Objectif

Le menu principal de JTransport doit reprendre la logique de l'écran de référence fourni : une page d'accueil claire, premium, orientée transport/logistique, bleu + blanc, avec accès direct aux fonctions principales.

Référence visuelle : `design/reference-images/JTransport_Menu_Principal_Reference.jpeg`.

Le menu n'est pas une simple maquette : chaque bloc, bouton, recherche, filtre, carte, action et raccourci doit être relié à une vraie route, une vraie API ou une vraie action métier.

## 2. En-tête

Afficher :
- logo JTransport ;
- slogan ;
- notifications avec compteur ;
- avatar + prénom ;
- menu compte ;
- état du compte (Particulier / PRO / Transporteur / Dispatcher / Chauffeur selon rôle).

Recherche globale :
`Rechercher une mission, un prestataire, un transporteur, un service, une capacité, un colis...`

Filtres : pays, ville/zone, date, mode de transport, type de marchandise, capacité, prix, disponibilité, vérification.

## 3. Raccourcis principaux

### Publier une mission
Créer une demande de transport :
- marchandises ;
- voyageurs ;
- colis/palettes ;
- véhicule ;
- fret maritime ;
- fret aérien ;
- fret ferroviaire ;
- multimodal ;
- logistique ;
- import/export ;
- douane/dédouanement.

### Trouver un prestataire
Rechercher et contacter :
- transporteur ;
- chauffeur/livreur ;
- commissionnaire ;
- transitaire ;
- logisticien ;
- entrepôt ;
- manutentionnaire ;
- emballeur ;
- assureur transport ;
- gestionnaire de transport/professionnel qualifié ;
- opérateur maritime/aérien/ferroviaire selon disponibilité.

### Créer mon entreprise de transport
Assistant guidé : activité → pays → exigences → qualifications → documents → professionnels qualifiés si nécessaire → dossier → suivi.

### Mes capacités & offres
Permettre à une personne ou entreprise de publier une capacité matérielle/opérationnelle ou un service :
- véhicule ;
- flotte ;
- capacité cargo ;
- navire/capacité maritime ;
- capacité aérienne ;
- wagon/capacité ferroviaire ;
- capacité multimodale ;
- capacité voyageurs ;
- dernier kilomètre ;
- stockage/logistique.

Pour les activités réglementées, afficher les licences/qualifications/agréments vérifiés et leurs limites. Ne jamais transformer un diplôme en produit à vendre/louer.

## 4. Bandeau international

Bannière d'accueil pour :
- envoyer partout dans le monde ;
- calculer un envoi ;
- choisir air/mer/route/rail ;
- accéder aux services douane et dédouanement ;
- suivre un dossier import/export.

Le bouton « Calculer mon envoi » doit ouvrir le configurateur de devis réel.

## 5. Catégories

Afficher au minimum :
1. Transport de marchandises
2. Transport de voyageurs
3. Fret maritime
4. Fret aérien
5. Fret ferroviaire
6. Transport de véhicules
7. Colis & palettes
8. Douane & dédouanement
9. Import / Export
10. Logistique & entreposage
11. Location / mise à disposition de capacité de transport
12. Toutes les catégories

Les catégories doivent être configurables par l'administration et par pays, sans modifier le code métier.

## 6. Services

Afficher :
- Devis & factures ;
- Contrats & signature ;
- Suivi & tracking ;
- Assurance transport ;
- Gestion des litiges ;
- Documents ;
- Paiements ;
- Import / Export ;
- Douane ;
- Dispatch / centrale ;
- Gestion de flotte et chauffeurs pour les comptes PRO.

## 7. Espace Entreprises

Carte d'accès « Mode PRO » vers :
- missions ;
- commandes ;
- clients ;
- fournisseurs ;
- flotte ;
- chauffeurs ;
- dispatcher/centrale ;
- contrats ;
- factures ;
- paiements ;
- documents ;
- statistiques ;
- API/webhooks ;
- équipe et permissions.

## 8. Navigation mobile

Barre basse :
- Accueil ;
- Rechercher ;
- Nouvelle mission ;
- Mes missions ;
- Messages ;
- Mon compte.

Pour les rôles Dispatcher/Driver, remplacer ou compléter par les accès opérationnels adaptés sans supprimer les fonctions de base.

## 9. Navigation desktop

Menu :
- Accueil
- Rechercher
- Missions
- Publier une mission
- Transport
- Prestataires
- Capacités
- Dispatch / Centrale
- Suivi
- Devis
- Factures
- Contrats
- Documents
- Import / Export
- Douane
- Messages
- Entreprise
- Mon compte
- Support

## 10. CONTACTS — PARTICULIER ↔ ENTREPRISE / PROFESSIONNEL

JTransport doit permettre une mise en relation réelle et simple entre particuliers, entreprises et professionnels.

### Fiche contact publique/professionnelle
Pour une entreprise ou un professionnel qui choisit d'être joignable :
- nom commercial ;
- raison sociale si applicable ;
- e-mail professionnel ;
- numéro de téléphone professionnel ;
- adresse professionnelle ;
- ville/pays ;
- site web si applicable ;
- horaires ;
- langues ;
- services ;
- zones desservies ;
- statut de vérification ;
- avis ;
- bouton « Contacter » ;
- bouton « Appeler » ;
- bouton « E-mail » ;
- bouton « Envoyer une demande » ;
- bouton « Demander un devis ».

### Particulier
Un particulier possède aussi un profil de contact, mais les données personnelles doivent être contrôlées par des paramètres de visibilité.

Par défaut :
- messagerie JTransport disponible ;
- e-mail et téléphone masqués publiquement ;
- adresse résidentielle jamais affichée publiquement par défaut.

Si le particulier choisit de partager certaines coordonnées, afficher uniquement les champs autorisés. L'adresse de livraison/retrait peut être partagée de façon sécurisée avec les acteurs autorisés d'une mission.

### Entreprise ↔ particulier
Le contact peut démarrer :
1. depuis une fiche prestataire ;
2. depuis une mission ;
3. depuis une demande de devis ;
4. depuis un profil entreprise ;
5. depuis la messagerie.

La conversation doit être liée au contexte métier : mission, devis, commande, colis ou contrat.

## 11. Messagerie

Créer une messagerie temps réel ou quasi temps réel :
- conversations 1-to-1 ;
- groupes selon mission ;
- pièces jointes ;
- photos/documents ;
- messages lus/non lus ;
- notifications ;
- blocage/signalement ;
- historique ;
- recherche ;
- conservation selon politique légale.

Un message peut être associé à : `missionId`, `quoteId`, `shipmentId`, `contractId` ou `organizationId`.

## 12. Contacts techniques / modèle de données

Ajouter ou compléter :

```ts
interface ContactProfile {
  id: string;
  userId?: string;
  organizationId?: string;
  type: 'INDIVIDUAL' | 'PROFESSIONAL' | 'COMPANY';
  displayName: string;
  email?: string;
  phone?: string;
  address?: PostalAddress;
  publicEmail: boolean;
  publicPhone: boolean;
  publicAddress: boolean;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  verifiedIdentity: boolean;
}

interface PostalAddress {
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  region?: string;
  countryCode: string;
}

interface Conversation {
  id: string;
  participantIds: string[];
  organizationIds: string[];
  contextType?: 'MISSION' | 'QUOTE' | 'SHIPMENT' | 'CONTRACT' | 'GENERAL';
  contextId?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 13. API minimale

```text
GET    /api/home
GET    /api/search
GET    /api/categories
GET    /api/services
GET    /api/providers/:id
GET    /api/organizations/:id/contact
PATCH  /api/me/contact-visibility
POST   /api/conversations
GET    /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
POST   /api/missions
GET    /api/missions
GET    /api/missions/:id
POST   /api/missions/:id/offers
POST   /api/quotes
POST   /api/quotes/:id/accept
POST   /api/contracts
POST   /api/contracts/:id/sign
POST   /api/shipments/:id/track
```

Tous les endpoints doivent appliquer authentification, RBAC, isolation tenant, validation et audit.

## 14. Exemple de configuration du menu

Le menu doit être piloté par configuration et permissions plutôt que codé en dur :

```ts
const homeActions = [
  { key: 'publish-mission', label: 'Publier une mission', permission: 'mission:create' },
  { key: 'find-provider', label: 'Trouver un prestataire', permission: 'provider:read' },
  { key: 'create-transport-company', label: 'Créer mon entreprise de transport', permission: 'company:onboarding' },
  { key: 'my-capacities', label: 'Mes capacités & offres', permission: 'capacity:manage' },
];
```

Chaque action doit router vers une vraie page et appeler l'API correspondante. Aucun bouton important ne doit être purement décoratif.

## 15. Règles de contact et sécurité

- Vérifier e-mail et téléphone lorsque requis.
- Ne jamais exposer les données privées d'un particulier sans son consentement.
- Les adresses de livraison doivent être accessibles uniquement aux rôles nécessaires à l'exécution.
- Les coordonnées professionnelles peuvent être publiques si le titulaire l'autorise ou si elles sont destinées à l'activité professionnelle.
- Journaliser les changements de visibilité et les accès sensibles.
- Prévoir anti-spam, limitation de fréquence, blocage et signalement.
- Ne jamais stocker de secrets de paiement dans le frontend.

## 16. Critères d'acceptation

- L'accueil correspond visuellement à la référence JTransport fournie.
- Chaque carte/bouton principal ouvre une fonctionnalité réelle.
- La recherche globale fonctionne.
- Un particulier peut publier une mission et contacter un prestataire.
- Une entreprise peut recevoir et répondre à une demande.
- Un professionnel peut afficher ses coordonnées professionnelles selon ses paramètres.
- La messagerie est liée aux missions/devis/contrats lorsque nécessaire.
- Les coordonnées sont protégées selon les permissions.
- Les contacts e-mail/téléphone/adresse sont affichés de manière claire lorsque leur partage est autorisé.
- Le même système fonctionne sur mobile et desktop.
