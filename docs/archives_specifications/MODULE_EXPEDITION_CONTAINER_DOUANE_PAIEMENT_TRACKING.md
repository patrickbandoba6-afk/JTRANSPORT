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
