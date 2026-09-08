# JTRANSPORT — CAHIER DES CHARGES FINAL UNIQUE

**Version finale consolidée — toutes les demandes, fonctions, règles, parcours, interfaces et exigences JTransport regroupées dans un seul document de référence pour l'implémentation.**

> **Document maître :** Claude doit considérer ce document comme la source fonctionnelle principale. Les autres fichiers du dossier sont des annexes techniques, historiques ou des ressources de code/design. En cas de doublon, ce document et les spécifications JSON les plus récentes priment.

## 0. INSTRUCTION ABSOLUE

Construire JTransport comme une véritable plateforme de transport et de logistique, fonctionnelle sur mobile et ordinateur. Ne pas livrer une simple maquette. Chaque fonction visible doit être reliée à une interface, un état métier, une API, une persistance, des validations, des permissions, une gestion d'erreur et des tests lorsque cela s'applique.

JTransport doit couvrir l'ensemble du cycle : recherche, publication de missions, offre de capacité, transport de marchandises et voyageurs, fret routier/maritime/aérien/ferroviaire/multimodal, véhicules, collecte, livraison, groupage, conteneurs, tracking, import/export, douane, dédouanement, documents, devis, contrats, signature, facturation, paiement, dispatcher, chauffeurs/livreurs, preuve de livraison, litiges, avis et assistance.

## 1. VISION ET PÉRIMÈTRE

JTransport est un guichet unique numérique du transport, de la logistique, du fret et des opérations d'import/export. Il met en relation particuliers, entreprises, donneurs d'ordre, transporteurs, chauffeurs, dispatchers, centrales, logisticiens, transitaires, commissionnaires, gestionnaires de transport, entrepôts et autres prestataires autorisés.

Objectif UX : **« Tout mon transport est au même endroit. »**

L'utilisateur doit pouvoir organiser son opération sans devoir refaire son dossier sur plusieurs applications : créer une mission, trouver un prestataire, proposer une capacité, obtenir un devis, signer, payer, déposer des documents, suivre le colis ou conteneur, gérer la douane, recevoir la livraison et retrouver ses factures.

## 2. DOMAINES DE TRANSPORT

### 2.1 Marchandises
- colis ; palettes ; lots ; groupage ; lots complets ; messagerie ; express ; transport spécialisé selon réglementation.

### 2.2 Voyageurs
- transport de personnes et prestations voyageurs ; recherche de professionnels adaptés ; missions et contrats associés.

### 2.3 Fret
- routier ; maritime ; aérien ; ferroviaire ; multimodal.

### 2.4 Véhicules
- voitures ; utilitaires ; camions ; motos ; autres véhicules autorisés.

### 2.5 Logistique
- collecte ; livraison ; stockage ; entreposage ; manutention ; emballage ; assurance ; frais de terminal/port/aéroport/gare ; carburant/péages selon contrat ; documents ; douane ; dédouanement ; livraison finale.

## 3. MENU PRINCIPAL — RÉFÉRENCE VISUELLE

Le menu principal doit reprendre la structure et l'esprit de la référence fournie par le client :
`app/design/reference-images/JTransport_Menu_Principal_Reference.jpeg`

Style : bleu + blanc, premium, moderne, lisible, professionnel et exclusivement orienté transport/logistique. Aucun rayon de marketplace généraliste (mode, vêtements, téléphones, alimentation, électroménager, etc.) ne doit apparaître.

### En-tête
- logo JTransport ;
- notifications ;
- profil/compte ;
- recherche globale ;
- filtres.

### Raccourcis principaux
- Publier une mission ;
- Trouver un prestataire ;
- Créer mon entreprise de transport ;
- Mes capacités & offres.

### Catégories
- Transport de marchandises ;
- Transport de voyageurs ;
- Fret maritime ;
- Fret aérien ;
- Fret ferroviaire ;
- Transport de véhicules ;
- Colis & palettes ;
- Douane & dédouanement ;
- Import / Export ;
- Logistique & entreposage ;
- Mise à disposition / location de capacité de transport ;
- Toutes les catégories.

### Services
- Devis & factures ;
- Contrats & signature ;
- Suivi & tracking ;
- Assurance transport ;
- Gestion des litiges ;
- Assistance.

### Navigation mobile
- Accueil ; Rechercher ; Nouvelle mission ; Mes missions ; Messages ; Mon compte.

**Exigence :** chaque bouton, carte, catégorie et raccourci doit être fonctionnel et mener vers une route ou une action réelle. Aucun élément important ne doit être décoratif.

## 4. RECHERCHE GLOBALE

Rechercher missions, transporteurs, chauffeurs, prestataires, commissionnaires, transitaires, logisticiens, capacités, colis, palettes, véhicules, conteneurs, devis, factures, contrats et services.

Filtres : pays, ville, route, date, mode, poids, volume, véhicule, prix, disponibilité, vérification, notation, assurance et statut.

## 5. MARKETPLACE — BESOIN ET OFFRE DE CAPACITÉ

Deux sens obligatoires :
1. un client/donneur d'ordre publie une mission et cherche un prestataire ;
2. un transporteur/professionnel publie sa capacité disponible et cherche des missions.

Le matching tient compte de la localisation, route, disponibilité, véhicule, capacité, poids, volume, prix, notation, vérification, expérience, historique, contraintes, assurance et conformité. Afficher un score de compatibilité et les raisons du classement.

Prévoir recherche, publication, offres, contre-offres, favoris, messagerie, réservation, paiement, notation, litiges et annulation.

## 6. CAPACITÉ PROFESSIONNELLE ET CRÉATION D'ENTREPRISE

Entrée : **« Je veux créer mon entreprise de transport »**.

Activités : marchandises, voyageurs, commissionnaire, logistique, international, maritime, aérien, ferroviaire et autres activités réglementées selon pays.

Si l'utilisateur ne possède pas la qualification requise, JTransport doit l'orienter vers les démarches officielles, formations/examens et, lorsque légalement possible, vers un professionnel qualifié/gestionnaire de transport.

**Règle juridique :** ne jamais présenter un diplôme, une capacité ou une licence comme une marchandise librement louable/vendable. Le marketplace doit être une mise en relation avec des professionnels qualifiés et des services conformes à la réglementation applicable.

Profils vérifiés : identité, entreprise, qualification/licence/certificat/agrément, autorité émettrice, référence, dates, expérience, zone, disponibilité, limites réglementaires, documents.

Prévoir vérification automatique/manuelle, expiration, suspension, signalement, audit, détection de doublons et lutte contre faux documents.

## 7. CONTRATS ET SIGNATURE

Types : transport, sous-traitance, prestation logistique, mise à disposition de capacité, gestionnaire de transport, mission, contrat cadre, ordre de transport, multimodal.

Workflow : modèle → préremplissage → conditions → devis → acceptation → signature électronique adaptée → horodatage/audit → archivage → renouvellement/résiliation.

Conserver versions, permissions, historique et alertes. Ne pas prétendre à une validité juridique particulière sans intégration et conformité appropriées.

## 8. CONTACT PARTICULIER ↔ ENTREPRISE / PROFESSIONNEL

Le contact doit être possible depuis un profil, une mission, un devis, une commande, une expédition ou un contrat.

### Entreprise/professionnel
Avec partage autorisé : nom, e-mail professionnel, téléphone professionnel, adresse professionnelle, ville/pays, horaires, services, zones desservies et statut de vérification.

Actions : Contacter, Appeler, E-mail, Demander un devis, Envoyer une demande.

### Particulier
Messagerie JTransport disponible. E-mail, téléphone et adresse résidentielle non publiés par défaut. Le particulier choisit ce qu'il partage. Les adresses nécessaires à l'exécution d'une mission sont transmises seulement aux acteurs autorisés.

Messagerie : pièces jointes, notifications, historique, signalement, anti-spam, rate limiting et audit des accès.

## 9. EXPÉDITION INTERNATIONALE DE BOUT EN BOUT

Parcours :
**création → collecte/dépôt → réception → scan → groupage → conteneur → chargement/scellage → départ → transit → arrivée → dossier douanier → documents → frais → paiement → dédouanement → libération → dernier kilomètre → livraison → preuve de livraison → clôture.**

Un utilisateur peut gérer depuis son compte tous ses colis, lots, conteneurs, documents, frais, paiements, messages, incidents, statuts et preuves de livraison.

### Compte personnel
- Mes colis ;
- Mes expéditions ;
- Mes conteneurs ;
- Suivi ;
- Documents ;
- Frais à payer ;
- Paiements ;
- Factures ;
- Messages ;
- Assistance ;
- Litiges.

### Tracking
Timeline + carte avec événements réellement reçus, dernière position connue, lieux, date/heure et ETA lorsqu'elle est disponible. Ne jamais inventer une position, une ETA ou un événement. Utiliser des adaptateurs et webhooks partenaires.

## 10. CONTENEURS ET MARITIME

Support FCL/LCL, 20ft, 40ft, 40HC et types configurables.

Données : numéro conteneur, colis/lots, scellé, poids, volume, remplissage, port départ/arrivée, terminal, compagnie maritime, navire/voyage si connu, ETD/ETA, transbordements, événements, connaissement, frais, douane et livraison finale.

## 11. FRET AÉRIEN

Devis, poids réel, poids volumétrique, aéroport origine/destination, réservation, documents, tracking, douane et livraison finale.

## 12. FRET FERROVIAIRE ET MULTIMODAL

Itinéraires, capacité, wagons/conteneurs, réservation, correspondances, tracking, documents, coûts et livraison finale.

## 13. DOUANE ET DÉDOUANEMENT

`CustomsCase` : expéditeur, destinataire, origine, destination, marchandises, quantité, poids, volume, valeur déclarée, emballage, code HS si connu, Incoterm, mode de transport, déclarant/transitaire, références, statut, documents, frais, paiements et historique.

Fonctions : dépôt de documents, contrôle des pièces manquantes, alertes, transmission aux acteurs autorisés, suivi du traitement et conservation des preuves.

Les estimations doivent être clairement distinguées des montants officiels. Les règles et calculs doivent être configurables par pays et connectés aux sources/autorités compétentes lorsque disponibles.

## 14. PAIEMENT DIRECT DANS L'APPLICATION

Le client peut payer les montants effectivement facturés et rendus payables via JTransport : transport, fret, manutention, stockage, assurance, frais de dossier, frais portuaires refacturés, dédouanement et droits/taxes lorsque le mécanisme est disponible, livraison finale et autres frais autorisés.

Prévoir carte, virement, portefeuille selon disponibilité, paiement marketplace/séquestre lorsque approprié, PaymentIntent, confirmation serveur, webhooks, idempotence, action requise, échecs, remboursements, paiements partiels, reversements, commissions, réconciliation, reçus et factures.

Ne jamais stocker les données bancaires sensibles dans le frontend.

## 15. DOCUMENTS ET PAPERASSE

Coffre documentaire privé par dossier : facture commerciale/proforma, packing list, preuve de valeur, certificat d'origine, mandat, déclaration douanière, licences/autorisations, assurance, B/L, AWB, CMR, documents ferroviaires, factures, reçus, photos, POD, qualifications et certificats.

Chaque document : type, propriétaire, dossier, date, version, statut, permissions, historique. Stockage privé, contrôle d'accès, URLs temporaires signées et audit.

## 16. FACTURATION ET FACTURATION ÉLECTRONIQUE

Flux : demande → devis → contre-offre → acceptation → mission/commande → prestation → facture → paiement → reversement.

Fonctions : devis, contre-offres, factures, avoirs, reçus, acomptes, relances, factures prestataires, commissions, remboursements, export comptable et historique.

Prévoir Factur-X, UBL, CII, XML, e-invoicing, e-reporting, annuaire, Chorus Pro et Peppol lorsque supportés. Pour la France, vérifier le statut des plateformes agréées depuis les sources officielles DGFiP et conserver la date de vérification. Ne jamais déclarer un statut d'agrément à partir d'une source commerciale seule.

## 17. DISPATCHER / CENTRALE / DERNIER KILOMÈTRE

Une entreprise ou un dispatcher reçoit des lots de colis, les scanne, les trie, crée des tournées et les affecte aux chauffeurs/livreurs.

Fonctions : centrale, réception, import API/CSV/Excel, scans, tri, préparation, tournées, affectation chauffeur/véhicule, carte, suivi, incidents, retours, POD, rapports et facturation.

### JTransport Driver
Compte individuel invité par le dispatcher : connexion, disponibilité, tournée du jour, colis, ordre, navigation, scan QR/code-barres, prise en charge, chargement, départ, arrivée, livraison, signature, photo, échec, incident, retour, historique et synchronisation.

Le dispatcher ne connaît jamais le mot de passe du livreur.

## 18. STATUTS MÉTIER

### Mission
Publié → offres reçues → attribuée → confirmée → chauffeur affecté → préparation → collecte → transit → arrivée → livraison → livrée → terminée.

### Colis
Créé → reçu → attente affectation → affecté → chargé → en route → zone d'arrivée → livraison en cours → livré / échec → reprogrammation → retour dépôt → retour expéditeur → incident → annulé.

### Expédition internationale
Créée → collecte/dépôt → réception → groupage → conteneur affecté → chargé → départ → transit → arrivée → documents douane → traitement douane → frais dus → paiement confirmé → dédouané → libéré → dernier kilomètre → livré → POD → terminé.

## 19. MODE PRO ENTREPRISE

Dashboard : missions, expéditions, devis, commandes, contrats, prestataires, véhicules, chauffeurs, factures, paiements, documents, litiges, statistiques, dépenses et coûts logistiques.

Prévoir équipes, rôles internes, permissions, validations, centres de coûts, historique et exports.

## 20. RÔLES

Particulier ; donneur d'ordre ; prestataire/transporteur ; dispatcher ; opérateur dispatcher ; chauffeur/livreur ; transitaire/commissionnaire ; gestionnaire de transport ; administrateur JTransport ; autres rôles configurables.

RBAC/ABAC, isolation multi-tenant et accès aux données selon rôle, organisation, mission et consentement.

## 21. LANCEMENT, SPLASH, ONBOARDING

Au démarrage : logo JTransport, barre animée **« Chargement de votre expérience… »**, initialisation réelle, contrôle de session, onboarding, connexion/inscription, choix de rôle, vérification e-mail/téléphone, configuration du compte puis accueil adapté.

État : `SPLASH → INITIALIZING → SESSION_CHECK → {ONBOARDING | LOGIN | ROLE_SETUP | HOME}`.

Une session valide doit permettre d'éviter une reconnexion après l'initialisation. Gérer erreur, retry et hors ligne proprement.

## 22. WEB DESKTOP ET MOBILE

Web desktop pleinement utilisable sur ordinateur : tableaux, dashboards, filtres, cartes, statistiques, documents, facturation, dispatch, équipes, flotte.

Mobile : client, prestataire/transporteur, JTransport Driver et parcours dispatcher si nécessaire.

## 23. ARCHITECTURE TECHNIQUE

Architecture modulaire, multi-tenant, API-first, RBAC, audit.

Entités principales :
`Organization, User, Role, Driver, DispatcherCenter, Vehicle, CapacityProvider, TransportCapacity, Qualification, License, Certificate, VerificationCase, Mission, Shipment, ShipmentParty, ShipmentItem, Parcel, ConsolidationLot, Container, ContainerLeg, ContainerEvent, TrackingEvent, Route, RouteStop, Assignment, DeliveryAttempt, ProofOfDelivery, Quote, Contract, Invoice, Payment, PaymentIntent, PaymentAllocation, Refund, Payout, CustomsCase, CustomsDeclaration, CustomsDocument, CustomsFee, Notification, Incident, Conversation, ContactProfile, PostalAddress, AuditLog.`

Adaptateurs :
`RoutingProviderAdapter, TrackingProviderAdapter, NotificationProviderAdapter, BillingProviderAdapter, EInvoicingProviderAdapter, CapacityVerificationAdapter, EContractProviderAdapter, CustomsProviderAdapter, CustomsRulesAdapter, PaymentProviderAdapter.`

## 24. API ET INTÉGRATIONS

API sécurisées, versionnées et documentées. Exemples :
- `GET /api/home`
- `GET /api/search`
- `GET /api/categories`
- `GET /api/providers/:id`
- `GET /api/organizations/:id/contact`
- `PATCH /api/me/contact-visibility`
- `POST /api/conversations`
- `GET /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`

Ajouter les endpoints métier pour missions, devis, contrats, expéditions, colis, conteneurs, tracking, douane, paiements, documents, dispatch, POD et facturation.

