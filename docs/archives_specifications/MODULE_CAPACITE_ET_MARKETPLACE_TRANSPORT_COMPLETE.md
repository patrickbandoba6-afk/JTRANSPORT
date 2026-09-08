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
