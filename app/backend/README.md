# Backend à brancher

Le frontend est volontairement indépendant du backend pour permettre à Claude de choisir l'infrastructure finale.

## Entités principales
User, Company, ProviderProfile, Driver, Vehicle, Mission, MissionOffer, Order, Shipment, TrackingEvent, Conversation, Message, Document, Payment, Commission, Payout, Review, Dispute, Notification, Availability, Favorite.

## Règles
- Une mission publiée peut recevoir plusieurs offres.
- Une seule offre peut être sélectionnée comme offre gagnante.
- Une mission confirmée n'est plus disponible pour les autres prestataires.
- Les statuts doivent être historisés.
- Les paiements et commissions doivent être traçables.
- Les documents sensibles doivent être privés.
- Les permissions dépendent du rôle.
