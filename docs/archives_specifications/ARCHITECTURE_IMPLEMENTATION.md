
## Dispatcher / dernier kilomètre

Ajouter un domaine métier dédié :
- Organizations / tenants
- DispatcherCenter
- Drivers
- Vehicles
- Parcels
- ParcelScanEvents
- Routes / Stops
- Assignments
- DeliveryAttempts
- ProofOfDelivery
- Incidents
- Notifications
- AuditLogs

Le tracking doit être piloté par des événements métier et non par de simples changements d'interface. Les scans et POD doivent être persistés côté serveur. Les données de position doivent respecter le consentement et les règles applicables.

Le web doit servir les opérations desktop (centrale, tableaux, carte, statistiques) et le mobile doit servir les opérations terrain (scan, navigation, POD).
