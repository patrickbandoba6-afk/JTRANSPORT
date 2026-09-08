# JTRANSPORT — CAHIER DES CHARGES UNIQUE ET MASTER

**Version consolidée — toutes les demandes et spécifications JTransport regroupées dans un seul cahier des charges.**

## 0. INSTRUCTION ABSOLUE POUR CLAUDE

Construire JTransport comme une véritable plateforme de transport et de logistique, fonctionnelle sur **mobile et ordinateur**, et non comme une simple maquette visuelle.

Toutes les fonctions visibles doivent être reliées à une architecture réelle : base de données, authentification, rôles et permissions, API, validations, états métier, persistance, notifications, documents, paiements, facturation, tracking, contrats, sécurité, journalisation et tests.

Le projet doit être modulaire, multi-tenant, évolutif et prêt pour une mise en production progressive. Aucun bouton principal ne doit être décoratif ou sans action.

---

## 1. VISION GLOBALE

JTransport est un **guichet unique numérique du transport, de la logistique, du fret, de l'import/export et des services associés**.

La plateforme met en relation :
- particuliers ;
- entreprises ;
- donneurs d'ordre ;
- transporteurs ;
- chauffeurs/livreurs ;
- dispatchers et centrales ;
- commissionnaires ;
- transitaires ;
- gestionnaires de transport ;
- logisticiens ;
- entrepôts ;
- prestataires d'assurance, emballage et manutention ;
- partenaires et opérateurs de transport.

Objectif : permettre à un utilisateur de rechercher, réserver, payer, documenter, suivre et terminer une opération de transport sans devoir reconstruire tout son dossier sur plusieurs outils.

---

## 2. TOUS LES DOMAINES DE TRANSPORT

### Transport de marchandises
- colis ;
- palettes ;
- groupage ;
- lots complets ;
- express ;
- messagerie ;
- marchandises diverses ;
- transport spécialisé selon réglementation.

### Transport de voyageurs
- transport de personnes ;
- prestations de transport voyageurs ;
- recherche de professionnels adaptés ;
- missions et contrats associés.

### Fret
- routier ;
- maritime ;
- aérien ;
- ferroviaire ;
- multimodal.

### Transport de véhicules
- voitures ;
- utilitaires ;
- camions ;
- motos ;
- autres véhicules autorisés.

### Services logistiques
- collecte ;
- livraison ;
- stockage ;
- entreposage ;
- manutention ;
- emballage ;
- assurance ;
- frais de terminal ;
- frais de port/aéroport/gare ;
- carburant/péages selon devis ;
- documents ;
- douane ;
- dédouanement ;
- livraison finale.

---

## 3. MENU PRINCIPAL — RÉFÉRENCE VISUELLE FOURNIE

Le menu principal doit reprendre l'esprit et la structure de la référence fournie par le client :
`design/reference-images/JTransport_Menu_Principal_Reference.jpeg`

Style : **bleu + blanc**, premium, moderne, professionnel, orienté transport/logistique.

### En-tête
- logo JTransport ;
- notifications ;
- compte utilisateur ;
- recherche globale ;
- accès rapide aux filtres.

### Actions principales
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
- Accueil ;
- Rechercher ;
- Nouvelle mission ;
- Mes missions ;
- Messages ;
- Mon compte.

Chaque élément doit conduire à une route réelle et/ou à une action API.

---

## 4. RECHERCHE GLOBALE

La recherche doit permettre de rechercher :
- mission ;
- transporteur ;
- chauffeur ;
- prestataire ;
- commissionnaire ;
- transitaire ;
- logisticien ;
- capacité de transport ;
- colis ;
- palette ;
- véhicule ;
- conteneur ;
- devis ;
- facture ;
- contrat ;
- service.

Filtres selon le contexte : pays, ville, route, date, mode de transport, poids, volume, véhicule, prix, disponibilité, vérification, notation, assurance et statut.

---

## 5. MARKETPLACE : BESOIN ET OFFRE DE CAPACITÉ

JTransport doit fonctionner dans les deux sens.