## 25. SÉCURITÉ

Authentification robuste, RBAC/ABAC, isolation multi-tenant, contrôle d'accès objet, stockage privé, URLs signées, confirmation serveur des paiements, idempotence, rate limiting, anti-spam, logs d'audit, aucune clé secrète dans le client, protection des données personnelles et visibilité configurable des coordonnées.

## 26. MULTI-PAYS / MULTI-DEVISES / MULTI-LANGUES

Prévoir français, anglais puis autres langues. Devises : EUR, USD, GBP, XAF et autres. Règles douanières, fiscales, documentaires, licences et transport configurables par pays/activité.

## 27. LITIGES ET AVIS

Litiges : retard, dommage, colis manquant, problème douane/document, paiement, désaccord tarifaire, autre. Dossier avec messages, photos, documents, chronologie, décisions et remboursements éventuels.

Avis après mission avec modération, signalement et détection de fraude/manipulation.

## 28. CATALOGUE ADMINISTRABLE

Services transport, douane, dédouanement, stockage, manutention, emballage, assurance, fret, livraison, capacité, véhicule, chauffeur et autres services. Configuration par pays, zone, unité, règles, prestataires, disponibilité, taxes/frais et commission.

## 29. DONNÉES DE CONTACT

Les coordonnées professionnelles peuvent être affichées si le professionnel les rend publiques. Les coordonnées personnelles restent privées par défaut. Tout accès sensible doit être autorisé, audité et lié au contexte métier.

## 30. CRITÈRES D'ACCEPTATION END-TO-END

Une version fonctionnelle doit permettre au minimum :
1. créer un compte ;
2. se connecter ;
3. choisir/configurer son rôle ;
4. afficher le menu principal ;
5. publier une mission ;
6. rechercher un prestataire ;
7. publier une capacité ;
8. contacter un professionnel ;
9. demander un devis ;
10. accepter une offre ;
11. générer un contrat ;
12. signer via une intégration adaptée ;
13. créer une expédition ;
14. associer des colis ;
15. associer un conteneur ;
16. enregistrer les événements ;
17. suivre l'expédition ;
18. gérer le dossier douanier ;
19. charger les documents ;
20. afficher les frais ;
21. payer les frais disponibles ;
22. confirmer le paiement côté serveur ;
23. suivre le dédouanement ;
24. libérer l'expédition ;
25. organiser le dernier kilomètre ;
26. affecter un chauffeur ;
27. scanner les colis ;
28. obtenir une preuve de livraison ;
29. générer les factures ;
30. gérer un litige ;
31. fonctionner sur desktop ;
32. fonctionner sur mobile ;
33. respecter les permissions et l'isolation des organisations ;
34. conserver un audit des événements sensibles.

## 31. EXIGENCES ABSOLUES DE QUALITÉ

- Aucun bouton critique sans comportement.
- Aucun faux tracking.
- Aucun faux montant douanier officiel.
- Aucun secret dans le client.
- Aucun accès indu aux données personnelles.
- Aucun « diplôme à louer » présenté comme produit libre.
- Paiements confirmés côté serveur.
- Événements métier persistés.
- Tests des parcours critiques.
- Erreurs, reprise et idempotence.
- Architecture remplaçable via adaptateurs.
- Application utilisable réellement sur mobile et ordinateur.

## 32. RÉFÉRENCES VISUELLES ACCEPTÉES

Conserver uniquement les références visuelles JTransport/transport/logistique :
- menu principal JTransport ;
- splash JTransport ;
- storyboard UX JTransport ;
- dashboards JTransport ;
- écrans missions, tracking, publication, prestataires, dispatcher et chauffeur ;
- logo JTransport.

**À supprimer et ne jamais réintroduire :** toute image de marketplace généraliste contenant vêtements, mode, accessoires, téléphones, produits électroniques grand public, alimentation ou autres catégories sans rapport avec le transport/logistique. Les références supprimées du package final sont notamment `IMG_3678.jpeg` et `IMG_3930.jpeg`.

## 33. LIVRABLES ATTENDUS

Frontend web, frontend mobile, backend, base de données/migrations, authentification, RBAC, API, modèles métier, validations, notifications, documents, paiements, facturation, tracking, dispatch, contrats, messagerie, douane, tests, documentation, environnements et déploiement.

Le code fourni dans ce package est un socle de départ. Claude doit l'analyser, le compléter et connecter les fonctions à un backend réel plutôt que considérer les écrans comme suffisants.

## 34. ANNEXES TECHNIQUES

Le dossier contient notamment :
- `specs/CLAUDE_IMPLEMENTATION_INDEX.md`
- `specs/menu-contact-api.json`
- `specs/expedition-container-douane-paiement.json`
- `FACTURATION_DEVIS_CONFIG.json`
- code web et mobile ;
- ressources de design ;
- modules fonctionnels historiques ;
- archives ZIP assainies des versions précédentes.

## 35. INSTRUCTION FINALE À CLAUDE

Traiter ce document comme le cahier des charges maître de JTransport. Analyser le code existant avant modification. Implémenter les dépendances dans un ordre cohérent. Pour chaque module, créer ou compléter modèle de données, API, validations, permissions, interface, états métier, persistance, notifications, audit et tests.

L'objectif n'est pas que l'application **ressemble** à JTransport, mais qu'elle **fonctionne réellement** : du premier lancement jusqu'à la livraison finale, en passant par marketplace, capacité de transport, entreprises, missions, contrats, expéditions, conteneurs, tracking, douane, documents, paiements, facturation, dispatcher et dernier kilomètre.

---

# ANNEXE HISTORIQUE — DOCUMENTS ANTÉRIEURS INTÉGRÉS

Les spécifications historiques JTransport ont été conservées dans `docs/archives_specifications/` et leur contenu doit être considéré comme intégré au présent document maître lorsqu'il apporte un détail non contradictoire :
- Vision globale ;
- scope produit ;
- capacité professionnelle ;
- marketplace transport ;
- dispatcher/centrale ;
- expédition conteneur/douane/paiement/tracking ;
- menu principal/contacts ;
- processus global d'expédition ;
- facturation/devis ;
- architecture ;
- web desktop responsive ;
- prompt Claude ;
- README technique.

\n# ANNEXE TECHNIQUE — VISION_GLOBALE_JTRANSPORT.md\n
# JTRANSPORT — VISION GLOBALE DE LA MARKETPLACE / SUPER-PLATEFORME

## 1. Vision

JTransport ne doit pas être une simple application de livraison ni une simple plateforme d'annonces.

L'objectif est de créer une **plateforme unique de transport, logistique, commerce international et mise en relation**, utilisable par les particuliers comme par les professionnels.

L'utilisateur doit pouvoir rester dans JTransport pour :
- demander un transport ;
- envoyer un colis ;
- organiser une exportation ou une importation ;
- demander un fret maritime, aérien, routier ou ferroviaire ;
- expédier un véhicule ;
- calculer et payer les frais ;
- gérer les formalités et documents ;
- trouver un transporteur ;
- trouver un commissionnaire/transitaire ;
- trouver un prestataire ;
- rechercher une capacité de transport disponible ;
- louer/proposer une capacité ou un véhicule professionnel ;
- signer un contrat ;
- suivre la marchandise ;
- communiquer avec les différents intervenants ;
- recevoir les justificatifs ;
- payer et consulter les factures ;
- gérer les litiges.

**Principe : le maximum du parcours doit être regroupé dans JTransport afin d'éviter que le client doive utiliser plusieurs plateformes externes.**

---

# 2. TYPES D'UTILISATEURS

L'inscription doit permettre de choisir ou d'ajouter plusieurs profils.

### Particulier
Pour :
- envoyer des colis ;
- envoyer des marchandises ;
- envoyer des effets personnels ;
- expédier un véhicule ;
- envoyer vers l'Afrique, l'Europe et le reste du monde ;
- suivre une expédition ;
- demander un devis ;
- payer ;
- recevoir les documents.

### Professionnel / Entreprise
Pour :
- expédier des marchandises ;
- importer/exporter ;
- gérer plusieurs collaborateurs ;
- gérer plusieurs expéditions ;
- demander des cotations ;
- gérer des contrats ;
- gérer des fournisseurs/prestataires ;
- gérer des factures ;
- suivre les coûts et performances.

### Transporteur
Pour :
- présenter sa société ;
- publier ses véhicules ;
- déclarer ses capacités ;
- rechercher des missions ;
- répondre à des appels d'offres ;
- signer des contrats ;
- gérer ses chauffeurs ;
- gérer son calendrier ;
- suivre ses missions ;
- recevoir ses paiements.

### Chauffeur
Pour :
- recevoir des missions ;
- consulter son planning ;
- effectuer les livraisons ;
- utiliser le GPS ;
- effectuer les preuves de livraison ;
- signer ou faire signer ;
- déclarer les incidents.

### Commissionnaire / Transitaire / Prestataire logistique
Pour :
- proposer ses services ;
- gérer les formalités ;
- organiser les opérations internationales ;
- proposer des tarifs ;
- traiter les dossiers clients ;
- gérer les documents ;
- signer des contrats.

### Grossiste / Expéditeur / Donneur d'ordre
Pour :
- publier des besoins ;
- demander des devis ;
- trouver des prestataires ;
- rechercher des capacités disponibles ;
- attribuer des contrats ;
- gérer les commandes et expéditions.

### Prestataire de capacité
Une entreprise peut proposer à la plateforme :
- des camions ;
- fourgons ;
- semi-remorques ;
- véhicules frigorifiques ;
- chauffeurs ;
- capacités de transport ;
- entrepôts ;
- conteneurs / capacités disponibles ;
- services de manutention ;
- autres ressources logistiques.

### Administrateur JTransport
Gestion globale :
- utilisateurs ;
- entreprises ;
- prestataires ;
- missions ;
- contrats ;
- paiements ;
- commissions ;
- documents ;
- litiges ;
- vérifications ;
- catalogue des services ;
- pays ;
- devises ;
- tarifs ;
- règles métier.

---

# 3. MODULE CENTRAL : CALCULATEUR / DEVIS TRANSPORT

L'application doit permettre de demander un devis complet.

Le calcul doit pouvoir intégrer, selon le type d'expédition :

- transport principal ;
- collecte ;
- livraison ;
- manutention ;
- chargement ;
- déchargement ;
- emballage ;
- stockage ;
- assurance ;
- carburant ;
- péages ;
- frais portuaires ;
- frais aéroportuaires ;
- frais ferroviaires ;
- frais de terminal ;
- frais de dossier ;
- frais de transit ;
- frais de commissionnaire ;
- frais de dédouanement ;
- droits et taxes ;
- frais de douane ;
- frais de contrôle ;
- frais administratifs ;
- frais de documentation ;
- frais de connaissement ;
- frais liés au conteneur ;
- frais de surestaries/detention lorsque applicables ;
- frais de livraison finale ;
- commissions JTransport.

Le système doit afficher un **prix détaillé**, pas seulement un prix global.

---

# 4. TRANSPORT INTERNATIONAL

Prévoir un parcours international complet.

### Modes
- Routier
- Maritime
- Aérien
- Ferroviaire
- Multimodal

### Parcours possible
Collecte → entrepôt → préparation → douane/export → port/aéroport/terminal → transport principal → arrivée → douane/import → dédouanement → livraison finale.

L'utilisateur doit pouvoir visualiser chaque étape.

---

# 5. EXPORT / IMPORT

Créer un module Import/Export.

Fonctions :
- création d'un dossier import/export ;
- pays de départ ;
- pays d'arrivée ;
- expéditeur ;
- destinataire ;
- nature de la marchandise ;
- quantité ;
- poids ;
- volume ;
- valeur déclarée ;
- type d'emballage ;
- documents ;
- incoterm ;
- mode de transport ;
- prestataire ;
- statut douane ;
- statut dédouanement ;
- coûts ;
- paiements ;
- historique.

---

# 6. DOUANE / DÉDOUANEMENT

Créer un module permettant de centraliser les éléments liés aux formalités douanières.

L'application doit pouvoir :
- collecter les informations nécessaires ;
- permettre le dépôt/transfert de documents ;
- calculer ou estimer les coûts lorsque les données disponibles le permettent ;
- afficher séparément droits, taxes et frais de service ;
- mettre le client en relation avec un commissionnaire/transitaire ;
- suivre l'état du dossier ;
- notifier les pièces manquantes ;
- conserver les justificatifs.

**Important : les calculs réglementaires et déclarations officielles doivent utiliser des données/règles et intégrations juridiquement adaptées au pays concerné. Ne jamais présenter une estimation comme un montant douanier officiel.**

---

# 7. EXPÉDITION DE VÉHICULES

Créer un parcours dédié :

- voiture ;
- utilitaire ;
- camion ;
- moto ;
- autre véhicule autorisé.

Informations :
- marque ;
- modèle ;
- année ;
- VIN/châssis si nécessaire ;
- état ;
- dimensions ;
- poids ;
- valeur ;
- lieu d'enlèvement ;
- destination ;
- documents ;
- assurance ;
- mode de transport.

Possibilités :
- transport routier ;
- conteneur maritime ;
- RoRo lorsque disponible ;
- transport ferroviaire ;
- transport multimodal.

---

# 8. FRET MARITIME

Prévoir un véritable module freight maritime.

Fonctions :
- FCL ;
- LCL ;
- conteneurs ;
- réservation ;
- demande de cotation ;
- port de départ ;
- port d'arrivée ;
- date de départ ;
- estimation d'arrivée ;
- compagnie/partenaire ;
- documents ;
- connaissement ;
- suivi ;
- frais portuaires ;
- frais de terminal ;
- douane ;
- livraison finale.

Types de conteneurs à prévoir dans le catalogue :
- 20 pieds ;
- 40 pieds ;
- 40 HC ;
- autres types selon disponibilité.

---

# 9. FRET AÉRIEN

Fonctions :
- demande de tarif ;
- poids réel ;
- poids volumétrique ;
- aéroport départ ;
- aéroport arrivée ;
- documents ;
- réservation ;
- suivi ;
- douane ;
- livraison finale.

---

# 10. FRET FERROVIAIRE

Fonctions :
- demande de cotation ;
- trajet ;
- capacité ;
- wagons/conteneurs selon service ;
- réservation ;
- suivi ;
- documents ;
- coûts ;
- livraison finale.

---

# 11. LIVRAISON ROUTIÈRE

Fonctions :
- livraison locale ;
- nationale ;
- internationale ;
- express ;
- palettes ;
- colis ;
- chargement complet ;
- groupage ;
- température contrôlée si disponible ;
- preuve de livraison ;
- signature ;
- photo ;
- GPS ;
- suivi.

---

# 12. MARKETPLACE DES PRESTATAIRES

L'application doit être un véritable marché de prestataires.

Catégories possibles :
- transporteurs ;
- chauffeurs ;
- commissionnaires ;
- transitaires ;
- agents douaniers selon les pays ;
- entrepôts ;
- manutentionnaires ;
- sociétés de livraison ;
- sociétés de déménagement ;
- transport maritime ;
- transport aérien ;
- transport ferroviaire ;
- sociétés de location de véhicules/capacité ;
- assurance/logistique ;
- emballage ;
- stockage ;
- autres prestataires utiles au transport.

Chaque prestataire possède une fiche professionnelle.

---

# 13. CAPACITÉS DE TRANSPORT À PROPOSER

Une entreprise doit pouvoir déclarer :

- véhicule ;
- type ;
- capacité en poids ;
- capacité en volume ;
- dimensions ;
- zone couverte ;
- disponibilité ;
- conducteur ;
- équipements ;
- prix indicatif ;
- conditions ;
- documents ;
- assurance ;
- autorisations ;
- historique ;
- notation.

Une entreprise qui possède une capacité disponible peut la proposer à la Marketplace.

---

# 14. CONTRATS ÉLECTRONIQUES

Créer un véritable module **Contrats**.

Exemples :
- contrat de prestation de transport ;
- contrat de sous-traitance ;
- contrat entre donneur d'ordre et transporteur ;
- contrat de commissionnement ;
- contrat de mise à disposition de capacité ;
- contrat de prestation logistique ;
- contrat cadre ;
- contrat de mission ;
- conditions particulières ;
- ordre de transport.

