/*
  Warnings:

  - You are about to drop the column `carName` on the `ProductionLine` table. All the data in the column will be lost.
  - Added the required column `name` to the `ProductionLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setupCost` to the `ProductionLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ProductionLine` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PendingProductionLine" (
    "ownerId" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageFileId" TEXT NOT NULL,
    "dailyLimit" INTEGER NOT NULL,
    "setupCost" BIGINT NOT NULL,
    "country" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductionLine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" BIGINT NOT NULL,
    "country" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "dailyLimit" INTEGER NOT NULL,
    "setupCost" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ProductionLine" ("country", "createdAt", "dailyLimit", "id", "imageUrl", "ownerId") SELECT "country", "createdAt", "dailyLimit", "id", "imageUrl", "ownerId" FROM "ProductionLine";
DROP TABLE "ProductionLine";
ALTER TABLE "new_ProductionLine" RENAME TO "ProductionLine";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
