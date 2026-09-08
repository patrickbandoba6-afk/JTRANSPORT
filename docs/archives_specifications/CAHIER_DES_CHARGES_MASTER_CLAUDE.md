# JTRANSPORT — CAHIER DES CHARGES MASTER POUR CLAUDE

## 1. Vision

Construire JTransport comme un **guichet unique numérique du transport et de la logistique**, accessible sur mobile et ordinateur.

La plateforme doit réunir : clients particuliers, entreprises, donneurs d'ordre, transporteurs, prestataires, gestionnaires de transport, dispatchers, livreurs, commissionnaires, transitaires, opérateurs logistiques et partenaires.

## 2. Tout le transport dans une seule plateforme

Modes : routier, voyageurs, maritime, aérien, ferroviaire, multimodal.

Services : colis, palettes, marchandises, véhicules, fret, express, groupage, stockage, manutention, assurance, livraison, import, export, douane, dédouanement, contrats, documents, paiement, tracking.

## 3. Marketplace

Deux directions doivent fonctionner ensemble :

### Besoin de transport
Un client publie une mission et cherche un prestataire.

### Offre de capacité
Un transporteur/professionnel publie sa capacité disponible et cherche des missions.

Le moteur de matching rapproche automatiquement les deux selon route, date, mode, véhicule, poids, volume, disponibilité, prix, vérification, assurance, qualification et réputation.

## 4. Capacités professionnelles et qualifications

Le système permet à un professionnel de proposer ses capacités ou ses services dans tous les domaines pris en charge.

Pour les activités réglementées :
- vérifier identité ;
- vérifier documents ;
- enregistrer qualification/licence/certificat/agrément ;
- vérifier dates et expiration ;
- appliquer les limites réglementaires ;
- bloquer une offre si la conformité n'est pas suffisante.

Le module de gestionnaire de transport doit aider une personne qui souhaite créer une entreprise et qui n'a pas la qualification requise à trouver un professionnel compétent lorsque la réglementation permet ce recours.

**Interdit :** présenter une qualification ou un diplôme comme une marchandise à louer/vendre.

## 5. Contrats

JTransport doit générer et gérer les contrats :
- transport ;
- sous-traitance ;
- prestation logistique ;
- capacité ;
- gestionnaire de transport ;
- mission ;
- contrat cadre ;
- ordre de transport ;
- multimodal.

Parcours : modèle → préremplissage → conditions → devis → acceptation → signature électronique → horodatage/audit → archivage → renouvellement/résiliation.

## 6. Devis et factures

Parcours complet :
**Demande → devis → contre-offre → acceptation → commande/missions → prestation → facture → paiement → reversement.**

Fonctions : devis, factures, avoirs, acomptes, relances, factures prestataires, commissions, remboursements, statuts et archivage.

Facturation électronique : prévoir Factur-X, UBL, CII, XML, annuaire, e-invoicing, e-reporting, Chorus Pro et Peppol lorsque supporté.

Pour la France, la **DGFiP est la source de vérité** pour le statut des plateformes agréées. Le système doit consulter/synchroniser la liste officielle, conserver la date de vérification et ne jamais afficher un statut « agréé » à partir d'une source commerciale seule.

## 7. Dispatcher / centrale

Une entreprise ou un opérateur Dispatcher peut recevoir des lots de colis d'un donneur d'ordre ou d'une entreprise de transport.

Il possède une centrale :
- réception ;
- scan ;
- import API/CSV/Excel ;
- préparation ;
- tri ;
- tournées ;
- affectation livreurs ;
- affectation véhicules ;
- carte ;
- suivi ;
- incidents ;
- retours ;
- POD ;
- rapports ;
- facturation.

## 8. Livreur

Chaque livreur possède un compte individuel et une application/espace JTransport Driver.

Fonctions : connexion, disponibilité, tournée, navigation, scan QR/code-barres, prise en charge, chargement, départ, arrivée, livraison, signature, photo, échec, incident, retour et historique.

Le Dispatcher invite/crée le compte mais ne connaît jamais le mot de passe du livreur.

## 9. Suivi colis

Chaque scan est enregistré comme événement auditable : colis, type, utilisateur, organisation, date/heure, tournée et localisation si autorisée.

La timeline doit permettre aux acteurs autorisés de suivre un colis de la réception à la livraison.