Parcours :
1. Création du contrat à partir d'un modèle.
2. Remplissage automatique des informations.
3. Ajout des conditions/prix.
4. Envoi au cocontractant.
5. Lecture.
6. Signature électronique via un fournisseur de signature électronique adapté.
7. Horodatage et traçabilité.
8. Stockage sécurisé du document.
9. Téléchargement.
10. Historique des versions.
11. Alerte avant échéance.
12. Renouvellement ou résiliation selon les conditions.

**Ne pas inventer une valeur juridique de la signature : utiliser un prestataire de signature électronique conforme aux exigences applicables dans les pays ciblés.**

---

# 15. ORDRE DE TRANSPORT

Créer un document/objet numérique « Ordre de transport ».

Il doit pouvoir contenir :
- donneur d'ordre ;
- transporteur ;
- chauffeur ;
- véhicule ;
- marchandise ;
- chargement ;
- livraison ;
- prix ;
- instructions ;
- documents ;
- délais ;
- conditions ;
- signature/validation ;
- numéro unique.

L'ordre de transport doit être lié à la mission, au contrat, au tracking et à la facture.

---

# 16. COMPTES PRO ENTREPRISES

Créer un véritable **Mode PRO**.

Tableau de bord :
- missions ;
- expéditions ;
- devis ;
- commandes ;
- contrats ;
- prestataires ;
- véhicules ;
- chauffeurs ;
- factures ;
- paiements ;
- documents ;
- litiges ;
- statistiques ;
- dépenses ;
- coûts logistiques.

Prévoir :
- plusieurs utilisateurs ;
- rôles internes ;
- permissions ;
- validation par responsable ;
- centres de coûts ;
- historique des actions ;
- export des données.

---

# 17. COMPTE PARTICULIER

Interface simplifiée.

Accueil :
- Envoyer un colis
- Envoyer une marchandise
- Envoyer un véhicule
- Suivre une livraison
- Demander un devis
- Mes expéditions
- Mes documents
- Mes paiements
- Messages
- Assistance

---

# 18. COMPTE DONNEUR D'ORDRE

Le donneur d'ordre peut :
- publier une mission ;
- recevoir plusieurs offres ;
- comparer les prestataires ;
- négocier ;
- sélectionner ;
- signer un contrat ;
- donner un ordre de transport ;
- payer ;
- suivre ;
- valider la livraison ;
- noter.

---

# 19. COMPTE PRESTATAIRE / TRANSPORTEUR

Le prestataire peut :
- créer son profil ;
- être vérifié ;
- publier ses capacités ;
- rechercher des missions ;
- recevoir des recommandations ;
- répondre aux missions ;
- négocier ;
- signer ;
- recevoir l'ordre de transport ;
- affecter un chauffeur ;
- effectuer la mission ;
- fournir la preuve de livraison ;
- facturer ;
- recevoir son paiement.

---

# 20. SYSTÈME DE MATCHING

JTransport doit automatiquement proposer les meilleurs prestataires selon :

- localisation ;
- disponibilité ;
- type de véhicule ;
- capacité ;
- trajet ;
- zone ;
- prix ;
- notation ;
- vérification ;
- expérience ;
- historique ;
- contraintes de mission.

Afficher un score de compatibilité.

---

# 21. PAIEMENTS CENTRALISÉS

Le client doit pouvoir payer depuis JTransport.

Prévoir :
- paiement du transport ;
- frais de douane/dédouanement lorsque le service est proposé ;
- frais de dossier ;
- frais de stockage ;
- assurance ;
- autres services ;
- commission JTransport.

Prévoir :
- carte ;
- virement ;
- portefeuille si disponible ;
- factures ;
- remboursements ;
- paiements partiels ;
- séquestre/marketplace payment lorsque juridiquement et techniquement approprié ;
- reversement prestataire ;
- commissions.

Ne pas stocker directement les données bancaires sensibles : utiliser un prestataire de paiement adapté.

---

# 22. TRACKING UNIFIÉ

Un seul écran doit pouvoir suivre :
- colis ;
- palette ;
- véhicule ;
- conteneur ;
- expédition maritime ;
- fret aérien ;
- fret ferroviaire ;
- transport routier.

Statuts :
Créée → Devis → Réservée → Confirmée → Préparation → Collectée → En transit → Arrivée terminal → Douane → Dédouanement → Livraison finale → Livrée → Terminée.

Afficher :
- carte ;
- historique ;
- événements ;
- ETA lorsque disponible ;
- documents ;
- contacts ;
- incidents.

---

# 23. DOCUMENTS

Créer une bibliothèque documentaire par dossier.

Documents possibles :
- facture ;
- bon de livraison ;
- preuve de livraison ;
- contrat ;
- ordre de transport ;
- documents véhicule ;
- assurance ;
- documents douaniers ;
- documents export/import ;
- connaissement ;
- lettre de transport ;
- justificatifs de paiement ;
- photos.

Chaque document doit avoir :
- type ;
- propriétaire ;
- dossier ;
- date ;
- version ;
- statut ;
- permissions ;
- historique.

---

# 24. FACTURATION

Créer :
- devis ;
- facture ;
- avoir ;
- reçu ;
- détail des frais ;
- commissions ;
- taxes selon configuration ;
- historique des paiements.

Pour les entreprises :
- factures regroupées ;
- export comptable ;
- filtres par période ;
- centre de coûts.

---

# 25. LITIGES ET ASSISTANCE

Créer un système de litige :
- retard ;
- colis endommagé ;
- colis manquant ;
- problème douanier ;
- problème documentaire ;
- problème de paiement ;
- désaccord tarifaire ;
- autre.

Le dossier doit conserver :
- messages ;
- photos ;
- documents ;
- chronologie ;
- décisions ;
- remboursements éventuels.

---

# 26. CATALOGUE DE SERVICES

L'application doit pouvoir évoluer sans recoder toute l'application.

Créer un catalogue administrable de services :
- transport ;
- douane ;
- dédouanement ;
- stockage ;
- manutention ;
- emballage ;
- assurance ;
- fret ;
- livraison ;
- location de capacité ;
- véhicule ;
- chauffeur ;
- etc.

Chaque service peut avoir :
- pays ;
- zone ;
- unité de prix ;
- règles ;
- prestataires ;
- disponibilité ;
- taxes/frais applicables ;
- commission JTransport.

---

# 27. MULTI-PAYS / MULTI-DEVISES

Prévoir dès l'architecture :
- français ;
- anglais ;
- autres langues ensuite.

Devises :
- EUR ;
- USD ;
- GBP ;
- XAF ;
- autres.

Pays :
- Europe ;
- Afrique ;
- Amérique ;
- Asie ;
- Moyen-Orient ;
- Océanie.

Les règles de douane, taxes, documents et transport doivent être configurables par pays.

---

# 28. ARCHITECTURE

Ne pas construire une application monolithique impossible à faire évoluer.

Prévoir des modules indépendants :

Auth
Users
Companies
Provider Marketplace
Missions
Quotes
Matching
Contracts
Transport Orders
Shipments
Tracking
Fleet
Drivers
Documents
Customs
Freight
Payments
Billing
Messaging
Reviews
Disputes
Notifications
Admin
Analytics

Tous les modules doivent pouvoir communiquer via une API centrale.

---

# 29. OBJECTIF PRODUIT

Quand un utilisateur entre dans JTransport, il doit avoir le sentiment de trouver un **guichet unique du transport et de la logistique**.

Il ne doit pas simplement voir :
« Publier une mission ».

Il doit pouvoir voir :

**TRANSPORTER**
- Colis
- Palette
- Marchandise
- Véhicule

**INTERNATIONAL**
- Export
- Import
- Maritime
- Aérien
- Ferroviaire
- Multimodal

**SERVICES**
- Douane
- Dédouanement
- Stockage
- Manutention
- Assurance
- Livraison

**MARKETPLACE**
- Trouver un transporteur
- Trouver un chauffeur
- Trouver un commissionnaire
- Trouver un transitaire
- Trouver une capacité
- Proposer sa capacité
- Trouver un prestataire

**ENTREPRISE**
- Mode PRO
- Contrats
- Ordres de transport
- Facturation
- Équipe
- Flotte
- Statistiques

**SUIVI**
- Mes colis
- Mes marchandises
- Mes véhicules
- Mes conteneurs
- Mes expéditions

---

# 30. RÈGLE DE CONCEPTION

L'application doit rester simple malgré sa richesse.

Ne pas mettre 50 boutons sur l'écran principal.

Utiliser :
- recherche globale ;
- catégories ;
- assistants étape par étape ;
- tableaux de bord adaptés au profil ;
- filtres ;
- menus ;
- notifications ;
- raccourcis.

Le design doit reprendre l'esprit du prototype visuel fourni :
**professionnel, moderne, premium, orienté logistique, avec une identité JTransport forte, cartes, cartes géographiques, boutons d'action clairs et interfaces adaptées mobile/web.**

\n# ANNEXE TECHNIQUE — SCOPE_PRODUIT.md\n
# SCOPE — CE QUE JTRANSPORT DOIT DEVENIR

JTransport = marketplace + TMS/logistics platform + freight + import/export + customs workflow + provider marketplace + contract management + payments + tracking.

PUBLICS :
Particuliers | Entreprises | Donneurs d'ordre | Transporteurs | Chauffeurs | Commissionnaires | Transitaires | Grossistes | Prestataires | Propriétaires de capacités.

MODES :
Routier | Maritime | Aérien | Ferroviaire | Multimodal.

SERVICES :
Colis | Palettes | Marchandises | Véhicules | Fret | Export | Import | Douane | Dédouanement | Stockage | Manutention | Assurance | Livraison.

TRANSACTION :
Devis → Offre → Négociation → Contrat → Ordre de transport → Paiement → Tracking → Preuve de livraison → Facture → Avis.

IMPORTANT :
L'utilisateur doit pouvoir accomplir le maximum du parcours dans JTransport sans devoir sortir de l'application.

## 15. Facturation / devis / e-invoicing

- Devis
- Conversion devis → mission → facture
- Factures
- Avoirs
- Acomptes
- Paiements et statuts
- Relances
- Facturation marketplace
- Factures prestataires
- PDF + formats électroniques
- Factur-X / UBL / CII / XML
- Plateformes agréées DGFiP
- Annuaire de facturation électronique
- Chorus Pro
- Peppol
- Adaptateurs fournisseurs de facturation
- Audit, archivage et traçabilité

## 12. Dispatcher et distribution dernier kilomètre

JTransport doit supporter les opérateurs Dispatcher qui reçoivent des lots de colis de sociétés de transport ou de donneurs d'ordre. Ils disposent d'une centrale web, peuvent créer/inviter leurs livreurs, affecter les colis, créer des tournées, suivre les scans et contrôler les preuves de livraison.

## 13. Application livreur

Le livreur possède un compte individuel rattaché à son entreprise et utilise une application mobile dédiée pour : tournée, navigation, scan QR/code-barres, statuts, POD, signature, photo, incidents et synchronisation.

## 14. Ordinateur

Le produit doit être accessible sur ordinateur via une application web responsive complète. Les dashboards professionnels et Dispatcher doivent être conçus en priorité pour le travail opérationnel sur grand écran, tout en restant utilisables sur tablette.

## 16. Marketplace des capacités de transport — tous domaines

JTransport doit aussi être une marketplace où les transporteurs, entreprises et professionnels peuvent **proposer leurs capacités de transport** : marchandises, voyageurs, routier, maritime, aérien, ferroviaire, multimodal, dernier kilomètre, transport de véhicules, fret et services logistiques associés.

Le module permet :
- publication d'une capacité ;
- disponibilité ;
- zones/routes ;
- véhicules/moyens ;
- poids/volume ;
- qualifications/licences/certificats ;
- vérification ;
- matching avec les missions ;
- devis ;
- négociation ;
- contrat ;
- signature ;
- réservation ;
- mission ;
- tracking ;
- facture ;
- paiement ;
- commission ;
- avis.

Pour les activités réglementées, le catalogue des qualifications, licences et autorisations est configurable par pays. Une capacité professionnelle ne doit jamais être présentée comme un produit ou une « location de diplôme ».

## 17. Facturation électronique et plateformes agréées

JTransport doit proposer une configuration de facturation avec :
- plateforme agréée ;
- vérification du statut auprès de la source officielle ;
- annuaire ;
- e-invoicing ;
- e-reporting ;
- webhooks ;
- Factur-X ;
- UBL ;
- CII ;
- PDF lisible ;
- Chorus Pro ;
- Peppol lorsque supporté ;
- fournisseurs interchangeables via adaptateurs.

## 18. Parcours de lancement

Le lancement de l'application doit suivre :
**Splash logo JTransport → chargement animé → onboarding → connexion/inscription → choix du type de compte → vérification e-mail/téléphone → configuration du profil → accueil personnalisé.**

Si une session valide existe déjà, l'utilisateur doit pouvoir arriver directement à son accueil après le splash et l'initialisation des services.

\n# ANNEXE TECHNIQUE — MODULE_CAPACITE_PROFESSIONNELLE.md\n
# MODULE — CAPACITÉ PROFESSIONNELLE / GESTIONNAIRE DE TRANSPORT / CRÉATION D'ENTREPRISE

## Objectif

Ajouter dans JTransport un espace spécifique pour les personnes qui :
1. souhaitent créer une entreprise de transport mais ne possèdent pas encore la capacité professionnelle requise ;
2. possèdent une capacité professionnelle ou une qualification et souhaitent proposer légalement leurs services comme gestionnaire de transport / responsable transport lorsque le cadre juridique le permet ;
3. souhaitent trouver un gestionnaire de transport, une personne qualifiée ou un accompagnement professionnel ;
4. souhaitent obtenir des informations et effectuer les démarches administratives nécessaires.

### Important — règle de conformité

JTransport ne doit PAS présenter la capacité professionnelle comme un « diplôme à louer » sans conditions.

Dans les juridictions où la réglementation autorise le recours à un gestionnaire de transport extérieur/prestataire de services, l'application doit proposer une **mise en relation encadrée avec un gestionnaire de transport qualifié**, avec vérification de ses justificatifs et respect des limites réglementaires.

En France, les sources officielles indiquent qu'un gestionnaire de transport extérieur peut être prestataire de services dans certaines conditions. Pour le transport routier de personnes, la réglementation officielle mentionne notamment une limite de 2 entreprises et 20 véhicules pour la personne physique gestionnaire de transport. Les règles doivent être vérifiées et paramétrées selon l'activité et la situation. 

L'application ne doit jamais promettre qu'un simple contrat privé suffit à obtenir une licence ou une autorisation administrative.

---

# 1. ENTRÉE « CRÉER MON ENTREPRISE DE TRANSPORT »

Dans le menu Marketplace / Entreprise :

### « Je veux créer mon entreprise de transport »

L'utilisateur choisit :

- Transport de marchandises
- Transport de voyageurs
- Commissionnaire de transport
- Location de véhicules avec conducteur lorsque applicable
- Logistique
- Transport international
- Activité maritime
- Activité aérienne
- Activité ferroviaire
- Autre activité réglementée

Puis l'application demande le pays d'établissement.

---

# 2. ASSISTANT DE CRÉATION

Créer un parcours étape par étape :

### Étape 1 — Mon activité
- pays ;
- activité ;
- transport léger/lourd lorsque pertinent ;
- voyageurs/marchandises ;
- national/international ;
- modes de transport.

### Étape 2 — Mes qualifications
Question :
« Disposez-vous de la capacité professionnelle / qualification requise ? »

Réponses :
- Oui, j'ai la capacité ;
- Oui, j'ai un diplôme/équivalence ;
- Oui, j'ai une expérience reconnue ;
- Non ;
- Je ne sais pas.

### Étape 3 — Si l'utilisateur n'a pas la capacité

Afficher :

**« Vous pouvez avoir besoin d'un responsable/gestionnaire de transport qualifié selon votre activité et votre pays. »**

Boutons :
- Trouver un gestionnaire de transport
- Voir les personnes disponibles
- Passer l'examen / obtenir ma capacité
- Trouver une formation
- Voir les démarches officielles
- Parler à un professionnel

---

# 3. MARKETPLACE DES GESTIONNAIRES / CAPACITÉS

Créer une catégorie :

## « Gestionnaires de transport & capacités professionnelles »

Une personne qualifiée peut créer un profil professionnel.

Elle indique :

- identité ;
- société ;
- pays ;
- région ;
- domaine ;
- type de capacité/qualification ;
- numéro ou référence du justificatif lorsque pertinent ;
- date d'obtention ;
- organisme émetteur ;
- date d'expiration si applicable ;
- expérience ;
- langues ;
- zones géographiques ;
- disponibilités ;
- nombre de missions/entreprises actuellement gérées lorsque réglementé ;
- conditions financières ;
- type de prestation ;
- documents justificatifs.