### Client / donneur d'ordre
Publier une mission, recevoir des offres, comparer, négocier, sélectionner, contractualiser, payer et suivre.

### Transporteur / prestataire
Publier une capacité disponible, rechercher des missions, répondre, négocier, contractualiser, affecter un véhicule/chauffeur, exécuter et facturer.

### Matching
Le moteur rapproche automatiquement les besoins et capacités selon :
- localisation ;
- route ;
- disponibilité ;
- type de véhicule ;
- capacité ;
- poids ;
- volume ;
- prix ;
- notation ;
- vérification ;
- expérience ;
- historique ;
- contraintes ;
- assurance et conformité.

Afficher un **score de compatibilité** avec les raisons principales du classement.

---

## 6. CAPACITÉ PROFESSIONNELLE, QUALIFICATIONS ET CRÉATION D'ENTREPRISE

Ajouter l'entrée : **« Je veux créer mon entreprise de transport »**.

L'utilisateur choisit notamment :
- transport marchandises ;
- transport voyageurs ;
- commissionnaire ;
- logistique ;
- international ;
- maritime ;
- aérien ;
- ferroviaire ;
- autre activité réglementée ;
- pays d'établissement.

Le système demande le statut de qualification/capacité, vérifie les pièces et, si nécessaire, permet de :
- trouver un professionnel qualifié ;
- trouver un gestionnaire de transport lorsque la réglementation le permet ;
- trouver une formation ;
- préparer un examen ;
- consulter les démarches officielles ;
- constituer un dossier administratif ;
- suivre l'avancement du dossier.

### Règle juridique importante
Ne jamais présenter un diplôme ou une capacité professionnelle comme un produit librement « louable » ou « vendable ».

Le marketplace doit présenter une **mise en relation avec des professionnels qualifiés et des services de gestion/assistance conformes à la réglementation applicable**.

Les règles doivent être configurables par pays et activité : qualification, licence, certificat, agrément, autorisation, limites réglementaires, dates d'expiration, etc.

### Vérification
- identité ;
- documents ;
- qualification ;
- licence/certificat/agrément ;
- autorité émettrice ;
- numéro de référence ;
- dates ;
- expérience ;
- zone ;
- disponibilité ;
- limites réglementaires.

Prévoir contrôle manuel/automatique, signalement, suspension, audit, détection de doublons et lutte contre faux documents.

---

## 7. CONTRATS ET SIGNATURE

Types :
- contrat de transport ;
- sous-traitance ;
- prestation logistique ;
- mise à disposition de capacité ;
- gestionnaire de transport ;
- mission ;
- contrat cadre ;
- ordre de transport ;
- multimodal.

Workflow :
**modèle → préremplissage → conditions → devis → acceptation → signature électronique → horodatage/audit → archivage → renouvellement/résiliation.**

Prévoir versions, permissions, historique et alertes d'expiration.

Ne pas prétendre à une validité juridique particulière sans fournisseur de signature et conformité appropriés.

---

## 8. CONTACT PARTICULIER ↔ ENTREPRISE / PROFESSIONNEL

Le contact doit être simple depuis :
- profil ;
- mission ;
- devis ;
- commande ;
- expédition ;
- contrat.

### Entreprise / professionnel
Lorsque le professionnel autorise l'affichage :
- nom ;
- e-mail professionnel ;
- téléphone professionnel ;
- adresse professionnelle ;
- ville/pays ;
- horaires ;
- services ;
- zones desservies ;
- statut de vérification.

Actions :
- Contacter ;
- Appeler ;
- E-mail ;
- Demander un devis ;
- Envoyer une demande.

### Particulier
Par défaut, le particulier dispose de la messagerie JTransport mais ses coordonnées personnelles ne sont pas publiées automatiquement.

Il choisit ce qu'il partage. Les adresses nécessaires à l'exécution d'une mission sont accessibles uniquement aux acteurs autorisés.

### Messagerie
- conversations contextualisées ;
- messages ;
- pièces jointes ;
- notifications ;
- historique ;
- signalement ;
- anti-spam ;
- limitation de fréquence ;
- audit des accès aux coordonnées.

---