## 10. Desktop

La plateforme doit être pleinement utilisable sur ordinateur :
- dashboards ;
- tableaux ;
- filtres ;
- cartes ;
- statistiques ;
- détails ;
- gestion des équipes ;
- documents ;
- facturation ;
- dispatch.

Le web desktop n'est pas une simple version agrandie du mobile.

## 11. Mobile

Prévoir :
- application client ;
- application prestataire/transporteur ;
- JTransport Driver ;
- parcours Dispatcher mobile lorsque nécessaire.

## 12. Lancement de l'application

Au démarrage :
1. écran splash JTransport avec logo ;
2. barre « Chargement de votre expérience… » animée ;
3. initialisation réelle des services ;
4. onboarding si premier lancement ;
5. connexion/inscription ;
6. choix du rôle ;
7. vérification e-mail/téléphone ;
8. création/configuration du compte ;
9. arrivée sur l'accueil adapté au rôle.

Si une session valide existe, après le splash l'utilisateur est dirigé directement vers son accueil.

## 13. Design

Identité principale : **bleu + blanc**, avec rouge en couleur d'accent de la marque JTransport lorsque nécessaire.

Référence principale : `design/launch/JTransport_UX_Storyboard_Complet.png`.

Splash : `design/launch/JTransport_Splash_Loading.png`.

Le design doit rester premium, lisible, professionnel, transport/logistique, avec cartes, icônes, recherche, dashboards et navigation claire.

## 14. Architecture

Multi-tenant + RBAC + API + base de données + audit.

Entités principales : Organization, User, Role, Driver, DispatcherCenter, Vehicle, CapacityProvider, TransportCapacity, Qualification, License, Certificate, VerificationCase, Mission, Shipment, Parcel, ParcelScanEvent, Route, RouteStop, Assignment, DeliveryAttempt, ProofOfDelivery, Quote, Contract, Invoice, Payment, Notification, Incident, AuditLog.

Adaptateurs :
- RoutingProviderAdapter
- TrackingProviderAdapter
- NotificationProviderAdapter
- BillingProviderAdapter
- EInvoicingProviderAdapter
- CapacityVerificationAdapter
- EContractProviderAdapter

## 15. Règle absolue de développement

Ne pas livrer seulement des maquettes statiques. Construire les modèles de données, API, validations, états, permissions, persistance, erreurs, logs, tests et intégrations.

Le code doit être prêt à évoluer vers la production sans enfermer JTransport dans un seul prestataire externe.

## 17. MENU PRINCIPAL — RÉFÉRENCE VISUELLE ET FONCTIONS RÉELLES

Le menu principal doit reprendre la structure de l'image fournie par le client, stockée dans `design/reference-images/JTransport_Menu_Principal_Reference.jpeg`.

L'écran d'accueil doit présenter : logo JTransport, notifications, compte, recherche globale, raccourcis « Publier une mission », « Trouver un prestataire », « Créer mon entreprise de transport », « Mes capacités & offres », bandeau transport international, catégories transport/logistique, services, espace entreprises et navigation mobile.

Chaque bouton doit être fonctionnel et relié à une route/API. Aucun bouton important ne doit être une simple maquette.

Catégories minimales : transport marchandises, transport voyageurs, fret maritime, fret aérien, fret ferroviaire, transport de véhicules, colis & palettes, douane & dédouanement, import/export, logistique & entreposage, mise à disposition/location de capacité de transport, toutes les catégories.

## 18. CONTACT DIRECT PARTICULIER ↔ ENTREPRISE / PROFESSIONNEL

JTransport doit permettre une mise en relation simple entre particuliers, entreprises et professionnels.

Pour une entreprise/professionnel qui autorise le partage de ses coordonnées, sa fiche peut afficher : nom, e-mail professionnel, téléphone professionnel, adresse professionnelle, ville/pays, horaires, services, zones desservies et statut de vérification, avec actions « Contacter », « Appeler », « E-mail », « Demander un devis » et « Envoyer une demande ».

Pour un particulier, la messagerie JTransport est disponible par défaut mais l'e-mail, le téléphone et surtout l'adresse résidentielle ne doivent pas être exposés publiquement par défaut. Le particulier choisit ce qu'il partage. Les adresses nécessaires à une mission peuvent être transmises de manière sécurisée uniquement aux acteurs autorisés.