---

# 4. TYPES DE CAPACITÉS / QUALIFICATIONS

Le catalogue doit être configurable par pays.

Exemples de catégories à afficher lorsque juridiquement applicables :

### Routier marchandises
- capacité professionnelle transport de marchandises ;
- léger ;
- lourd ;
- international ;
- catégories/qualifications complémentaires.

### Routier voyageurs
- capacité professionnelle transport de personnes ;
- catégories correspondant aux véhicules et activités concernées.

### Commissionnaire
- capacité/qualification de commissionnaire de transport lorsque requise.

### Maritime
Ne pas inventer une « capacité maritime » générique.
Afficher les qualifications, licences, certificats ou autorisations réellement applicables à l'activité maritime et au pays concerné.

### Aérien
Afficher les licences, certificats, agréments ou qualifications applicables au type d'activité.

### Ferroviaire
Afficher les licences, certificats, agréments ou qualifications applicables.

L'administration JTransport doit pouvoir créer de nouvelles catégories sans modifier le code.

---

# 5. PROFIL DU GESTIONNAIRE

Exemple :

**Gestionnaire Transport certifié / vérifié**

- Transport marchandises
- Transport voyageurs
- Expérience : 8 ans
- Zone : France / Europe
- Disponibilité : disponible
- Statut de vérification : Vérifié
- Entreprises actuellement accompagnées : X
- Tarif : sur devis / mensuel / mission
- Avis : 4,9/5

Boutons :
- Contacter
- Demander une prestation
- Demander un devis
- Créer un contrat
- Vérifier les documents

---

# 6. MATCHING AUTOMATIQUE

Pour une personne qui crée son entreprise :

JTransport doit proposer automatiquement des profils compatibles selon :

- activité ;
- pays ;
- région ;
- type de capacité ;
- catégorie de transport ;
- disponibilité ;
- limites réglementaires ;
- expérience ;
- prix ;
- notation ;
- vérification ;
- langue.

Afficher :

**« 6 gestionnaires compatibles avec votre projet »**

---

# 7. CONTRAT DE GESTIONNAIRE / PRESTATION

Depuis le profil :

**« Créer un contrat »**

JTransport génère un contrat à partir des informations vérifiées.

Le contrat contient :
- entreprise cliente ;
- gestionnaire/prestataire ;
- activité ;
- périmètre ;
- missions ;
- rémunération ;
- durée ;
- obligations ;
- documents ;
- conditions de résiliation ;
- signatures ;
- historique.

Le contrat doit être soumis à validation juridique lorsque nécessaire et signé avec un prestataire de signature électronique approprié.

---

# 8. DOSSIER ADMINISTRATIF

Créer un « Dossier de création transport ».

Il centralise :

- entreprise ;
- justificatifs d'identité ;
- justificatifs de capacité ;
- diplômes ;
- attestations ;
- honorabilité ;
- capacité financière ;
- assurance ;
- justificatifs véhicules ;
- justificatifs établissement ;
- documents administratifs ;
- contrats avec gestionnaire ;
- formulaires ;
- preuves de dépôt ;
- réponses de l'administration.

---

# 9. CHECKLIST AUTOMATIQUE

L'application doit générer une checklist adaptée au pays et à l'activité.

Exemple France / transport routier :

□ Créer l'entreprise  
□ Obtenir / justifier la capacité professionnelle  
□ Vérifier l'honorabilité  
□ Vérifier la capacité financière  
□ Disposer d'un établissement conforme  
□ Effectuer la demande d'autorisation d'exercer  
□ Effectuer l'inscription au registre compétent  
□ Obtenir les licences/copies conformes nécessaires  
□ Souscrire les assurances nécessaires  
□ Préparer les véhicules et documents  
□ Finaliser les contrats

Les éléments doivent être présentés comme une aide au parcours, pas comme un avis juridique personnalisé.

---

# 10. LIENS OFFICIELS DANS L'APPLICATION

Créer une rubrique :

## « Démarches officielles »

Les liens doivent être dynamiques et administrables.

Pour la France, prévoir notamment les sources officielles :

### Service-Public Entreprendre
https://entreprendre.service-public.gouv.fr/vosdroits/F31849

### Ministère de la Transition écologique — transport routier de marchandises
https://www.ecologie.gouv.fr/politiques-publiques/acces-exercice-profession-transporteur-marchandises

### Ministère de la Transition écologique — transport routier de personnes
https://www.ecologie.gouv.fr/politiques-publiques/acces-exercice-profession-transporteur-personnes

### Démarches administratives transporteurs
Lien officiel vers le service de demande d'attestation/copies conformes/autorisation d'exercer, à maintenir à jour depuis les sources gouvernementales.

### Guichet unique des formalités
https://formalites.entreprises.gouv.fr/

### DREAL / DRIEAT / DEAL
Le lien doit être sélectionné automatiquement selon la région et le territoire de l'entreprise.

---

# 11. FORMULAIRES PRÉREMPLIS

JTransport doit pouvoir préremplir les données connues dans les formulaires ou générer les documents nécessaires.

Mais :

- ne pas falsifier ;
- ne pas envoyer automatiquement un dossier sans validation de l'utilisateur ;
- afficher les champs nécessitant une vérification ;
- conserver la version du document envoyé ;
- conserver la preuve de dépôt lorsque l'administration en fournit une.

---

# 12. PARCOURS « JE POSSÈDE UNE CAPACITÉ »

Une personne possédant une qualification peut cliquer :

**« Proposer mes services de gestionnaire de transport »**

Puis :

1. Vérification d'identité ;
2. Vérification du justificatif ;
3. Vérification de l'activité et des informations professionnelles ;
4. Déclaration de disponibilité ;
5. Déclaration des limites réglementaires applicables ;
6. Définition du tarif ;
7. Publication du profil ;
8. Réception de demandes ;
9. Sélection d'une entreprise ;
10. Contrat ;
11. Signature ;
12. Suivi de la relation.

---

# 13. TABLEAU DE BORD DU GESTIONNAIRE

- demandes reçues ;
- contrats actifs ;
- contrats terminés ;
- entreprises accompagnées ;
- capacité/qualification ;
- documents ;
- échéances ;
- revenus ;
- paiements ;
- calendrier ;
- messages ;
- conformité.

Alertes :
- expiration d'un document ;
- changement de réglementation ;
- dépassement d'une limite autorisée lorsque JTransport dispose de la donnée ;
- renouvellement de contrat.

---

# 14. PROTECTION CONTRE LES ABUS

JTransport doit empêcher :

- faux diplômes ;
- fausses attestations ;
- comptes multiples destinés à contourner les limites ;
- mise à disposition d'une qualification lorsque le cadre légal ne l'autorise pas ;
- contrat fictif ;
- documents falsifiés.

Prévoir :
- vérification documentaire ;
- contrôles automatiques ;
- vérification manuelle ;
- signalement ;
- suspension ;
- audit ;
- historique.

---

# 15. IMPORTANT POUR LE MODÈLE ÉCONOMIQUE

JTransport peut prendre une commission sur :
- mise en relation ;
- contrat ;
- abonnement PRO ;
- gestion administrative ;
- services de création de dossier ;
- services logistiques ;
- transport ;
- prestations de partenaires.

Mais JTransport ne doit pas facturer comme « vente d'une capacité professionnelle » si juridiquement il s'agit en réalité d'une prestation réglementée de gestionnaire de transport.

Le produit doit être présenté comme :
**« Mise en relation avec des professionnels qualifiés / gestionnaires de transport »**
et non comme une vente illégale de diplôme.

---

# 16. EXTENSION INTERNATIONALE

Le même module doit fonctionner pays par pays.

Créer une table de configuration :

Country
Activity
QualificationType
RequiredDocuments
Authority
OfficialLinks
ApplicationSteps
ContractRules
VerificationRules
Limits
ExpirationRules

Ainsi JTransport pourra intégrer progressivement :
- France ;
- Belgique ;
- Pays-Bas ;
- Allemagne ;
- Espagne ;
- Italie ;
- Portugal ;
- Afrique francophone ;
- autres marchés.

Les règles doivent être validées localement avant activation.

---

# 17. OBJECTIF FINAL

Une personne qui arrive dans JTransport et dit :

**« Je veux créer une société de transport mais je n'ai pas la capacité »**

doit pouvoir :

1. Choisir son activité ;
2. connaître les conditions applicables ;
3. voir ce qui lui manque ;
4. trouver un professionnel qualifié lorsque la réglementation le permet ;
5. vérifier son profil ;
6. demander un devis ;
7. générer le contrat ;
8. signer ;
9. préparer son dossier administratif ;
10. accéder aux démarches officielles ;
11. suivre son dossier ;
12. finaliser la création de son entreprise.

Une personne qui possède la qualification doit pouvoir :

**« Proposer mes services de gestionnaire de transport »**

et trouver des entreprises qui recherchent ce service.

JTransport devient ainsi également une **Marketplace de compétences et de prestations réglementées du transport**, avec vérification et conformité.

\n# ANNEXE TECHNIQUE — MODULE_CAPACITE_ET_MARKETPLACE_TRANSPORT_COMPLETE.md\n
# JTRANSPORT — MODULE COMPLET « CAPACITÉS DE TRANSPORT & PRESTATAIRES »

## Objectif

JTransport doit permettre aux personnes et entreprises qui disposent de capacités, licences, qualifications, véhicules, flottes ou moyens de transport de proposer légalement leurs services à des donneurs d'ordre, et permettre aux clients de trouver ces capacités.

Le module couvre **tous les domaines de transport pris en charge par JTransport**, avec des règles configurables par pays et par activité.

> IMPORTANT : JTransport ne vend ni ne loue un diplôme. La plateforme met en relation des entreprises avec des professionnels, transporteurs ou prestataires et peut gérer des contrats de prestation lorsque la réglementation l'autorise. Toute activité réglementée doit être activée selon les règles du pays et de l'activité.

## 1. Catégories de capacités

### Routier — marchandises
- utilitaire / véhicule léger ;
- poids lourd ;
- porteur ;
- tracteur + semi-remorque ;
- frigorifique ;
- citerne ;
- benne ;
- plateau ;
- grue ;
- exceptionnel ;
- express / dernier kilomètre ;
- groupage ;
- FTL / LTL.

### Routier — voyageurs
- taxi/VTC lorsque applicable ;
- minibus ;
- autocar ;
- autobus ;
- transport scolaire lorsque applicable ;
- transport touristique ;
- transport événementiel ;
- transport adapté lorsque réglementé.

### Maritime
- fret maritime ;
- FCL ;
- LCL ;
- conteneurs ;
- Ro-Ro ;
- transport de véhicules ;
- affrètement maritime ;
- services portuaires/logistiques associés.

Afficher les licences, certificats, agréments et autorisations réellement applicables à l'activité et au pays. Ne jamais inventer une « capacité maritime » générique.

### Aérien
- fret aérien ;
- express aérien ;
- cargo ;
- agents/freight forwarders ;
- capacités de handling/logistique aérienne lorsque applicables.

Afficher les licences, certificats, agréments et autorisations réellement applicables à l'activité et au pays.

### Ferroviaire
- fret ferroviaire ;
- wagons ;
- locomotives ;
- opérateurs ;
- capacité terminale/intermodale.

Afficher les licences, certificats, agréments et autorisations réellement applicables à l'activité et au pays.

### Multimodal
Permettre de proposer une capacité combinant route + mer + air + rail, avec plusieurs prestataires et étapes.

## 2. Profil « proposer ma capacité »

Bouton principal : **PROPOSER MA CAPACITÉ DE TRANSPORT**.

Étapes :
1. choisir le domaine ;
2. choisir l'activité ;
3. sélectionner le pays/région ;
4. indiquer l'entreprise ou le statut professionnel ;
5. déclarer véhicules/moyens/capacité ;
6. saisir qualifications/licences/certificats lorsque requis ;
7. téléverser les justificatifs ;
8. choisir zones et routes ;
9. renseigner disponibilité ;
10. renseigner tarifs ou « sur devis » ;
11. choisir les prestations ;
12. valider les déclarations ;
13. vérification JTransport ;
14. publication du profil.

## 3. Fiche de capacité

Champs :
- fournisseur ;
- organisation ;
- domaine ;
- activité ;
- pays ;
- zones ;
- routes ;
- type de véhicule/moyen ;
- nombre disponible ;
- poids/volume ;
- dimensions ;
- équipement ;
- température contrôlée ;
- matières réglementées si autorisées ;
- disponibilité ;
- prix ;
- minimum de facturation ;
- assurance ;
- documents ;
- vérification ;
- note ;
- historique.

## 4. Marketplace

Recherche par :
- départ ;
- arrivée ;
- date ;
- domaine ;
- type de transport ;
- véhicule ;
- capacité ;
- poids/volume ;
- prix ;
- disponibilité ;
- pays ;
- vérification ;
- note.

Résultats avec score de compatibilité.

Actions :
- contacter ;
- demander un devis ;
- faire une offre ;
- négocier ;
- réserver ;
- créer un contrat ;
- enregistrer.

## 5. Gestionnaire de transport / qualifications professionnelles

Créer une sous-marketplace **« Gestionnaires de transport & professionnels qualifiés »**.

Un professionnel peut proposer, lorsque la loi le permet :
- gestion de transport ;
- accompagnement réglementaire ;
- prestation de gestion ;
- conseil ;
- accompagnement de création d'entreprise.

Ne jamais afficher « location de diplôme ».

Le profil contient : identité, entreprise, qualification, organisme émetteur, référence, date, expiration, expérience, zones, disponibilité, limites réglementaires déclarées, tarif, documents et statut de vérification.

## 6. Contrats

Depuis une capacité ou un profil :
**Demander un devis → négocier → créer contrat → signer → activer la prestation.**

Types :
- contrat de transport ;
- contrat de sous-traitance ;
- contrat de mise à disposition de capacité lorsque légalement permis ;
- contrat de gestionnaire de transport ;
- contrat de prestation logistique ;
- contrat cadre ;
- ordre de transport ;
- contrat de mission ;
- contrat multimodal.

Le contrat doit être versionné, audité, signé via un prestataire de signature électronique approprié et archivé.

## 7. Devis et factures liés aux capacités

Un prestataire peut générer un devis depuis une demande.

Flux :
**Demande → devis → contre-offre → acceptation → contrat/commande → prestation → facture → paiement → reversement/commission.**

La facture doit pouvoir être générée via le module BillingProviderAdapter et, pour la France, être routée selon le dispositif de facturation électronique applicable.

## 8. Plateformes agréées de facturation

Créer dans JTransport une rubrique **« Facturation électronique »** permettant de choisir/configurer une plateforme agréée (PA) ou un logiciel connecté à une PA.

Source de vérité pour la France : DGFiP, liste officielle des plateformes agréées.

La liste officielle est publiée par l'administration et doit être synchronisée/consultée dynamiquement. Stocker :
- nom ;
- identifiant d'immatriculation ;
- statut ;
- date de vérification ;
- date de dernière synchronisation ;
- pays ;
- capacités API ;
- formats ;
- e-invoicing ;
- e-reporting ;
- annuaire ;
- webhooks ;
- documentation ;
- environnement test/production.

Ne jamais hardcoder « agréé » sans vérifier la source officielle.

Pour le secteur public français, prévoir Chorus Pro.

Prévoir aussi l'interopérabilité Peppol lorsque le fournisseur choisi la supporte.

## 9. Formats de facture

Prévoir :
- PDF pour lecture humaine ;
- Factur-X ;
- UBL 2.1 ;
- CII ;
- XML ;
- formats spécifiques d'un pays lorsque nécessaires.

Ne pas considérer un simple PDF comme équivalent à une facture électronique structurée lorsque la réglementation exige un format structuré.

## 10. Vérification et conformité

Bloquer ou mettre en attente une publication si :
- document manquant ;
- document expiré ;
- incohérence d'identité ;
- qualification non vérifiée ;
- autorisation non applicable ;
- activité interdite ;
- limite réglementaire dépassée ;
- suspicion de fraude.

Statuts :
DRAFT → SUBMITTED → UNDER_REVIEW → VERIFIED → REJECTED → SUSPENDED → EXPIRED.

Prévoir vérification automatique + manuelle, signalement, audit et historique.

## 11. Matching capacité ↔ mission