## 9. EXPÉDITION INTERNATIONALE DE BOUT EN BOUT

JTransport doit permettre à un particulier ou une entreprise de gérer une expédition internationale depuis son compte.

### Parcours de référence
**Création → collecte/dépôt → réception → groupage → conteneur → chargement → départ → transit → arrivée → dossier douane → frais → paiement → dédouanement → libération → livraison finale → preuve de livraison → clôture.**

Le système doit supporter un ou plusieurs colis dans un lot/conteneur.

### Exemple utilisateur
Un client met plusieurs colis dans un conteneur. Depuis son compte il voit :
- ses colis ;
- le conteneur ;
- le trajet ;
- les événements ;
- la dernière position connue ;
- l'ETA lorsqu'elle est disponible ;
- les documents ;
- les documents manquants ;
- les frais ;
- les paiements ;
- les contacts ;
- les incidents ;
- la livraison finale.

---

## 10. COMPTE PERSONNEL DE SUIVI

Le particulier doit avoir un espace clair :
- Mes colis ;
- Mes expéditions ;
- Mes conteneurs ;
- Suivi ;
- Mes documents ;
- Mes frais ;
- Mes paiements ;
- Mes factures ;
- Mes messages ;
- Assistance ;
- Mes litiges.

### Timeline
Afficher les événements réels reçus du système ou des partenaires :
- création ;
- réception ;
- scan ;
- groupage ;
- chargement ;
- départ ;
- transit ;
- arrivée ;
- douane ;
- paiement ;
- dédouanement ;
- libération ;
- livraison ;
- POD.

Ne jamais inventer une position, une ETA ou un statut non reçu.

---

## 11. CONTENEURS ET FRET MARITIME

Supporter :
- FCL ;
- LCL ;
- conteneurs 20 pieds ;
- 40 pieds ;
- 40HC ;
- autres types configurables.

Données :
- numéro conteneur ;
- expédition ;
- colis/lots associés ;
- port de départ ;
- port d'arrivée ;
- terminal ;
- compagnie maritime/partenaire ;
- date de départ ;
- ETA ;
- événements ;
- connaissement ;
- frais ;
- douane ;
- livraison finale.

Prévoir un adaptateur de tracking maritime afin de ne pas enfermer JTransport dans un seul fournisseur.

---

## 12. FRET AÉRIEN

Supporter :
- devis ;
- poids réel ;
- poids volumétrique ;
- aéroport origine/destination ;
- réservation ;
- documents ;
- tracking ;
- douane ;
- livraison finale.

---

## 13. FRET FERROVIAIRE ET MULTIMODAL

Supporter :
- itinéraires ;
- capacité ;
- wagons/conteneurs ;
- réservation ;
- tracking ;
- documents ;
- coûts ;
- correspondances multimodales ;
- livraison finale.

---

## 14. DOUANE ET DÉDOUANEMENT

Créer un dossier douanier complet contenant notamment :
- expéditeur ;
- destinataire ;
- origine ;
- destination ;
- marchandises ;
- quantité ;
- poids ;
- volume ;
- valeur déclarée ;
- emballage ;
- Incoterm ;
- mode de transport ;
- prestataire ;
- documents ;
- statut ;
- frais ;
- paiements ;
- historique.

Fonctions :
- téléchargement des documents ;
- vérification des pièces manquantes ;
- alertes ;
- transmission aux acteurs autorisés ;
- suivi du traitement ;
- conservation des réponses et preuves.

Les montants douaniers estimatifs doivent être distingués des montants officiels. Les calculs/formalités officielles doivent reposer sur les données et autorités/intégrations compétentes du pays concerné.

---

## 15. PAIEMENT DIRECTEMENT DANS JTRANSPORT

Le client doit pouvoir payer les frais disponibles depuis son application :
- transport ;
- douane/dédouanement lorsqu'un service de paiement est proposé ;
- frais de dossier ;
- stockage ;
- manutention ;
- assurance ;
- autres frais ;
- commission JTransport.

Moyens selon disponibilité :
- carte ;
- virement ;
- portefeuille ;
- paiement marketplace/séquestre lorsque juridiquement et techniquement approprié.

