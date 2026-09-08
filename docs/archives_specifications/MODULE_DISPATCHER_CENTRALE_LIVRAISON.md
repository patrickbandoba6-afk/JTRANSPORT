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
