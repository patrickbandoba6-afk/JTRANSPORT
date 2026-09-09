/*
  Warnings:

  - Added the required column `code` to the `Parcel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ParcelEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parcelId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actorId" TEXT,
    "actorLabel" TEXT,
    "location" TEXT,
    "proof" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ParcelEvent_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parcelId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SIGNALE',
    "reason" TEXT NOT NULL,
    "openedById" TEXT,
    "resolution" TEXT,
    "resolvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Incident_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Incident_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeliveryRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "organizationId" TEXT,
    "dispatcherId" TEXT NOT NULL,
    "carrierOrgId" TEXT,
    "driverId" TEXT,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeliveryRound_dispatcherId_fkey" FOREIGN KEY ("dispatcherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DeliveryRound_carrierOrgId_fkey" FOREIGN KEY ("carrierOrgId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DeliveryRound_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_DeliveryRound" ("createdAt", "date", "dispatcherId", "driverId", "id", "reference", "status", "updatedAt") SELECT "createdAt", "date", "dispatcherId", "driverId", "id", "reference", "status", "updatedAt" FROM "DeliveryRound";
DROP TABLE "DeliveryRound";
ALTER TABLE "new_DeliveryRound" RENAME TO "DeliveryRound";
CREATE UNIQUE INDEX "DeliveryRound_reference_key" ON "DeliveryRound"("reference");
CREATE INDEX "DeliveryRound_dispatcherId_idx" ON "DeliveryRound"("dispatcherId");
CREATE INDEX "DeliveryRound_driverId_idx" ON "DeliveryRound"("driverId");
CREATE INDEX "DeliveryRound_status_idx" ON "DeliveryRound"("status");
CREATE TABLE "new_Parcel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "shipmentId" TEXT,
    "organizationId" TEXT,
    "description" TEXT NOT NULL,
    "weightKg" REAL NOT NULL,
    "lengthCm" REAL,
    "widthCm" REAL,
    "heightCm" REAL,
    "declaredValue" REAL,
    "recipientName" TEXT,
    "recipientAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "custodianType" TEXT NOT NULL DEFAULT 'ORGANIZATION',
    "custodianOrgId" TEXT,
    "custodianUserId" TEXT,
    "roundId" TEXT,
    CONSTRAINT "Parcel_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Parcel_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Parcel_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "DeliveryRound" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Parcel" ("declaredValue", "description", "heightCm", "id", "lengthCm", "shipmentId", "weightKg", "widthCm") SELECT "declaredValue", "description", "heightCm", "id", "lengthCm", "shipmentId", "weightKg", "widthCm" FROM "Parcel";
DROP TABLE "Parcel";
ALTER TABLE "new_Parcel" RENAME TO "Parcel";
CREATE UNIQUE INDEX "Parcel_code_key" ON "Parcel"("code");
CREATE INDEX "Parcel_shipmentId_idx" ON "Parcel"("shipmentId");
CREATE INDEX "Parcel_organizationId_idx" ON "Parcel"("organizationId");
CREATE INDEX "Parcel_roundId_idx" ON "Parcel"("roundId");
CREATE INDEX "Parcel_status_idx" ON "Parcel"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ParcelEvent_parcelId_idx" ON "ParcelEvent"("parcelId");

-- CreateIndex
CREATE INDEX "Incident_parcelId_idx" ON "Incident"("parcelId");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");