Prévoir :
- PaymentIntent ;
- confirmation serveur ;
- idempotence ;
- remboursements ;
- paiements partiels ;
- réconciliation ;
- reversements ;
- commissions ;
- reçus ;
- factures.

Ne jamais stocker de données bancaires sensibles directement dans le frontend.

---

## 16. FACTURATION ET FACTURATION ÉLECTRONIQUE

Parcours :
**Demande → devis → contre-offre → acceptation → mission/commande → prestation → facture → paiement → reversement.**

Fonctions :
- devis ;
- contre-offres ;
- factures ;
- avoirs ;
- reçus ;
- acomptes ;
- relances ;
- factures prestataires ;
- commissions ;
- remboursements ;
- export comptable ;
- historique.

Prévoir les formats et circuits adaptés : Factur-X, UBL, CII, XML, e-invoicing, e-reporting, annuaire, Chorus Pro et Peppol lorsque supportés.

Pour la France, le statut des plateformes agréées doit être contrôlé à partir des sources officielles DGFiP et conservé avec la date de vérification. Ne jamais présenter une plateforme comme agréée sur la seule base d'une source commerciale.

Sources officielles à intégrer dynamiquement et maintenir à jour :
- DGFiP — liste des plateformes agréées : https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees
- DGFiP — facturation électronique et plateformes agréées : https://www.impots.gouv.fr/facturation-electronique-et-plateformes-agreees
- AIFE — facturation électronique B2B : https://aife.economie.gouv.fr/nos-applications/facturation-electronique-b2b/
- Annuaire de la facturation électronique : https://www.economie.gouv.fr/entreprises/gerer-son-entreprise-au-quotidien/gerer-sa-comptabilite-et-ses-demarches/quest-ce-que-lannuaire-de-la-facturation-electronique
- Chorus Pro : https://chorus-pro.gouv.fr/
- Documentation Chorus Pro : https://portail.chorus-pro.gouv.fr/
- Peppol France : https://www.impots.gouv.fr/rejoindre-le-reseau-peppol

---

## 17. DISPATCHER / CENTRALE / DERNIER KILOMÈTRE

Une entreprise de transport ou un dispatcher peut recevoir des lots de colis, les traiter dans une centrale puis affecter les colis à ses livreurs.

### Dispatcher
- créer une centrale ;
- recevoir des lots ;
- importer API/CSV/Excel ;
- scanner ;
- trier ;
- préparer ;
- créer des tournées ;
- affecter chauffeurs ;
- affecter véhicules ;
- suivre la carte ;
- gérer incidents ;
- gérer retours ;
- contrôler POD ;
- rapports ;
- facturation.

### Livreur — JTransport Driver
Compte individuel invité par le dispatcher.

Fonctions :
- connexion ;
- disponibilité ;
- tournée du jour ;
- liste colis ;
- ordre de livraison ;
- navigation ;
- scan QR/code-barres ;
- prise en charge ;
- chargement ;
- départ ;
- arrivée ;
- livraison ;
- signature ;
- photo ;
- échec avec motif ;
- incident ;
- retour ;
- historique ;
- synchronisation.

Le dispatcher ne connaît jamais le mot de passe du livreur.

---

## 18. ÉVÉNEMENTS DE TRACKING ET AUDIT

Chaque événement important doit être enregistré côté serveur :
- colis ;
- type d'événement ;
- utilisateur ;
- organisation ;
- date/heure ;
- tournée ;
- localisation lorsque consentie/autorisée ;
- contexte appareil si nécessaire.

Le tracking doit être **piloté par des événements métier persistés**, pas par de simples changements d'interface.

---

## 19. STATUTS

### Mission
Publié → offres reçues → attribuée → confirmée → chauffeur affecté → préparation → collecte → transit → arrivée → livraison → livrée → terminée.

### Colis
Créé → reçu → attente affectation → affecté → chargé → en route → zone d'arrivée → livraison en cours → livré / échec → reprogrammation → retour dépôt → retour expéditeur → incident → annulé.