Le moteur doit comparer :
- route ;
- date ;
- mode ;
- type de marchandise ;
- poids ;
- volume ;
- véhicule ;
- disponibilité ;
- licence/qualification ;
- assurance ;
- prix ;
- réputation ;
- historique ;
- contraintes de livraison.

Afficher par exemple : **Compatible 94 %** et expliquer les critères importants.

## 12. Architecture

Entités minimales :
- CapacityProvider
- TransportCapacity
- Qualification
- License
- Certificate
- VerificationCase
- CapacityAvailability
- CapacityOffer
- CapacityBooking
- Contract
- Quote
- Invoice
- Payment
- Organization
- Vehicle
- Driver
- Route
- Shipment
- AuditLog.

Créer les adaptateurs :
- `CapacityVerificationAdapter`
- `BillingProviderAdapter`
- `EInvoicingProviderAdapter`
- `EContractProviderAdapter`
- `TrackingProviderAdapter`
- `RoutingProviderAdapter`.

## 13. Multi-pays

Les règles ne doivent jamais être codées uniquement pour la France.

Configuration :
`Country → Activity → QualificationType → RequiredDocuments → Authority → Limits → ContractRules → VerificationRules → BillingRules → OfficialLinks`.

## 14. Principe final

JTransport doit être capable de mettre en relation :
**celui qui a besoin de transporter ↔ celui qui possède la capacité de transporter ↔ celui qui organise ↔ celui qui livre**, avec contrats, documents, suivi, facturation, paiement et conformité au même endroit.

\n# ANNEXE TECHNIQUE — MODULE_DISPATCHER_CENTRALE_LIVRAISON.md\n
# JTRANSPORT — MODULE DISPATCHER / CENTRALE DE DISTRIBUTION / LIVREURS

## 1. Objectif

JTransport doit gérer non seulement le donneur d'ordre et le transporteur, mais aussi le **Dispatcher / opérateur de distribution** qui reçoit des marchandises d'une ou plusieurs entreprises de transport, organise la tournée et attribue les colis à ses propres livreurs.

Le Dispatcher possède une **centrale opérationnelle** dans JTransport. Il peut créer son entreprise, inscrire ses livreurs, créer leurs comptes, affecter des colis, suivre les scans et contrôler les livraisons.

Le système doit fonctionner :
- sur ordinateur via JTransport Web / tableau de bord responsive ;
- sur smartphone pour les chauffeurs/livreurs ;
- sur tablette si nécessaire pour les opérations de quai et de dispatch.

## 2. Rôles

### Donneur d'ordre / entreprise de transport
Confie des marchandises ou des missions au Dispatcher.

### Dispatcher
- reçoit les lots/colis ;
- importe ou crée les colis ;
- organise les tournées ;
- affecte les colis à des livreurs ;
- affecte un véhicule ;
- suit les scans ;
- suit les statuts ;
- gère les exceptions ;
- communique avec donneur d'ordre et livreurs ;
- contrôle les preuves de livraison ;
- clôture la tournée.

### Responsable de centrale
Peut gérer plusieurs dispatchers, équipes, dépôts, zones et règles.

### Livreur / Chauffeur
Compte individuel lié à une entreprise Dispatcher/transporteur. Il utilise l'application mobile JTransport Driver.

### Administrateur JTransport
Supervision, conformité, support, audit et gestion des comptes.

## 3. Parcours complet

**Entreprise de transport / donneur d'ordre**
→ crée une mission ou transmet un lot de colis
→ sélectionne un Dispatcher
→ transmet les données colis
→ Dispatcher reçoit le lot
→ contrôle/réceptionne
→ crée ou importe les colis
→ organise les tournées
→ choisit les livreurs
→ affecte les colis
→ livreur reçoit sa tournée dans l'application
→ scan au départ
→ scan prise en charge
→ scan chargement
→ scan en cours de livraison
→ preuve de livraison ou échec
→ scan final
→ Dispatcher contrôle
→ clôture de tournée
→ donneur d'ordre voit les statuts en temps réel.

## 4. Réception des marchandises

Le Dispatcher doit pouvoir recevoir les marchandises par :
- saisie manuelle ;
- import CSV/Excel ;
- API ;
- intégration avec un transporteur ;
- scan de code-barres ;
- QR code ;
- référence de mission ;
- lot/manifeste.

À réception :
- créer un identifiant JTransport unique ;
- conserver la référence d'origine ;
- associer expéditeur/destinataire ;
- adresse ;
- téléphone si nécessaire ;
- poids/dimensions ;
- nombre de colis ;
- consignes ;
- créneau ;
- priorité ;
- zone ;
- statut.

## 5. Centrale Dispatcher — tableau de bord ordinateur

Le dashboard doit afficher :
- colis reçus aujourd'hui ;
- colis à affecter ;
- colis affectés ;
- colis en livraison ;
- livraisons réussies ;
- échecs ;
- retours ;
- incidents ;
- livreurs connectés ;
- véhicules disponibles ;
- tournées du jour ;
- performance par livreur ;
- performance par tournée ;
- alertes.

### Écran principal recommandé
Disposition desktop en 3 zones :
1. menu latéral ;
2. tableau central ;
3. panneau de détails / carte opérationnelle.

## 6. Gestion des livreurs

Le Dispatcher peut :
- créer un livreur ;
- inviter un livreur par SMS/e-mail ;
- créer son compte ;
- rattacher le livreur à l'entreprise ;
- désactiver/réactiver ;
- affecter un véhicule ;
- définir une zone ;
- consulter ses documents ;
- gérer ses disponibilités ;
- consulter son historique.

Le livreur doit avoir un **compte personnel** avec authentification propre. Le Dispatcher ne doit pas connaître le mot de passe du livreur.

## 7. Application JTransport Driver

Créer un parcours/application mobile dédié aux chauffeurs et livreurs.

### Accueil
- Bonjour [Prénom]
- statut disponible / indisponible
- tournée actuelle
- nombre de colis
- prochaine livraison
- alertes

### Tournée
- liste des colis ;
- ordre de livraison ;
- adresse ;
- navigation ;
- contact autorisé ;
- instructions ;
- statut ;
- scan.

### Scans
Prévoir :
- scan réception ;
- scan chargement ;
- scan départ ;
- scan arrivée sur zone ;
- scan remise ;
- scan retour ;
- scan incident.

Formats :
- code-barres ;
- QR code ;
- identifiant colis ;
- scan appareil photo.

Chaque scan doit enregistrer côté serveur :
- colis ;
- utilisateur ;
- date/heure ;
- position si autorisée ;
- événement ;
- appareil ;
- tournée ;
- commentaire éventuel.

## 8. Preuve de livraison (POD)

Pour une livraison réussie :
- signature ;
- photo si nécessaire ;
- nom du réceptionnaire ;
- date/heure ;
- géolocalisation si autorisée ;
- commentaire ;
- statut final.

Pour une livraison échouée :
- motif obligatoire ;
- photo si nécessaire ;
- commentaire ;
- tentative n° ;
- nouvelle date ou retour.

## 9. Statuts colis

Configurer au minimum :

1. Créé
2. Reçu par Dispatcher
3. En attente d'affectation
4. Affecté au livreur
5. Chargé
6. En tournée
7. Arrivé dans la zone
8. Livraison en cours
9. Livré
10. Livraison échouée
11. À reprogrammer
12. Retour dépôt
13. Retourné expéditeur
14. Incident
15. Annulé

Les statuts doivent être configurables par type de service sans casser le suivi global.

## 10. Tournées

Le Dispatcher peut :
- créer une tournée ;
- choisir une zone ;
- sélectionner un véhicule ;
- sélectionner un livreur ;
- ajouter des colis ;
- réordonner les arrêts ;
- optimiser la tournée via un service cartographique ;
- verrouiller la tournée ;
- envoyer la tournée au livreur ;
- suivre la tournée en direct ;
- modifier la tournée si urgence.

Prévoir une abstraction `RoutingProviderAdapter` afin de pouvoir utiliser un fournisseur de cartographie/routage différent selon le pays ou le contrat.

## 11. Affectation intelligente

Le système doit proposer automatiquement des livreurs selon :
- zone ;
- disponibilité ;
- capacité véhicule ;
- nombre de colis ;
- poids/volume ;
- horaire ;
- distance ;
- type de marchandise ;
- contraintes ;
- performance ;
- règles de l'entreprise.

Le Dispatcher conserve la décision finale.

## 12. Centrale multi-entreprises

Un Dispatcher peut travailler avec plusieurs donneurs d'ordre.

Séparer strictement les données par organisation :
- entreprise A ne voit que ses données ;
- entreprise B ne voit que ses données ;
- Dispatcher voit uniquement les dossiers qui lui sont confiés ;
- JTransport Admin peut auditer selon ses permissions.

Prévoir RBAC + organisation/tenant + journal d'audit.

## 13. Notifications

Événements :
- nouveau lot reçu ;
- colis non affecté ;
- tournée créée ;
- tournée modifiée ;
- chauffeur affecté ;
- scan effectué ;
- livraison réussie ;
- livraison échouée ;
- incident ;
- retour ;
- retard ;
- document manquant.

Canaux selon disponibilité : push, e-mail, SMS et notifications dans l'application.

## 14. Suivi partagé

Un même colis doit avoir une timeline unifiée accessible selon les droits à :
- donneur d'ordre ;
- transporteur ;
- Dispatcher ;
- livreur ;
- destinataire lorsque prévu ;
- support JTransport.

Chaque acteur voit uniquement les informations auxquelles il a droit.

## 15. Facturation du Dispatcher

Le système doit permettre :
- prix de prestation Dispatcher ;
- prix par colis ;
- prix par tournée ;
- supplément ;
- échec/retour si prévu au contrat ;
- facture ;
- avoir ;
- paiement ;
- rapprochement avec les colis livrés.

Le moteur de facturation existant doit être réutilisé.

## 16. API / intégrations

Prévoir :
- API d'import de colis ;
- webhooks d'événements ;
- API de création de tournée ;
- API d'affectation ;
- API de tracking ;
- API POD ;
- import CSV/Excel ;
- export des rapports.

## 17. Sécurité

- authentification forte ;
- rôles et permissions ;
- sessions sécurisées ;
- aucun mot de passe partagé ;
- secrets côté serveur ;
- chiffrement en transit et au repos selon architecture ;
- audit des actions ;
- limitation des accès aux données ;
- suppression/désactivation conforme aux obligations applicables.

## 18. Architecture recommandée

Entités principales :
- Organization
- DispatcherCenter
- Driver
- Vehicle
- Shipment
- Parcel
- ParcelScanEvent
- Route
- RouteStop
- Assignment
- DeliveryAttempt
- ProofOfDelivery
- Incident
- Customer
- TransportCompany
- Contract
- Invoice
- Notification
- AuditLog

Le système doit être event-driven autant que possible pour le suivi : `ParcelCreated`, `ParcelReceived`, `ParcelAssigned`, `ParcelLoaded`, `OutForDelivery`, `Delivered`, `DeliveryFailed`, `Returned`, etc.

## 19. Règle UX essentielle

Le Dispatcher ne doit pas avoir à naviguer dans dix écrans pour faire une opération simple.

Depuis une centrale unique, il doit pouvoir :
**Recevoir → Scanner → Affecter → Créer tournée → Envoyer au livreur → Suivre → Contrôler POD → Clôturer.**

\n# ANNEXE TECHNIQUE — MODULE_EXPEDITION_CONTAINER_DOUANE_PAIEMENT_TRACKING.md\n
# JTRANSPORT — MODULE EXPÉDITION INTERNATIONALE : CONTAINER + COMPTE CLIENT + TRACKING + DOUANE + PAIEMENT + DOCUMENTS

## 1. OBJECTIF

JTransport doit permettre à un particulier ou une entreprise de gérer une expédition internationale de bout en bout depuis son compte, notamment lorsqu'un colis ou plusieurs colis sont regroupés dans un conteneur.

Le parcours doit fonctionner réellement avec backend, base de données, authentification, documents, paiements, notifications, tracking, statuts, permissions, journal d'audit et intégrations externes configurables.

Exemple :
**Client → création du colis → dépôt/collecte → réception au dépôt → groupage → affectation au conteneur → chargement → départ du port → transport maritime → arrivée → douane → paiement des frais → dédouanement → sortie du port → transport final → livraison → preuve de livraison.**

Ce module concerne aussi les expéditions par avion, route, rail et multimodal. Le conteneur est donc un mode de conditionnement/logistique, pas une limitation du système au maritime.

---

## 2. COMPTE PERSONNEL DU CLIENT

Chaque client dispose d'un espace sécurisé avec :

- Mes expéditions
- Mes colis
- Mes conteneurs
- Mes documents
- Mes formalités douanières
- Mes devis
- Mes factures
- Mes paiements
- Mes remboursements/avoirs
- Mes notifications
- Mes conversations
- Mes contrats
- Mes adresses
- Mes destinataires
- Mes preuves de livraison
- Historique complet
- Centre d'aide/litiges.

Le client peut ouvrir une expédition et retrouver toutes les informations sans devoir contacter JTransport pour chaque étape.

---

## 3. CRÉER UNE EXPÉDITION

Assistant guidé :

1. Expéditeur
2. Destinataire
3. Adresse de collecte
4. Adresse de livraison
5. Pays de départ
6. Pays de destination
7. Type d'envoi : colis, palette, véhicule, marchandise, bagage, autre
8. Mode : routier, maritime, aérien, ferroviaire, multimodal
9. Type de transport maritime si applicable : FCL/LCL
10. Dimensions
11. Poids brut
12. Volume
13. Nombre de colis
14. Nature détaillée de la marchandise
15. Valeur déclarée
16. Devise
17. Pays d'origine
18. Code douanier/HS si connu
19. Incoterm si applicable
20. Documents disponibles
21. Assurance souhaitée
22. Date souhaitée
23. Service standard/express
24. Instructions particulières.

Le système doit valider les champs et signaler les informations manquantes avant réservation.

---

## 4. COLIS → LOT → CONTENEUR

Un même client peut avoir plusieurs colis.

Modèle hiérarchique :

`Shipment → ShipmentItem/Parcel → ConsolidationLot → Container → ContainerLeg → TrackingEvents`

Fonctions :
- créer un colis ;
- imprimer/afficher étiquette ;
- générer identifiant unique ;
- QR code/code-barres ;
- regrouper plusieurs colis ;
- créer un lot de groupage ;
- affecter au conteneur ;
- enregistrer le numéro du conteneur ;
- type de conteneur : 20GP, 40GP, 40HC, reefer, open top, flat rack ou autres catégories configurables ;
- plomb/scellé ;
- poids total ;
- volume ;
- capacité restante ;
- port de départ ;
- port de destination ;
- navire/transporteur maritime lorsqu'il est connu ;
- voyage/voyage maritime ;
- ETA/ETD ;
- documents associés.

Une entreprise peut gérer ses propres conteneurs et JTransport peut aussi intégrer les données d'un transporteur maritime, transitaire ou partenaire logistique.

---

## 5. STATUTS DU COLIS

Prévoir un workflow configurable mais comprenant au minimum :

`DRAFT`
→ `BOOKED`
→ `PICKUP_SCHEDULED`
→ `PICKED_UP`
→ `RECEIVED_AT_DEPOT`
→ `CHECKED`
→ `CONSOLIDATION_PENDING`
→ `CONSOLIDATED`
→ `CONTAINER_ASSIGNED`
→ `LOADING`
→ `LOADED`
→ `CONTAINER_SEALED`
→ `READY_TO_DEPART`
→ `DEPARTED_ORIGIN`
→ `IN_TRANSIT`
→ `ARRIVED_DESTINATION`
→ `CUSTOMS_PENDING`
→ `CUSTOMS_DOCUMENTS_REQUIRED`
→ `CUSTOMS_PROCESSING`
→ `CUSTOMS_CLEARED`
→ `PORT_RELEASED`
→ `LAST_MILE_ASSIGNED`
→ `OUT_FOR_DELIVERY`
→ `DELIVERED`
→ `POD_CONFIRMED`
→ `COMPLETED`.

Exceptions :
- `DOCUMENT_MISSING`
- `CUSTOMS_HOLD`
- `PAYMENT_PENDING`
- `INSPECTION`
- `DAMAGED`
- `DELAYED`
- `LOST`
- `RETURN`
- `CANCELLED`
- `DISPUTED`.

Chaque changement de statut est un événement auditable avec auteur, date/heure, organisation, référence de l'expédition et données de localisation lorsqu'elles sont autorisées.

---

