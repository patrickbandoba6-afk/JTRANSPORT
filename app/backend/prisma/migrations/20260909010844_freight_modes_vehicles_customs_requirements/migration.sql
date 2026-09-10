-- CreateTable
CREATE TABLE "ShipmentVehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipmentId" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "vin" TEXT,
    "plate" TEXT,
    "condition" TEXT,
    "valueDeclared" REAL,
    CONSTRAINT "ShipmentVehicle_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomsRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mode" TEXT,
    "cargoType" TEXT,
    "countryFrom" TEXT,
    "countryTo" TEXT,
    "documentType" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomsCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DOCUMENTS_PENDING',
    "declaredValue" REAL,
    "hsCode" TEXT,
    "incoterm" TEXT,
    "estimatedFees" REAL,
    "officialFees" REAL,
    "feesStatus" TEXT NOT NULL DEFAULT 'NONE',
    "feesPaidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomsCase_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CustomsCase" ("createdAt", "declaredValue", "estimatedFees", "hsCode", "id", "incoterm", "shipmentId", "status", "updatedAt") SELECT "createdAt", "declaredValue", "estimatedFees", "hsCode", "id", "incoterm", "shipmentId", "status", "updatedAt" FROM "CustomsCase";
DROP TABLE "CustomsCase";
ALTER TABLE "new_CustomsCase" RENAME TO "CustomsCase";
CREATE UNIQUE INDEX "CustomsCase_shipmentId_key" ON "CustomsCase"("shipmentId");
CREATE INDEX "CustomsCase_shipmentId_idx" ON "CustomsCase"("shipmentId");
CREATE TABLE "new_Shipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientPhone" TEXT,
    "recipientEmail" TEXT,
    "recipientAddress" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'ROUTIER',
    "cargoType" TEXT NOT NULL DEFAULT 'COLIS',
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "containerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Shipment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Shipment_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Shipment" ("containerId", "createdAt", "destinationCity", "destinationCountry", "id", "originCity", "originCountry", "ownerId", "recipientAddress", "recipientEmail", "recipientName", "recipientPhone", "status", "updatedAt") SELECT "containerId", "createdAt", "destinationCity", "destinationCountry", "id", "originCity", "originCountry", "ownerId", "recipientAddress", "recipientEmail", "recipientName", "recipientPhone", "status", "updatedAt" FROM "Shipment";
DROP TABLE "Shipment";
ALTER TABLE "new_Shipment" RENAME TO "Shipment";
CREATE INDEX "Shipment_ownerId_idx" ON "Shipment"("ownerId");
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");
CREATE INDEX "Shipment_containerId_idx" ON "Shipment"("containerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ShipmentVehicle_shipmentId_idx" ON "ShipmentVehicle"("shipmentId");

-- CreateIndex
CREATE INDEX "CustomsRequirement_mode_cargoType_idx" ON "CustomsRequirement"("mode", "cargoType");