### Expédition internationale
Créée → collecte/dépôt → réception → groupage → conteneur affecté → conteneur chargé → départ → transit → arrivée → documents douane → traitement douane → frais dus → paiement confirmé → dédouané → libéré → dernier kilomètre → livré → POD → terminé.

---

## 20. MODE PRO ENTREPRISE

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
- historique ;
- export.

---

## 21. COMPTES ET RÔLES

### Particulier
- envoyer ;
- suivre ;
- payer ;
- documents ;
- messages ;
- assistance.

### Donneur d'ordre
- publier ;
- recevoir offres ;
- négocier ;
- sélectionner ;
- signer ;
- ordonner ;
- payer ;
- suivre ;
- valider ;
- noter.

### Prestataire / transporteur
- profil ;
- vérification ;
- capacités ;
- missions ;
- offres ;
- négociation ;
- contrats ;
- ordre de transport ;
- chauffeur ;
- POD ;
- facturation ;
- paiement.

### Dispatcher
- centrale ;
- lots ;
- scans ;
- tournées ;
- chauffeurs ;
- véhicules ;
- suivi ;
- incidents ;
- POD ;
- facturation.

### Admin JTransport
- vérification ;
- configuration ;
- catalogue ;
- pays ;
- règles ;
- prestataires ;
- litiges ;
- audit ;
- sécurité ;
- supervision.

---

## 22. DOCUMENTS

Bibliothèque documentaire par dossier :
- facture ;
- bon de livraison ;
- preuve de livraison ;
- contrat ;
- ordre de transport ;
- documents véhicule ;
- assurance ;
- documents douaniers ;
- import/export ;
- connaissement ;
- lettre de transport ;
- justificatifs de paiement ;
- photos ;
- certificats/licences/qualifications.

Chaque document possède : type, propriétaire, dossier, date, version, statut, permissions et historique.

Stockage privé, contrôle d'accès, liens temporaires signés et audit.

---

## 23. LITIGES ET ASSISTANCE

Catégories :
- retard ;
- dommage ;
- colis manquant ;
- problème douanier ;
- problème documentaire ;
- paiement ;
- désaccord tarifaire ;
- autre.

Dossier :
- messages ;
- photos ;
- documents ;
- chronologie ;
- décisions ;
- remboursements éventuels.

---

## 24. AVIS ET RÉPUTATION

Après une mission, permettre une évaluation selon des règles anti-abus.

Prévoir :
- note ;
- commentaire ;
- historique ;
- modération ;
- signalement ;
- détection de fraude/manipulation.

---

## 25. CATALOGUE DE SERVICES ADMINISTRABLE

Le catalogue doit pouvoir évoluer sans modifier toute l'application.

Services :
- transport ;
- douane ;
- dédouanement ;
- stockage ;
- manutention ;
- emballage ;
- assurance ;
- fret ;
- livraison ;
- capacité ;
- véhicule ;
- chauffeur ;
- autres services.

Chaque service peut définir : pays, zone, unité de prix, règles, prestataires, disponibilité, taxes/frais et commission JTransport.

---

## 26. MULTI-PAYS / MULTI-DEVISES / MULTI-LANGUES

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

Les règles douanières, fiscales, documentaires, licences et transport doivent être configurables par pays/activité.

---

## 27. WEB DESKTOP ET MOBILE

### Web desktop
Le web doit être réellement utilisable sur ordinateur :
- tableaux ;
- dashboards ;
- filtres ;
- cartes ;
- statistiques ;
- détails ;
- documents ;
- facturation ;
- dispatch ;
- équipes ;
- flotte.

Ce n'est pas une simple version mobile agrandie.

### Mobile
Prévoir :
- application client ;
- application prestataire/transporteur ;
- JTransport Driver ;
- parcours dispatcher mobile lorsque nécessaire.

---

## 28. SPLASH, ONBOARDING ET CONNEXION

Au lancement :
1. logo JTransport ;
2. barre animée « Chargement de votre expérience… » ;
3. initialisation réelle ;
4. vérification de session ;
5. onboarding si nécessaire ;
6. connexion/inscription ;
7. choix du rôle ;
8. vérification e-mail/téléphone ;
9. configuration du compte ;
10. accueil adapté.