## 6. TRACKING CLIENT EN TEMPS QUASI RÉEL

Dans « Mes expéditions », afficher une timeline claire :

- dernière position connue ;
- dernier événement ;
- date/heure ;
- lieu ;
- étape actuelle ;
- prochaine étape ;
- ETA ;
- retard éventuel ;
- conteneur associé ;
- navire/voyage si disponible ;
- port de départ/arrivée ;
- transporteur ;
- numéro de suivi ;
- historique complet.

Carte :
- position lorsque fournie par un partenaire ;
- route ;
- ports ;
- étapes ;
- dernière mise à jour.

Important : si le fournisseur ne fournit pas une position GPS en temps réel, afficher honnêtement « dernière position connue » ou le dernier événement connu. Ne jamais inventer une position.

Créer `TrackingProviderAdapter` pour connecter plusieurs sources : transporteurs, maritime, aérien, routier, rail, APIs partenaires, webhooks ou saisie opérationnelle JTransport.

---

## 7. CONTENEUR ET SUIVI MARITIME

Écran « Mon conteneur » :

- numéro du conteneur ;
- type ;
- scellé ;
- poids ;
- volume ;
- taux de remplissage ;
- nombre de colis ;
- port de départ ;
- port d'arrivée ;
- terminal ;
- navire ;
- voyage ;
- armateur/transporteur ;
- ETD ;
- ETA ;
- événements portuaires ;
- chargement ;
- départ ;
- transbordement ;
- arrivée ;
- déchargement ;
- disponibilité pour enlèvement ;
- douane ;
- sortie terminal ;
- livraison finale.

Prévoir les cas de transbordement et de changement d'ETA.

---

## 8. DOSSIER DOUANIER NUMÉRIQUE

Chaque expédition internationale doit pouvoir posséder un `CustomsCase` lié à la commande.

Informations :
- import/export/transit ;
- pays de départ ;
- pays d'origine ;
- pays de destination ;
- expéditeur ;
- importateur ;
- destinataire ;
- description des marchandises ;
- quantité ;
- poids ;
- valeur ;
- devise ;
- code HS si disponible ;
- origine préférentielle/non préférentielle si applicable ;
- Incoterm ;
- documents ;
- déclarant/transitaire ;
- statut douanier ;
- références de déclaration ;
- contrôles/inspection ;
- notifications ;
- frais et paiements ;
- historique des actions.

Statuts :
`NOT_STARTED → DOCUMENTS_REQUIRED → READY_FOR_DECLARATION → SUBMITTED → UNDER_REVIEW → INSPECTION_IF_APPLICABLE → DUTIES_PENDING → CLEARED → RELEASED`.

Le système doit afficher les documents manquants et envoyer des alertes.

### Règle de conformité

JTransport peut calculer ou afficher des **estimations** lorsque des données fiables et une intégration autorisée existent, mais ne doit jamais présenter une estimation comme un montant douanier officiel.

Les droits, taxes, restrictions, licences et formalités dépendent du pays, de la marchandise, de la classification et de la réglementation applicable. Les données officielles ou le déclarant/transitaire compétent doivent rester la référence pour la déclaration.

Prévoir `CustomsProviderAdapter` et `CustomsRulesAdapter` pour intégrer des sources par pays sans coder des règles douanières en dur dans l'application.

---

## 9. PAIEMENT DES FRAIS DE DOUANE ET LOGISTIQUES

Le client doit pouvoir payer depuis l'application les montants qui lui sont légalement et contractuellement facturables par JTransport ou ses partenaires, par exemple :

- transport ;
- collecte ;
- livraison ;
- fret ;
- manutention ;
- stockage ;
- frais de dossier ;
- assurance ;
- frais de port/terminal lorsqu'ils sont refacturés ;
- droits/taxes douaniers lorsque le parcours de paiement et le bénéficiaire le permettent ;
- frais de dédouanement ;
- frais de livraison finale ;
- autres frais validés.

Écran « À payer » :
- montant ;
- devise ;
- bénéficiaire ;
- motif ;
- échéance ;
- facture/devis associé ;
- statut ;
- moyen de paiement ;
- reçu.

Moyens selon pays et fournisseur :
- carte bancaire ;
- virement ;
- portefeuille JTransport si disponible ;
- autres moyens locaux via adaptateurs.

Ne jamais stocker les données brutes de carte ou secrets bancaires dans l'application. Utiliser un prestataire de paiement conforme et des tokens/PaymentIntent côté serveur.

Le paiement doit être idempotent et gérer :
`PENDING → REQUIRES_ACTION → PAID → FAILED → REFUNDED/PARTIALLY_REFUNDED`.

Webhooks de paiement obligatoires pour confirmer l'état côté serveur.

---

## 10. PAIEMENT AVANT DÉBLOCAGE D'UNE ÉTAPE

Certaines étapes peuvent être bloquées lorsque des frais réellement dus ne sont pas réglés, selon les contrats et les règles applicables.

Exemple :
- `CUSTOMS_CLEARANCE_PENDING_PAYMENT`
- client paie ;
- webhook confirme ;
- dossier passe à l'étape suivante.

Ne jamais déclarer un paiement réussi uniquement parce que l'utilisateur est revenu sur l'application après une page de paiement.

---

## 11. DOCUMENTS ET « TOUTES LES PAPERASSES »

Créer un coffre-fort documentaire par expédition.

Documents possibles :
- facture commerciale ;
- proforma ;
- packing list ;
- bon de livraison ;
- preuve d'achat ;
- preuve de valeur ;
- certificat d'origine ;
- documents d'identité lorsque légalement nécessaires ;
- mandat douanier ;
- déclaration douanière ;
- autorisations/licences ;
- certificat sanitaire/phytosanitaire lorsque requis ;
- assurance ;
- connaissement / Bill of Lading ;
- Sea Waybill ;
- lettre de transport aérien / AWB ;
- CMR ;
- documents ferroviaires ;
- ordre de transport ;
- contrat ;
- facture JTransport ;
- reçus de paiement ;
- justificatifs de frais ;
- documents de livraison ;
- photos ;
- POD.

Fonctions :
- upload ;
- aperçu ;
- téléchargement autorisé ;
- version ;
- date ;
- auteur ;
- type ;
- statut ;
- expiration ;
- document manquant ;
- validation ;
- signature lorsque nécessaire ;
- partage sécurisé ;
- audit.

Ne pas mettre les fichiers sensibles en accès public. Utiliser stockage privé + URLs signées à durée limitée + contrôle RBAC.

---

## 12. FORMULAIRES ET ASSISTANT DE DOCUMENTS

JTransport doit guider l'utilisateur :

« Votre dossier est incomplet » → liste des documents manquants → bouton « Ajouter » → validation → mise à jour du dossier.

Possibilité de préremplir les documents à partir des données de l'expédition, sans falsifier ni inventer d'information.

Les champs doivent rester éditables jusqu'à la soumission définitive lorsque la procédure l'autorise.

---

## 13. NOTIFICATIONS

Notifications dans l'application + e-mail + SMS/push selon consentement et fournisseur :

- colis enregistré ;
- collecte programmée ;
- colis reçu ;
- colis placé dans un conteneur ;
- conteneur chargé ;
- conteneur parti ;
- ETA modifiée ;
- arrivée ;
- documents manquants ;
- contrôle douanier ;
- frais à payer ;
- paiement reçu ;
- dédouanement terminé ;
- colis libéré ;
- livraison programmée ;
- livreur en route ;
- livraison réussie ;
- incident ;
- litige ;
- document expirant.

L'utilisateur choisit ses préférences de notification.

---

## 14. CONTACTS DANS LE DOSSIER

Depuis une expédition, le client doit pouvoir contacter les acteurs autorisés :

- JTransport support ;
- transporteur ;
- dispatcher ;
- transitaire/commissionnaire ;
- déclarant/douanier lorsque présent ;
- livreur lorsque le parcours le permet ;
- entreprise destinataire lorsque les règles de confidentialité l'autorisent.

Le contact doit rester lié à l'expédition et afficher son contexte.

Les coordonnées professionnelles peuvent être affichées selon les paramètres de visibilité. Les données personnelles et adresses privées doivent rester protégées et ne sont partagées qu'aux acteurs nécessaires à l'exécution.

---

## 15. FACTURATION ET RÉCONCILIATION

Pour chaque expédition :

- devis accepté ;
- facture transport ;
- facture frais complémentaires ;
- frais douaniers ;
- paiement ;
- commission JTransport ;
- reversement prestataire ;
- avoir/remboursement ;
- statut comptable.

Un même paiement peut être réparti comptablement entre plusieurs postes/bénéficiaires selon la structure contractuelle. Cette répartition doit être traitée côté serveur.

Prévoir `Invoice`, `InvoiceLine`, `Payment`, `PaymentAllocation`, `Refund`, `Payout`, `Fee`.

---

## 16. MODÈLE DE DONNÉES MINIMAL

Ajouter :

- `Shipment`
- `ShipmentParty`
- `ShipmentItem`
- `Parcel`
- `ConsolidationLot`
- `Container`
- `ContainerLeg`
- `ContainerEvent`
- `TrackingEvent`
- `TrackingProvider`
- `CustomsCase`
- `CustomsDeclaration`
- `CustomsDocument`
- `CustomsFee`
- `Document`
- `DocumentVersion`
- `Payment`
- `PaymentIntent`
- `PaymentAllocation`
- `Refund`
- `Payout`
- `Notification`
- `ShipmentContact`
- `DeliveryAttempt`
- `ProofOfDelivery`
- `Incident`
- `AuditLog`.

Relations :
- un utilisateur peut avoir plusieurs expéditions ;
- une expédition peut contenir plusieurs colis ;
- plusieurs colis peuvent appartenir à un lot ;
- un lot peut être affecté à un conteneur ;
- un conteneur possède plusieurs événements ;
- une expédition possède plusieurs événements de tracking ;
- une expédition peut avoir un dossier douanier ;
- un dossier douanier possède plusieurs documents et frais ;
- une facture possède plusieurs lignes ;
- un paiement peut être associé à une ou plusieurs allocations selon le modèle financier ;
- toutes les opérations importantes sont auditables.

---

## 17. API À IMPLÉMENTER

### Expéditions
- `POST /api/shipments`
- `GET /api/shipments`
- `GET /api/shipments/:id`
- `PATCH /api/shipments/:id`
- `POST /api/shipments/:id/book`
- `POST /api/shipments/:id/cancel`

### Colis
- `POST /api/shipments/:id/parcels`
- `GET /api/shipments/:id/parcels`
- `POST /api/parcels/:id/scan`
- `GET /api/parcels/:id/tracking`

### Conteneurs
- `POST /api/containers`
- `GET /api/containers/:id`
- `POST /api/containers/:id/assign-parcels`
- `POST /api/containers/:id/events`
- `GET /api/containers/:id/tracking`

### Douane
- `POST /api/shipments/:id/customs-case`
- `GET /api/shipments/:id/customs-case`
- `POST /api/customs/:id/documents`
- `POST /api/customs/:id/submit`
- `POST /api/customs/:id/fees`
- `GET /api/customs/:id/status`

### Documents
- `POST /api/shipments/:id/documents`
- `GET /api/shipments/:id/documents`
- `GET /api/documents/:id/download-url`
- `POST /api/documents/:id/validate`

### Paiements
- `POST /api/payments/intents`
- `GET /api/payments/:id`
- `POST /api/payments/:id/confirm`
- `POST /api/payments/webhooks/:provider`
- `POST /api/refunds`

### Tracking
- `GET /api/shipments/:id/timeline`
- `GET /api/shipments/:id/map`
- `POST /api/tracking/webhooks/:provider`

### Contacts
- `POST /api/shipments/:id/conversations`
- `GET /api/shipments/:id/conversations`

Toutes les routes doivent être authentifiées sauf endpoints explicitement publics et limités, utiliser RBAC/ABAC, validation serveur, rate limiting, logs, idempotency keys pour opérations financières et audit.

---

## 18. ÉCRANS À CODER

### Client
1. Mes expéditions
2. Nouvelle expédition
3. Détails de l'expédition
4. Mes colis
5. Mon conteneur
6. Tracking/carte
7. Dossier douane
8. Documents
9. Frais à payer
10. Paiement
11. Factures
12. Messages
13. Incidents/litiges
14. POD.

### Entreprise / professionnel
- gestion des expéditions ;
- lots ;
- conteneurs ;
- douane ;
- documents ;
- paiements ;
- facturation ;
- équipes ;
- reporting.

### Admin JTransport
- recherche globale ;
- suivi de tous les dossiers autorisés ;
- gestion des prestataires ;
- gestion des conteneurs ;
- gestion des intégrations ;
- paiements ;
- douane ;
- incidents ;
- audit ;
- configuration des règles par pays.

---

## 19. EXEMPLE DE PARCOURS COMPLET À TESTER

Cas : particulier envoie 3 colis vers un autre pays par conteneur maritime.

1. Création du compte.
2. Vérification e-mail/téléphone.
3. Nouvelle expédition.
4. Saisie des 3 colis.
5. Choix maritime/groupage.
6. Devis.
7. Acceptation.
8. Paiement du transport.
9. Collecte/dépôt.
10. Scan des 3 colis.
11. Réception au dépôt.
12. Affectation à un lot.
13. Affectation au conteneur.
14. Notification au client.
15. Chargement/scellage.
16. Départ.
17. Tracking des événements.
18. Arrivée au port destination.
19. Ouverture du dossier douanier.
20. Affichage des documents manquants.
21. Upload des documents.
22. Validation du dossier.
23. Calcul/affichage d'une estimation si disponible.
24. Affichage des frais réellement facturés.
25. Paiement depuis l'application.
26. Confirmation serveur par webhook.
27. Dédouanement/libération.
28. Affectation livraison finale.
29. Notification de livraison.
30. Preuve de livraison.
31. Clôture.
32. Factures/reçus disponibles dans le compte.

Claude doit automatiser ce parcours avec tests E2E et données de démonstration, sans simuler les paiements comme s'ils étaient réels.

---

## 20. EXIGENCES DE QUALITÉ

Le système doit :
- être responsive mobile/tablette/desktop ;
- fonctionner en connexion normale et gérer les erreurs réseau ;
- gérer les reprises/synchronisations ;
- être multi-langue ;
- être multi-devise ;
- gérer les fuseaux horaires ;
- utiliser des identifiants uniques ;
- être multi-tenant ;
- protéger les données personnelles ;
- journaliser les actions sensibles ;
- disposer de tests unitaires, intégration et E2E ;
- avoir des états loading/empty/error/success ;
- ne jamais afficher de fausse information de tracking ou de paiement ;
- ne jamais exposer de secrets dans le frontend ;
- permettre de remplacer un fournisseur de paiement/tracking/douane sans réécrire le domaine métier.

## 21. CRITÈRE D'ACCEPTATION FINAL

Le module est considéré comme terminé uniquement lorsqu'un utilisateur peut, depuis son compte :

**créer une expédition → déposer/faire collecter ses colis → suivre ses colis et son conteneur → consulter les étapes → recevoir les alertes → gérer son dossier documentaire → gérer les formalités douanières → voir les frais à payer → payer depuis l'application lorsque le paiement est disponible → récupérer ses reçus/factures → suivre la libération → suivre la livraison finale → consulter le POD et l'historique complet.**

Aucune étape critique ne doit être seulement visuelle. Chaque action doit avoir un modèle de données, une API, une validation, une permission, une persistance et un traitement d'erreur.

\n# ANNEXE TECHNIQUE — MODULE_MENU_PRINCIPAL_CONTACTS.md\n
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

\n# ANNEXE TECHNIQUE — PROCESSUS_GLOBAL_EXPEDITION.md\n
# JTRANSPORT — PROCESSUS GLOBAL D'UNE EXPÉDITION

## Parcours de référence

1. Client/entreprise crée une demande.
2. JTransport collecte origine, destination, marchandise, poids, volume, contraintes et documents.
3. Le moteur recherche transporteurs/prestataires/capacités.
4. Les prestataires font une offre ou JTransport calcule une cotation.
5. Client accepte le devis.
6. Contrat/ordre de transport généré selon le cas.
7. Paiement ou acompte selon conditions.
8. Mission confirmée.
9. Transporteur prend en charge.
10. Si un Dispatcher est utilisé : le lot est transmis à sa centrale.
11. Dispatcher reçoit et scanne les colis.
12. Dispatcher affecte chaque colis à une tournée/livreur.
13. Le livreur reçoit sa tournée dans JTransport Driver.
14. Chargement + scan.
15. Départ + suivi.
16. Arrivée dans la zone.
17. Livraison + POD.
18. Synchronisation instantanée des statuts.
19. En cas d'échec : incident → reprogrammation ou retour.
20. Livraison terminée.
21. Contrôle POD par Dispatcher/transporteur.
22. Facturation finale.
23. Paiement/prestation.
24. Évaluation et clôture.

