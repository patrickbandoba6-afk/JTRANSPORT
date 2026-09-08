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