État logique :
`SPLASH → INITIALIZING → SESSION_CHECK → {ONBOARDING | LOGIN | ROLE_SETUP | HOME}`

Si une session valide existe, aller directement vers l'accueil après l'initialisation.

Gérer erreurs, retry et mode hors ligne de manière propre.

---

## 29. ARCHITECTURE TECHNIQUE

Architecture modulaire et multi-tenant.

Domaines recommandés :
- Auth ;
- Users ;
- Companies ;
- Organizations ;
- Provider Marketplace ;
- Missions ;
- Quotes ;
- Matching ;
- Contracts ;
- Transport Orders ;
- Shipments ;
- Parcels ;
- Containers ;
- Tracking ;
- Fleet ;
- Drivers ;
- Dispatch ;
- Documents ;
- Customs ;
- Freight ;
- Payments ;
- Billing ;
- Messaging ;
- Reviews ;
- Disputes ;
- Notifications ;
- Admin ;
- Analytics.

Entités principales :
`Organization, User, Role, Driver, DispatcherCenter, Vehicle, CapacityProvider, TransportCapacity, Qualification, License, Certificate, VerificationCase, Mission, Shipment, ShipmentParty, ShipmentItem, Parcel, ConsolidationLot, Container, ContainerLeg, ContainerEvent, TrackingEvent, Route, RouteStop, Assignment, DeliveryAttempt, ProofOfDelivery, Quote, Contract, Invoice, Payment, PaymentIntent, PaymentAllocation, Refund, Payout, CustomsCase, CustomsDeclaration, CustomsDocument, CustomsFee, Notification, Incident, Conversation, ContactProfile, PostalAddress, AuditLog.`

Adaptateurs :
- RoutingProviderAdapter ;
- TrackingProviderAdapter ;
- NotificationProviderAdapter ;
- BillingProviderAdapter ;
- EInvoicingProviderAdapter ;
- CapacityVerificationAdapter ;
- EContractProviderAdapter ;
- CustomsProviderAdapter ;
- CustomsRulesAdapter ;
- PaymentProviderAdapter.

---

## 30. API ET INTÉGRATIONS

Les API doivent être sécurisées, versionnées et documentées.

Exemples de routes :
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

Prévoir aussi les endpoints métier pour missions, devis, contrats, expéditions, colis, conteneurs, tracking, douane, paiements, documents, dispatch, POD et facturation.

---

## 31. SÉCURITÉ ET CONFIDENTIALITÉ

Obligatoire :
- authentification robuste ;
- RBAC/ABAC ;
- isolation multi-tenant ;
- contrôle d'accès objet ;
- stockage privé des documents ;
- URLs signées ;
- confirmation serveur des paiements ;
- idempotence ;
- rate limiting ;
- anti-spam ;
- logs d'audit ;
- aucune clé secrète dans le client ;
- protection des données personnelles ;
- visibilité configurable des coordonnées ;
- séparation des données particulières et professionnelles.

---

## 32. OBJECTIF D'EXPÉRIENCE UTILISATEUR

L'utilisateur doit ressentir :

**« Tout mon transport est au même endroit. »**

Il doit pouvoir :
- trouver un transport ;
- publier un besoin ;
- trouver un prestataire ;
- proposer une capacité ;
- organiser une expédition ;
- mettre un colis dans un conteneur ;
- suivre son colis/conteneur ;
- gérer ses documents ;
- payer les frais disponibles ;
- gérer la douane ;
- signer ;
- recevoir les factures ;
- contacter les acteurs ;
- suivre la livraison finale.

L'application doit rester simple grâce à des assistants étape par étape, des catégories, une recherche globale et des tableaux de bord adaptés au rôle.

---

## 33. CRITÈRES D'ACCEPTATION GLOBAUX

Une version considérée fonctionnelle doit notamment permettre :

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

---

## 34. LIVRABLES ATTENDUS DE CLAUDE