## Principe de traçabilité

Un identifiant de colis doit rester stable tout au long du parcours, même lorsque plusieurs acteurs interviennent.

Exemple :
Mission → Lot → Colis → Tournée → Affectation → Scan → Livraison → POD → Facture.

## Référentiel d'événements

Tous les changements importants doivent produire un événement horodaté avec auteur, rôle, organisation et contexte technique lorsque pertinent.

## EXTENSION — PARCOURS CONTAINER + COMPTE CLIENT + DOUANE + PAIEMENT

Le processus global doit également couvrir les expéditions internationales regroupées : plusieurs colis peuvent être consolidés dans un lot puis affectés à un conteneur. Le client suit chaque colis et le conteneur depuis son compte, reçoit les changements d'ETA et les alertes, accède au coffre documentaire, complète les pièces manquantes, consulte le dossier douanier et règle depuis l'application les montants effectivement facturés lorsque le mécanisme de paiement est disponible.

La libération douanière et la progression de l'expédition ne doivent changer de statut qu'après confirmation serveur des événements/transactions correspondants. Le tracking ne doit afficher que des événements réellement fournis ou enregistrés par JTransport/partenaires.

Voir `MODULE_EXPEDITION_CONTAINER_DOUANE_PAIEMENT_TRACKING.md` pour le workflow, les modèles, API, écrans et critères d'acceptation.

\n# ANNEXE TECHNIQUE — INTEGRATIONS_FACTURATION_DEVIS.md\n
# JTransport — Facturation, devis et facturation électronique

## Objectif

JTransport doit intégrer un véritable module de **devis, factures, avoirs, acomptes, paiements et facturation électronique**, utilisable par les particuliers, transporteurs, chauffeurs, entreprises, transitaires, commissionnaires, entrepôts et autres prestataires.

Le module doit être conçu avec une couche d'abstraction (`BillingProviderAdapter`) afin de pouvoir connecter ou remplacer un fournisseur sans modifier le cœur métier JTransport.

## 1. Documents commerciaux à gérer

### Devis
- création depuis une mission ou manuellement ;
- numéro unique ;
- client / entreprise ;
- adresse de facturation ;
- SIREN/SIRET/TVA intracommunautaire lorsque pertinent ;
- lignes de transport et services ;
- enlèvement/livraison ;
- mode de transport ;
- poids/volume/palettes ;
- frais carburant, péage, manutention, stockage, assurance, douane, etc. ;
- remises ;
- TVA par ligne ;
- total HT / TVA / TTC ;
- conditions de paiement ;
- durée de validité ;
- signature/acceptation ;
- génération PDF ;
- envoi par e-mail ;
- conversion Devis → Commande/Mission → Facture.

### Factures
- numéro séquentiel et non ambigu ;
- date d'émission ;
- date de prestation ;
- vendeur/prestataire ;
- client ;
- lignes et taxes ;
- acompte ;
- avoir ;
- échéance ;
- statut : brouillon, émise, envoyée, reçue, acceptée, partiellement payée, payée, en retard, annulée selon règles légales ;
- moyen de paiement ;
- référence de mission/commande ;
- PDF et format électronique ;
- historique/audit trail ;
- archivage ;
- relances ;
- export comptable.

### Avoirs / remboursements
- création à partir d'une facture ;
- lien avec la facture d'origine ;
- motif ;
- montant total et TVA ;
- suivi du remboursement ou de l'imputation.

## 2. Facturation électronique France — règle d'architecture

JTransport ne doit **pas** afficher un fournisseur comme « agréé » sur la seule base de son nom commercial. Le statut doit être vérifié à partir de la liste officielle DGFiP et stocké avec une date de dernière vérification.

Source officielle à intégrer dans l'administration :
- Liste des plateformes agréées DGFiP : https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees
- Espace officiel facturation électronique : https://www.impots.gouv.fr/facturation-electronique-et-plateformes-agreees
- Annuaire officiel de la facturation électronique : https://www.economie.gouv.fr/entreprises/gerer-son-entreprise-au-quotidien/gerer-sa-comptabilite-et-ses-demarches/quest-ce-que-lannuaire-de-la-facturation-electronique
- Chorus Pro : https://chorus-pro.gouv.fr/
- AIFE / facturation électronique : https://aife.economie.gouv.fr/nos-applications/facturation-electronique-b2b/
- Peppol France : https://www.impots.gouv.fr/rejoindre-le-reseau-peppol

### Important
À partir du 1er septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques ; l'émission devient obligatoire progressivement, avec l'échéance du 1er septembre 2027 pour les PME et micro-entreprises. Le moteur JTransport doit donc être prêt dès maintenant pour les deux échéances.

Pour une opération B2B France entrant dans le champ de la réforme, JTransport doit transmettre la facture électronique via une **Plateforme Agréée (PA)** ou via une solution compatible connectée à une PA. Pour le secteur public, conserver l'intégration Chorus Pro.

## 3. Architecture des intégrations

Créer une interface générique :

```ts
interface BillingProviderAdapter {
  createQuote(input): Promise<QuoteResult>;
  updateQuote(id, input): Promise<QuoteResult>;
  acceptQuote(id): Promise<QuoteResult>;
  convertQuoteToInvoice(id): Promise<InvoiceResult>;
  createInvoice(input): Promise<InvoiceResult>;
  createCreditNote(input): Promise<InvoiceResult>;
  sendInvoice(id): Promise<DeliveryResult>;
  getInvoiceStatus(id): Promise<InvoiceStatus>;
  sendElectronicInvoice(id): Promise<EInvoicingResult>;
  getElectronicInvoiceStatus(id): Promise<EInvoicingStatus>;
  transmitPaymentStatus(input): Promise<void>;
  downloadDocument(id, format): Promise<FileResult>;
}
```

Ne jamais mettre les clés API dans le frontend. Les connexions doivent être faites côté serveur avec secrets dans un coffre sécurisé / variables d'environnement.

## 4. Connecteurs à prévoir

### A. Officiels / réglementaires
1. **DGFiP — liste officielle des Plateformes Agréées**
   - source de vérité pour le statut PA ;
   - synchronisation périodique de la liste ;
   - date de dernière vérification ;
   - statut : définitive / en attente / retirée ou autre statut publié ;
   - URL officielle de la fiche fournisseur.

2. **Annuaire de la facturation électronique**
   - rechercher une entreprise destinataire ;
   - récupérer sa plateforme et son adresse de facturation lorsque le service/API utilisé par JTransport le permet ;
   - ne pas inventer une adresse de facturation.

3. **Chorus Pro**
   - factures destinées à l'État, collectivités et établissements publics ;
   - dépôt/suivi ;
   - API/EDI selon les besoins et les conditions d'accès ;
   - récupérer les statuts.

4. **Peppol**
   - prévoir un connecteur réseau Peppol lorsque le fournisseur choisi le supporte ;
   - vérifier les exigences Peppol France et le statut réglementaire du fournisseur.

### B. Fournisseurs commerciaux
Le back-office doit permettre d'ajouter plusieurs fournisseurs de facturation/devis sans modifier le code métier.

