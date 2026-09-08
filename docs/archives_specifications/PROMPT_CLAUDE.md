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