Le contact doit pouvoir être initié depuis un profil, une mission, un devis, une commande ou un contrat. La conversation doit conserver son contexte métier et supporter messages, pièces jointes, notifications, signalement et historique.

Ajouter `ContactProfile`, `PostalAddress` et `Conversation` au modèle de données, ainsi que les endpoints de contact/messagerie décrits dans `MODULE_MENU_PRINCIPAL_CONTACTS.md`.

Les accès aux coordonnées doivent être protégés par authentification, RBAC, isolation multi-tenant, consentement/visibilité et audit. Prévoir anti-spam et limitation de fréquence.

## 19. EXPÉDITION DE BOUT EN BOUT — COLIS, CONTENEUR, TRACKING, DOUANE, PAIEMENT ET DOCUMENTS

Lire impérativement `MODULE_EXPEDITION_CONTAINER_DOUANE_PAIEMENT_TRACKING.md`.

JTransport doit permettre à un particulier ou une entreprise de gérer depuis son compte une expédition internationale complète, y compris lorsqu'un ou plusieurs colis sont regroupés dans un conteneur.

Le parcours attendu est :
**création de l'expédition → collecte/dépôt → scans → groupage → affectation au conteneur → chargement/scellage → départ → transit → arrivée → dossier douanier → documents → frais → paiement dans l'application lorsque disponible → dédouanement/libération → livraison finale → preuve de livraison → clôture.**

Le compte utilisateur doit afficher toutes les expéditions, colis, conteneurs, événements de tracking, documents, formalités douanières, frais, paiements, factures, notifications, messages, incidents et preuves de livraison.

### Conteneurs

Un ou plusieurs colis peuvent être regroupés dans un `ConsolidationLot`, puis affectés à un `Container`. Le système doit gérer numéro de conteneur, type, scellé, poids, volume, taux de remplissage, ports, terminal, navire/voyage lorsque connu, ETD/ETA, transbordements et événements.

### Tracking

Le client dispose d'une timeline et d'une carte avec dernière position connue, événements, lieux, date/heure, ETA et étapes. Ne jamais inventer une position : si une intégration ne fournit pas de GPS temps réel, afficher le dernier événement/lieu connu. Utiliser `TrackingProviderAdapter` et des webhooks.

### Douane

Chaque expédition internationale peut avoir un `CustomsCase` avec marchandises, valeur, origine, destination, code HS si connu, Incoterm, documents, déclarant/transitaire, statut, références, frais et historique. Prévoir un assistant de documents manquants et des notifications.

JTransport peut afficher des estimations lorsqu'il dispose de données fiables et d'une intégration autorisée, mais ne doit jamais présenter une estimation comme un montant douanier officiel. Les règles doivent être configurables par pays et externalisées via `CustomsProviderAdapter`/`CustomsRulesAdapter`.

### Paiement

Depuis « À payer », le client doit pouvoir régler les montants effectivement facturés par JTransport ou ses partenaires lorsque le parcours contractuel et le fournisseur le permettent : transport, fret, manutention, stockage, assurance, frais de dossier, frais portuaires refacturés, dédouanement, droits/taxes lorsque le mécanisme de paiement est disponible, livraison finale et autres frais autorisés.

Les paiements doivent être confirmés côté serveur par webhook, être idempotents et gérer succès, échec, action requise, remboursement et remboursement partiel. Aucun numéro de carte ou secret bancaire ne doit être stocké dans le frontend.

### Documents

Créer un coffre documentaire privé par expédition : facture commerciale/proforma, packing list, preuve de valeur, certificat d'origine, mandat, déclaration douanière, licences/autorisation, assurance, B/L, AWB, CMR, documents ferroviaires, factures, reçus, photos et POD selon le cas.

### Critère de fonctionnement

Une fonctionnalité critique ne doit pas être une maquette. Elle doit avoir :
- modèle de données ;
- API ;
- validation ;
- RBAC/permissions ;
- persistance ;
- gestion des erreurs ;
- notifications ;
- audit ;
- tests.

Le parcours E2E de référence est documenté dans `MODULE_EXPEDITION_CONTAINER_DOUANE_PAIEMENT_TRACKING.md` et doit être implémenté et testé.