Exemples à prévoir comme intégrations potentielles (leur statut PA doit toujours être vérifié dans la liste officielle DGFiP avant d'être présenté comme « plateforme agréée ») :
- Sellsy ;
- Cegid ;
- Sage ;
- Yooz ;
- autres plateformes présentes dans la liste officielle DGFiP.

Pour chaque fournisseur :
- nom ;
- site officiel ;
- statut PA vérifié ;
- date de dernière vérification ;
- API disponible ;
- création de devis ;
- création de facture ;
- e-invoicing ;
- e-reporting ;
- paiements ;
- avoirs ;
- webhooks ;
- formats supportés ;
- tarifs ;
- pays ;
- documentation développeur ;
- état de connexion JTransport.

## 5. Formats électroniques

Prévoir une architecture capable de gérer les formats réglementaires applicables, notamment :
- Factur-X ;
- UBL ;
- CII ;
- PDF pour consultation humaine lorsque pertinent ;
- XML et métadonnées associées ;
- statuts de cycle de vie.

Ne pas confondre un simple PDF avec une facture électronique réglementaire structurée.

## 6. Workflow JTransport

Mission → devis → acceptation → commande/ordre de transport → prestation → facture → paiement → statut de paiement → e-invoicing/e-reporting → archivage.

Cas de figure :
- acompte avant mission ;
- solde après livraison ;
- paiement partiel ;
- commission JTransport ;
- frais du transporteur ;
- facture du prestataire ;
- facture client ;
- avoir ;
- remboursement ;
- litige.

## 7. Facturation marketplace

Pour une mission marketplace, séparer les flux :
- montant payé par le donneur d'ordre ;
- commission JTransport ;
- montant revenant au prestataire ;
- frais additionnels ;
- TVA ;
- retenues/remboursements ;
- statut de paiement.

Le système doit produire les documents nécessaires à chaque partie selon le modèle économique et juridique retenu. Ne pas supposer que JTransport doit juridiquement facturer à la place du prestataire : le modèle de facturation doit être configurable et validé juridiquement.

## 8. Numérotation et conformité

- séquence de numérotation configurable par entité légale ;
- pas de doublons ;
- journal d'audit ;
- verrouillage d'une facture émise ;
- corrections par avoir plutôt que modification sauvage ;
- conservation de la facture originale ;
- gestion des taux de TVA et régimes applicables ;
- mentions légales configurables par pays ;
- devis acceptés conservés avec preuve d'acceptation ;
- signature électronique lorsque nécessaire ;
- archivage et traçabilité.

## 9. Interface utilisateur

Ajouter dans le tableau de bord :
- Devis
- Factures
- Avoirs
- Paiements
- Relances
- Factures fournisseurs
- Documents électroniques
- Paramètres de facturation
- Plateforme agréée / e-invoicing
- Connexion comptable

Ajouter des boutons :
- Nouveau devis
- Transformer en facture
- Envoyer
- Télécharger PDF
- Envoyer électroniquement
- Voir statut
- Relancer
- Créer un avoir
- Marquer comme payé
- Voir l'historique

## 10. Back-office administrateur

Créer une page : **Administration → Facturation & conformité**.

Elle doit permettre de :
- gérer les fournisseurs ;
- activer/désactiver un connecteur ;
- vérifier les statuts PA ;
- afficher la date de dernière vérification ;
- configurer les API ;
- tester la connexion ;
- consulter les erreurs ;
- rejouer un envoi échoué ;
- consulter les webhooks ;
- consulter les journaux ;
- gérer les règles par pays ;
- choisir un fournisseur par défaut ;
- conserver un fournisseur de secours lorsque techniquement et réglementairement possible.

## 11. Sécurité

- chiffrement des secrets ;
- aucun secret dans l'application mobile/web ;
- RBAC strict ;
- séparation des comptes entreprise ;
- logs d'accès ;
- audit des documents ;
- contrôle anti-doublon ;
- idempotency keys pour les appels de facturation ;
- webhooks signés et vérifiés ;
- antivirus/contrôle des documents uploadés ;
- sauvegardes ;
- suppression/archivage selon politique légale et contractuelle.

## 12. Règle produit essentielle

JTransport doit pouvoir **générer ses propres devis et factures dans son interface**, mais la couche réglementaire d'émission électronique doit passer par une architecture compatible avec la réforme française et par une **Plateforme Agréée** lorsque la réglementation l'impose.

Le produit ne doit jamais afficher « agréé par l'État » sans preuve actuelle issue de la source officielle DGFiP.

\n# ANNEXE TECHNIQUE — ARCHITECTURE_IMPLEMENTATION.md\n

## Dispatcher / dernier kilomètre

Ajouter un domaine métier dédié :
- Organizations / tenants
- DispatcherCenter
- Drivers
- Vehicles
- Parcels
- ParcelScanEvents
- Routes / Stops
- Assignments
- DeliveryAttempts
- ProofOfDelivery
- Incidents
- Notifications
- AuditLogs

Le tracking doit être piloté par des événements métier et non par de simples changements d'interface. Les scans et POD doivent être persistés côté serveur. Les données de position doivent respecter le consentement et les règles applicables.

Le web doit servir les opérations desktop (centrale, tableaux, carte, statistiques) et le mobile doit servir les opérations terrain (scan, navigation, POD).

\n# ANNEXE TECHNIQUE — PLATEFORME_WEB_DESKTOP_RESPONSIVE.md\n
# JTRANSPORT — EXPÉRIENCE ORDINATEUR / WEB RESPONSIVE

JTransport doit être utilisable sur ordinateur sans réduire l'application mobile à une simple version agrandie.

## 1. Produits

### JTransport Mobile
Pour particuliers, clients, transporteurs, chauffeurs et livreurs selon le rôle.

### JTransport Web
Pour particuliers et professionnels, avec expérience desktop complète.

### JTransport Pro / Centrale
Pour entreprises, transporteurs, Dispatchers, transitaires et équipes opérationnelles.

### JTransport Driver
Application mobile dédiée au chauffeur/livreur.

## 2. Responsive

Breakpoints à prévoir au minimum :
- mobile ;
- tablette ;
- desktop ;
- grand écran.

Le desktop doit exploiter l'espace disponible : tableaux, filtres, carte, timeline, panneaux latéraux, statistiques.

## 3. Menu desktop principal

- Accueil
- Rechercher
- Missions
- Publier une mission
- Transport
- Prestataires
- Dispatch / Centrale
- Suivi
- Devis
- Factures
- Contrats
- Documents
- Entreprise
- Capacité professionnelle
- Import / Export
- Douane
- Messages
- Support
- Mon compte

Les éléments visibles dépendent du rôle.

## 4. Accueil

Reprendre l'esprit des références visuelles fournies : bleu/blanc, professionnel, cartes arrondies, grandes actions rapides, recherche centrale et accès direct aux services de transport.

Le contenu doit cependant rester **100 % JTransport** : pas de catégories e-commerce généralistes.

## 5. Accueil professionnel

Pour une entreprise :
- missions actives ;
- expéditions ;
- colis en transit ;
- devis en attente ;
- factures à payer ;
- contrats ;
- alertes ;
- dépenses ;
- KPI.

## 6. Accueil Dispatcher

Afficher en priorité :
- colis à affecter ;
- tournées ;
- livreurs actifs ;
- colis en livraison ;
- exceptions ;
- carte opérationnelle ;
- scans récents ;
- POD à contrôler.

\n# ANNEXE TECHNIQUE — PROMPT_CLAUDE.md\n
# PROMPT À DONNER À CLAUDE — JTRANSPORT MARKETPLACE

Tu dois poursuivre le développement du starter fourni dans ce dossier.

Objectif : transformer ce prototype en marketplace JTransport production-ready.

Priorités :
1. Conserver les parcours Client, Entreprise, Prestataire, Transporteur, Chauffeur et Admin.
2. Remplacer les données locales par une vraie API et une vraie base de données.
3. Implémenter authentification, rôles et permissions.
4. Implémenter création/publication/recherche de missions.
5. Implémenter matching, offres, contre-offres et attribution.
6. Implémenter messagerie liée à chaque mission.
7. Implémenter réservation, paiement et commissions avec un prestataire de paiement adapté.
8. Implémenter documents, preuve de livraison, avis et litiges.
9. Préparer le tracking et les intégrations transporteurs.
10. Ajouter un back-office complet.
11. Ajouter validation des prestataires et documents.
12. Ajouter responsive web et parcours mobiles.
13. Ne jamais mettre de secrets/API keys dans le frontend.
14. Ajouter validation des formulaires, gestion d'erreurs, logs et tests.
15. Prévoir multi-pays, multi-devise, multilingue et fuseaux horaires.

Avant d'ajouter des services externes, expliquer brièvement le choix technique et créer une couche d'abstraction pour pouvoir remplacer le fournisseur sans réécrire le métier.

Le prototype fourni n'est qu'un point de départ. Ne pas considérer les données de démonstration comme des données de production.


## DIRECTIVE PRODUIT IMPORTANTE

Lire impérativement `VISION_GLOBALE_JTRANSPORT.md` avant de coder. Le projet doit évoluer d'une simple marketplace de missions vers un guichet unique du transport, de la logistique et du commerce international. Inclure les comptes particuliers et professionnels, le Mode PRO entreprise, la marketplace de prestataires et capacités, les contrats et ordres de transport, les documents, paiements, douane/dédouanement, export/import, fret maritime/aérien/ferroviaire/routier, transport de véhicules et tracking unifié. Ne pas créer de fausses données douanières ou réglementaires : les calculs et formalités officielles devront dépendre de données et intégrations adaptées au pays. Le design doit rester proche du prototype visuel JTransport fourni : premium, professionnel, clair, moderne et cohérent web/mobile.


## NOUVELLE FONCTIONNALITÉ OBLIGATOIRE — CAPACITÉ PROFESSIONNELLE

Lire `MODULE_CAPACITE_PROFESSIONNELLE.md` et intégrer ce module à la Marketplace.

Le besoin produit est double :
- aider une personne qui veut créer une entreprise de transport mais qui n'a pas encore la qualification/capacité requise ;
- permettre à des professionnels qualifiés de proposer, lorsque le droit applicable l'autorise, leurs services comme gestionnaires de transport/prestataires.

Ne jamais implémenter cela comme une vente ou location libre d'un diplôme.
Mettre en place vérification documentaire, conformité, limites réglementaires, contrats, signature électronique, checklist administrative et liens officiels par pays.

Pour la France, distinguer DREAL/DRIEAT/DEAL et adapter les démarches selon l'activité.

## NOUVEAU MODULE OBLIGATOIRE — DEVIS, FACTURES ET FACTURATION ÉLECTRONIQUE

Lire impérativement `INTEGRATIONS_FACTURATION_DEVIS.md` et `FACTURATION_DEVIS_CONFIG.json`.

JTransport doit intégrer un module complet de devis, factures, avoirs, acomptes, paiements, relances et facturation électronique. Le parcours doit pouvoir partir d'une mission, produire un devis, faire accepter le devis, transformer le devis en commande/mission puis en facture et suivre le paiement.

Créer une couche `BillingProviderAdapter` pour ne jamais coupler le métier JTransport à un seul fournisseur.

Intégrations à prévoir :
- liste officielle DGFiP des plateformes agréées comme source de vérité ;
- annuaire officiel de la facturation électronique ;
- Chorus Pro pour la sphère publique ;
- Peppol lorsque le fournisseur choisi le supporte ;
- fournisseurs commerciaux de devis/facturation via des adaptateurs interchangeables.

IMPORTANT : ne jamais afficher un fournisseur comme « agréé par l'État » uniquement parce qu'il est connu ou parce qu'il apparaît dans une liste commerciale. Le statut PA doit être vérifié dans la liste officielle DGFiP et accompagné d'une date de vérification.

Prévoir les formats Factur-X, UBL, CII et XML selon le cas d'usage, ainsi que PDF pour consultation humaine. Un PDF seul ne doit pas être considéré comme une facture électronique réglementaire structurée.

Le back-office doit permettre de configurer les fournisseurs, les clés/API côté serveur, les webhooks, les statuts, les erreurs, les retries, les journaux, l'archivage et les règles par pays.

Ne jamais mettre de clé API ou secret dans le frontend/mobile.

## NOUVEAU MODULE OBLIGATOIRE — DISPATCHER / CENTRALE / LIVREURS

Lire impérativement `MODULE_DISPATCHER_CENTRALE_LIVRAISON.md`, `PLATEFORME_WEB_DESKTOP_RESPONSIVE.md` et `PROCESSUS_GLOBAL_EXPEDITION.md`.

JTransport doit gérer le cas où une entreprise de transport confie un lot de marchandises à un Dispatcher. Le Dispatcher dispose d'une centrale opérationnelle dans JTransport, reçoit/scanne les colis, les affecte à ses livreurs, crée les tournées, suit les livraisons et contrôle les preuves de livraison.

Créer au minimum les rôles : `SHIPPER`, `TRANSPORT_COMPANY`, `DISPATCHER_ADMIN`, `DISPATCHER_OPERATOR`, `DRIVER`, `LOGISTICS_PROVIDER`, `ADMIN` et les rôles client appropriés.

### Dispatcher
Le Dispatcher doit pouvoir :
- créer/gérer sa centrale ;
- importer des colis par API/CSV/Excel ou scanner ;
- réceptionner des lots ;
- gérer les colis ;
- créer des tournées ;
- affecter un chauffeur/livreur et un véhicule ;
- suivre les scans ;
- suivre les exceptions ;
- voir une carte opérationnelle ;
- contrôler les POD ;
- communiquer avec les acteurs ;
- générer les rapports et éléments de facturation.

### Livreur
Créer une application mobile `JTransport Driver` ou un espace mobile dédié. Le livreur doit avoir son propre compte, son propre mot de passe/session et ne doit jamais partager les identifiants du Dispatcher.

Fonctions obligatoires : connexion, disponibilité, tournée, liste des colis, navigation, scan code-barres/QR, statuts, preuve de livraison, signature, photo, motif d'échec, incident, synchronisation et historique.

### Scan
Chaque scan est un événement serveur immuable ou auditable comprenant au minimum : colis, type d'événement, utilisateur, date/heure, tournée, organisation et position lorsque l'utilisateur a autorisé cette donnée et que son utilisation est permise.

### Suivi partagé
La timeline d'un colis doit être visible par les acteurs autorisés. Ne jamais exposer les données d'une organisation à une autre organisation.

### Multi-tenant / sécurité
Mettre en place organisations/tenants + RBAC + permissions fines + audit logs. Un Dispatcher peut travailler avec plusieurs donneurs d'ordre mais leurs données doivent rester isolées.

### Desktop
JTransport doit être une vraie application web responsive utilisable sur ordinateur. Ne pas simplement étirer l'interface mobile. Prévoir tableaux, filtres, carte, statistiques, panneaux de détails et dashboards professionnels.

### Design
S'inspirer des images de référence présentes dans `design/reference-images/`, mais conserver l'identité JTransport : **bleu + blanc**, professionnel, moderne, transport/logistique uniquement. Les écrans desktop et mobile doivent former un même système de design.

### Architecture
Prévoir les entités `Organization`, `DispatcherCenter`, `Driver`, `Vehicle`, `Shipment`, `Parcel`, `ParcelScanEvent`, `Route`, `RouteStop`, `Assignment`, `DeliveryAttempt`, `ProofOfDelivery`, `Incident`, `Notification` et `AuditLog`.

Créer des abstractions `RoutingProviderAdapter`, `TrackingProviderAdapter`, `NotificationProviderAdapter` et `BillingProviderAdapter` afin de ne pas verrouiller JTransport sur un fournisseur.

## DIRECTIVE DE DÉVELOPPEMENT

Ne pas se limiter à des pages statiques. Construire les parcours de données et les contrats d'API nécessaires, avec validation, états de chargement, erreurs, permissions, tests et persistance. Le starter fourni sert de base ; compléter l'architecture au lieu de supprimer les fonctionnalités existantes.

## MODULE OBLIGATOIRE — MARKETPLACE DES CAPACITÉS DE TRANSPORT TOUS DOMAINES

Lire `MODULE_CAPACITE_ET_MARKETPLACE_TRANSPORT_COMPLETE.md` avant toute implémentation du module de capacités.

JTransport doit permettre à un professionnel/entreprise de **proposer ses capacités de transport** dans tous les domaines supportés : marchandises, voyageurs, routier, maritime, aérien, ferroviaire, multimodal, dernier kilomètre, véhicules, fret et services logistiques associés, avec des catégories configurables par pays.

Le système doit distinguer :
- capacité matérielle (véhicule, flotte, navire, capacité cargo, wagon, etc.) ;
- capacité opérationnelle (zones, disponibilité, routes, volume, poids) ;
- qualification/licence/certificat/agrément réglementaire ;
- prestation de gestionnaire de transport lorsque légalement permise.

Ne jamais présenter le produit comme « louer un diplôme ». Utiliser « proposer sa capacité », « proposer ses services », « gestionnaire de transport », « professionnel qualifié » ou « mise en relation », selon le cas.

Le module doit inclure : profils, vérification, matching, devis, négociation, contrats, signature, réservation, mission, tracking, facturation, paiement, commission, avis et audit.

### Facturation électronique

Lire aussi `INTEGRATIONS_FACTURATION_DEVIS.md`. Pour la France, la DGFiP est la source de vérité pour le statut des plateformes agréées. Prévoir synchronisation de la liste officielle, identifiant d'immatriculation, statut et date de dernière vérification. Ne jamais hardcoder le statut « agréé ».

Prévoir Chorus Pro pour le secteur public et Peppol lorsque supporté. Utiliser `BillingProviderAdapter` et `EInvoicingProviderAdapter` afin de pouvoir changer de fournisseur sans réécrire le métier.

### Références visuelles

Lire `design/launch/JTransport_UX_Storyboard_Complet.png` et `design/launch/JTransport_Splash_Loading.png` comme références de parcours et de design. Le storyboard représente le parcours : splash → chargement animé → onboarding → connexion/inscription → choix de profil → vérification → accueil → dashboards → suivi → dispatcher → livreur → contrat/signature.

Le splash doit afficher une **barre de chargement réellement animée** avant l'ouverture de l'application. Une fois l'initialisation terminée :
1. vérifier une session existante ;
2. si l'utilisateur est connecté et son compte configuré, ouvrir directement son accueil ;
3. sinon afficher onboarding/connexion/inscription ;
4. après création et vérification du compte, ouvrir l'accueil correspondant au rôle choisi.

Ne pas simuler un chargement bloquant inutilement : afficher les étapes réelles d'initialisation (configuration, session, version, services essentiels) et permettre la reprise en cas d'erreur.

## NOUVEAU MODULE OBLIGATOIRE — MENU PRINCIPAL JTRANSPORT + CONTACTS

Lire impérativement `MODULE_MENU_PRINCIPAL_CONTACTS.md` et utiliser `design/reference-images/JTransport_Menu_Principal_Reference.jpeg` comme référence visuelle principale pour l'accueil.

Reproduire l'esprit de l'écran : bleu + blanc, premium, professionnel, transport/logistique, recherche globale, raccourcis, catégories, services, espace PRO et navigation mobile.

IMPORTANT : toutes les cartes et tous les boutons doivent être fonctionnels. Implémenter les routes, états, API, validations, permissions, chargements, erreurs et persistance nécessaires. Ne pas livrer un écran statique.

L'accueil doit notamment proposer :
- Publier une mission ;
- Trouver un prestataire ;
- Créer mon entreprise de transport ;
- Mes capacités & offres ;
- calcul d'envoi ;
- transport international ;
- marchandises ;
- voyageurs ;
- maritime ;
- aérien ;
- ferroviaire ;
- véhicules ;
- colis/palettes ;
- douane/dédouanement ;
- import/export ;
- logistique/entreposage ;
- mise à disposition de capacité ;
- devis/factures ;
- contrats/signature ;
- suivi/tracking ;
- assurance ;
- litiges ;
- espace entreprises.

### CONTACTS OBLIGATOIRES

Permettre les contacts entre particuliers, entreprises et professionnels via :
- messagerie JTransport ;
- e-mail ;
- téléphone ;
- adresse professionnelle ;
- demande de devis ;
- demande de mission.

Les entreprises/professionnels peuvent afficher leurs coordonnées professionnelles lorsqu'ils l'autorisent : e-mail professionnel, numéro professionnel et adresse professionnelle.

Pour les particuliers, créer des paramètres de visibilité. Ne pas exposer par défaut l'e-mail, le téléphone ou l'adresse résidentielle publiquement. Les adresses nécessaires à une livraison/retrait doivent être partagées de façon sécurisée avec les acteurs autorisés.

Ajouter les modèles `ContactProfile`, `PostalAddress`, `Conversation` et les endpoints décrits dans le module. Toutes les données de contact doivent respecter authentification, RBAC, isolation tenant, consentement/visibilité, audit, anti-spam et rate limiting.

Lorsqu'un utilisateur clique sur « Contacter » depuis une mission, un prestataire, un devis ou un contrat, ouvrir une conversation liée au contexte métier. Permettre pièces jointes, notifications, messages lus/non lus et historique.

### CRITÈRE FINAL

Je veux un accueil réellement utilisable, pas une image reproduite. Si l'utilisateur clique sur une fonction, il doit arriver sur le bon écran et l'action doit persister dans le backend.

## MODULE OBLIGATOIRE — EXPÉDITION INTERNATIONALE DE BOUT EN BOUT

Lire impérativement `MODULE_EXPEDITION_CONTAINER_DOUANE_PAIEMENT_TRACKING.md` et l'intégrer au produit existant sans supprimer les fonctionnalités déjà prévues.

Je veux que JTransport fonctionne réellement comme un guichet unique : un particulier ou une entreprise crée une expédition, dépose/fait collecter ses colis, peut les regrouper dans un lot et un conteneur, suit le conteneur et les colis depuis son compte, gère les documents, les formalités douanières, les frais et les paiements disponibles depuis l'application, puis suit la livraison finale et récupère la preuve de livraison.

### Exigence de fonctionnement

Ne crée pas uniquement des écrans. Pour chaque action, implémente :
- modèle de données ;
- migration/schema ;
- API serveur ;
- validation serveur et frontend ;
- RBAC/ABAC ;
- persistance ;
- états métier ;
- loading/empty/error/success ;
- notifications ;
- audit ;
- tests unitaires/intégration/E2E ;
- intégration réelle via adaptateur lorsque nécessaire.

### Parcours obligatoire

`Shipment → Parcel → ConsolidationLot → Container → ContainerEvent/TrackingEvent → CustomsCase → Documents → Fees → Payment → CustomsCleared/Released → LastMile → POD → Completed`.

Créer les écrans « Mes expéditions », « Détails », « Mes colis », « Mon conteneur », « Tracking », « Douane », « Documents », « À payer », « Paiement », « Factures », « Messages », « Incidents » et « POD ».

### Paiement

Utiliser un fournisseur de paiement adapté et une architecture `PaymentProviderAdapter`. Confirmer les paiements par webhook côté serveur et utiliser l'idempotence. Ne jamais stocker de carte ou de secret bancaire dans le frontend. Ne jamais afficher « payé » sur la seule base d'un retour navigateur.

### Douane

Créer `CustomsProviderAdapter` et `CustomsRulesAdapter`. Ne pas hardcoder les règles mondiales. Les estimations douanières doivent être clairement marquées comme estimations. Les montants officiels doivent venir de la source compétente/intégration autorisée ou du déclarant/transitaire.

### Tracking

Créer `TrackingProviderAdapter` et gérer webhooks. Si aucune position GPS réelle n'est disponible, afficher la dernière position/événement connu, jamais une fausse position.

### Documents

Utiliser stockage privé, contrôle d'accès et URLs signées temporaires. Versionner les documents et conserver l'audit.

### Test E2E obligatoire

Construire un scénario de démonstration : particulier → 3 colis → groupage → conteneur maritime → départ → tracking → arrivée → dossier douane → documents manquants → upload → frais → paiement de test via sandbox → confirmation webhook → dédouanement/libération → livraison → POD → facture/reçu.

Les paiements de démonstration doivent utiliser un environnement sandbox/test et ne doivent jamais être présentés comme des paiements réels.


## RÉFÉRENCES VISUELLES APPROUVÉES — NOUVEL AJOUT

Les cinq captures présentes dans `app/design/reference-images/approved-current/` sont des références visuelles approuvées pour l'interface JTransport :
- accueil particulier / missions recommandées ;
- liste des missions ;
- détail d'une mission ;
- publication d'une mission ;
- profil d'un transporteur/prestataire.

Claude doit s'en servir pour comprendre la hiérarchie des écrans, les informations affichées et les parcours utilisateur, tout en conservant le design JTransport bleu/blanc et en reliant les contrôles à de vraies fonctionnalités.

### Règle stricte sur les catégories

JTransport est exclusivement centré sur le transport, la logistique, l'export/import, les véhicules et les services connexes. Toute ancienne image ou maquette montrant une marketplace généraliste (vêtements, mode, téléphones, alimentation, électroménager ou autres catégories sans rapport avec le transport) est exclue des références de conception et ne doit pas être reproduite.

### Règle stricte « fonctionnel, pas seulement visuel »

Toute action visible dans les références doit avoir un comportement réel : navigation, formulaire validé, authentification, API, base de données, messagerie, devis, offre, paiement, suivi, documents, notifications, permissions et gestion des erreurs selon le contexte.
