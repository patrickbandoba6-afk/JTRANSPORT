-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "missionId" TEXT,
    "capacityId" TEXT,
    "organizationId" TEXT,
    "ownerId" TEXT NOT NULL,
    "counterpartyId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TRANSPORT',
    "price" REAL NOT NULL,
    "terms" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "ownerSignedAt" DATETIME,
    "counterpartySignedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contract_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contract_capacityId_fkey" FOREIGN KEY ("capacityId") REFERENCES "TransportCapacity" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Contract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contract_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Contract" ("counterpartyId", "counterpartySignedAt", "createdAt", "id", "missionId", "organizationId", "ownerId", "ownerSignedAt", "price", "status", "terms", "type", "updatedAt") SELECT "counterpartyId", "counterpartySignedAt", "createdAt", "id", "missionId", "organizationId", "ownerId", "ownerSignedAt", "price", "status", "terms", "type", "updatedAt" FROM "Contract";
DROP TABLE "Contract";
ALTER TABLE "new_Contract" RENAME TO "Contract";
CREATE INDEX "Contract_ownerId_idx" ON "Contract"("ownerId");
CREATE INDEX "Contract_counterpartyId_idx" ON "Contract"("counterpartyId");
CREATE INDEX "Contract_capacityId_idx" ON "Contract"("capacityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
