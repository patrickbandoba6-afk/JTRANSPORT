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
