# JTRANSPORT — INSTRUCTIONS DE DÉMARRAGE POUR CLAUDE

Ce package est la version allégée destinée à l'import dans Claude lorsque la limite de taille d'un fichier ZIP est de 30 Mo.

## SOURCE DE VÉRITÉ
Lire en premier : `CAHIER_DES_CHARGES_JTRANSPORT_UNIQUE.md` et les documents maître présents à la racine.

## RÈGLE
Ne pas traiter ce projet comme une simple maquette. Implémenter les fonctionnalités réellement : frontend Web/Desktop + Mobile, backend, base de données, authentification, rôles/permissions, API, paiements, facturation, documents, contrats, messagerie, tracking, douane, conteneurs, dispatch, notifications, tests et gestion des erreurs.

## RÉFÉRENCES VISUELLES
Les images dans `app/design/reference-images/approved-current/` et `app/design/launch/` sont les références approuvées JTransport. Elles servent à reproduire l'UX/UI et les parcours, pas à ajouter des produits hors transport.

## PÉRIMÈTRE
JTransport uniquement : transport, logistique, colis/palettes/conteneurs, routier, maritime, aérien, ferroviaire, multimodal, véhicules, voyageurs, import/export, douane/dédouanement, marketplace de missions et prestataires, dispatch/centrale, capacité professionnelle, devis/factures, contrats, paiement, suivi et livraison.

## PARCOURS INTERNATIONAL
Client → création colis → collecte/dépôt → scan → groupage → conteneur → chargement → départ → suivi → arrivée → dossier douane → documents → frais à payer → paiement dans l'application → dédouanement → livraison finale → preuve de livraison.

## LIMITE DE TAILLE
Les anciennes archives ZIP ne sont volontairement PAS incluses dans ce package afin de ne pas dépasser 30 Mo. Elles contenaient des copies et des archives imbriquées. Le code courant et les spécifications utiles ont été conservés ici.

Commencer par auditer le code présent, puis implémenter progressivement les modules du cahier maître. Ne pas supprimer une fonctionnalité déjà présente sans raison.
