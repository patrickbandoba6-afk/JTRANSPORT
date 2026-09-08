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