Claude doit produire, selon le stack retenu :
- frontend web ;
- frontend mobile ;
- backend ;
- base de données et migrations ;
- authentification ;
- RBAC ;
- API ;
- modèles métier ;
- validations ;
- notifications ;
- stockage documentaire ;
- paiements ;
- facturation ;
- tracking ;
- dispatch ;
- contrats ;
- messagerie ;
- douane ;
- tests ;
- documentation ;
- configuration des environnements ;
- procédures de déploiement.

Les intégrations externes doivent être placées derrière des adaptateurs pour pouvoir être remplacées.

---

# ANNEXE A — RÉFÉRENCES VISUELLES

Références à utiliser dans le projet :
- `design/launch/JTransport_UX_Storyboard_Complet.png`
- `design/launch/JTransport_Splash_Loading.png`
- `design/reference-images/JTransport_Menu_Principal_Reference.jpeg`
- images complémentaires présentes dans `design/reference-images/additional/`

Identité : bleu et blanc, premium, moderne, lisible, transport/logistique. Les couleurs d'accent restent secondaires.

---

# ANNEXE B — RÈGLES DE DÉVELOPPEMENT

- Ne pas livrer seulement une maquette.
- Ne pas créer de boutons sans comportement.
- Ne pas simuler durablement des données qui doivent venir du backend.
- Ne pas exposer publiquement des coordonnées personnelles sans consentement.
- Ne pas stocker les secrets dans le frontend.
- Ne pas inventer des positions de tracking, ETA, montants douaniers ou statuts.
- Ne pas présenter une qualification comme un produit librement louable.
- Ne pas dépendre d'un seul prestataire externe quand un adaptateur est possible.
- Tester les parcours critiques de bout en bout.
- Prévoir logs, erreurs, reprise et idempotence.

---

# ANNEXE C — SPÉCIFICATIONS TECHNIQUES CONSOLIDÉES

Le dossier `specs/` contient les schémas JSON techniques qui complètent ce cahier :
- `CLAUDE_IMPLEMENTATION_INDEX.md` ;
- `menu-contact-api.json` ;
- `expedition-container-douane-paiement.json` ;
- `FACTURATION_DEVIS_CONFIG.json`.

Ils doivent être utilisés comme contrats techniques complémentaires lors de l'implémentation.

---

# ANNEXE D — INSTRUCTION FINALE À CLAUDE

**Tu dois traiter ce document comme la spécification fonctionnelle master de JTransport.**

Commence par analyser l'architecture existante du projet, puis implémente les modules dans un ordre cohérent avec leurs dépendances. Toute fonctionnalité doit avoir son modèle de données, son API, ses validations, ses permissions, son interface, ses états métier et ses tests lorsque cela s'applique.

L'objectif final n'est pas de montrer une application qui « ressemble » à JTransport, mais de construire une application JTransport réellement utilisable sur mobile et ordinateur, avec un parcours complet de transport, marketplace, capacité, entreprise, expédition internationale, conteneur, douane, documents, paiement, tracking, dispatcher, livraison et facturation.

---

# ANNEXE E — DOCUMENTS ANTÉRIEURS CONSOLIDÉS

Les documents suivants ont été fusionnés dans ce cahier unique :
- VISION_GLOBALE_JTRANSPORT.md
- SCOPE_PRODUIT.md
- MODULE_CAPACITE_PROFESSIONNELLE.md
- MODULE_CAPACITE_ET_MARKETPLACE_TRANSPORT_COMPLETE.md
- MODULE_DISPATCHER_CENTRALE_LIVRAISON.md
- MODULE_EXPEDITION_CONTAINER_DOUANE_PAIEMENT_TRACKING.md
- MODULE_MENU_PRINCIPAL_CONTACTS.md
- PROCESSUS_GLOBAL_EXPEDITION.md
- INTEGRATIONS_FACTURATION_DEVIS.md
- ARCHITECTURE_IMPLEMENTATION.md
- PLATEFORME_WEB_DESKTOP_RESPONSIVE.md
- PROMPT_CLAUDE.md
- README.md

Les versions les plus récentes ont été privilégiées lors de la consolidation.
