-- AlterTable
ALTER TABLE "Contract" ADD COLUMN "counterpartySignaturePath" TEXT;
ALTER TABLE "Contract" ADD COLUMN "ownerSignaturePath" TEXT;

-- CreateTable
CREATE TABLE "DeliveryRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "dispatcherId" TEXT NOT NULL,
    "driverId" TEXT,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeliveryRound_dispatcherId_fkey" FOREIGN KEY ("dispatcherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DeliveryRound_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoundStop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "parcelCode" TEXT,
    "recipient" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "podSignature" TEXT,
    "podNote" TEXT,
    "failureReason" TEXT,
    "completedAt" DATETIME,
    CONSTRAINT "RoundStop_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "DeliveryRound" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoundStopEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stopId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoundStopEvent_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "RoundStop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryRound_reference_key" ON "DeliveryRound"("reference");

-- CreateIndex
CREATE INDEX "DeliveryRound_dispatcherId_idx" ON "DeliveryRound"("dispatcherId");

-- CreateIndex
CREATE INDEX "DeliveryRound_driverId_idx" ON "DeliveryRound"("driverId");

-- CreateIndex
CREATE INDEX "DeliveryRound_status_idx" ON "DeliveryRound"("status");

-- CreateIndex
CREATE INDEX "RoundStop_roundId_idx" ON "RoundStop"("roundId");

-- CreateIndex
CREATE INDEX "RoundStopEvent_stopId_idx" ON "RoundStopEvent"("stopId");
