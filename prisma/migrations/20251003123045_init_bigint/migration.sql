/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `userid` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "userid" BIGINT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "government" TEXT NOT NULL,
    "religion" TEXT NOT NULL DEFAULT 'islam',
    "crowd" BIGINT NOT NULL DEFAULT 15000000,
    "capital" BIGINT NOT NULL DEFAULT 150000000,
    "dailyProfit" BIGINT NOT NULL DEFAULT 1000000000,
    "satisfaction" INTEGER NOT NULL DEFAULT 80,
    "security" INTEGER NOT NULL DEFAULT 80,
    "lottery" INTEGER NOT NULL DEFAULT 0,
    "oil" INTEGER NOT NULL DEFAULT 0,
    "iron" INTEGER NOT NULL DEFAULT 0,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "uranium" INTEGER NOT NULL DEFAULT 0,
    "goldMine" INTEGER NOT NULL DEFAULT 0,
    "uraniumMine" INTEGER NOT NULL DEFAULT 0,
    "ironMine" INTEGER NOT NULL DEFAULT 0,
    "refinery" INTEGER NOT NULL DEFAULT 0,
    "soldier" INTEGER NOT NULL DEFAULT 0,
    "tank" INTEGER NOT NULL DEFAULT 0,
    "heavyTank" INTEGER NOT NULL DEFAULT 0,
    "su57" INTEGER NOT NULL DEFAULT 0,
    "f47" INTEGER NOT NULL DEFAULT 0,
    "f35" INTEGER NOT NULL DEFAULT 0,
    "j20" INTEGER NOT NULL DEFAULT 0,
    "f16" INTEGER NOT NULL DEFAULT 0,
    "f22" INTEGER NOT NULL DEFAULT 0,
    "am50" INTEGER NOT NULL DEFAULT 0,
    "b2" INTEGER NOT NULL DEFAULT 0,
    "tu16" INTEGER NOT NULL DEFAULT 0,
    "espionageDrone" INTEGER NOT NULL DEFAULT 0,
    "suicideDrone" INTEGER NOT NULL DEFAULT 0,
    "crossDrone" INTEGER NOT NULL DEFAULT 0,
    "witnessDrone" INTEGER NOT NULL DEFAULT 0,
    "simpleRocket" INTEGER NOT NULL DEFAULT 0,
    "crossRocket" INTEGER NOT NULL DEFAULT 0,
    "dotTargetRocket" INTEGER NOT NULL DEFAULT 0,
    "continentalRocket" INTEGER NOT NULL DEFAULT 0,
    "ballisticRocket" INTEGER NOT NULL DEFAULT 0,
    "chemicalRocket" INTEGER NOT NULL DEFAULT 0,
    "hyperSonicRocket" INTEGER NOT NULL DEFAULT 0,
    "clusterRocket" INTEGER NOT NULL DEFAULT 0,
    "battleship" INTEGER NOT NULL DEFAULT 0,
    "marineShip" INTEGER NOT NULL DEFAULT 0,
    "breakerShip" INTEGER NOT NULL DEFAULT 0,
    "nuclearSubmarine" INTEGER NOT NULL DEFAULT 0,
    "antiRocket" INTEGER NOT NULL DEFAULT 0,
    "ironDome" INTEGER NOT NULL DEFAULT 0,
    "s400" INTEGER NOT NULL DEFAULT 0,
    "taad" INTEGER NOT NULL DEFAULT 0,
    "hq9" INTEGER NOT NULL DEFAULT 0,
    "acash" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_users" ("acash", "am50", "antiRocket", "b2", "ballisticRocket", "battleship", "breakerShip", "capital", "chemicalRocket", "clusterRocket", "continentalRocket", "country", "countryName", "crossDrone", "crossRocket", "crowd", "dailyProfit", "dotTargetRocket", "espionageDrone", "f16", "f22", "f35", "f47", "gold", "goldMine", "government", "heavyTank", "hq9", "hyperSonicRocket", "iron", "ironDome", "ironMine", "j20", "level", "lottery", "marineShip", "nuclearSubmarine", "oil", "rank", "refinery", "religion", "s400", "satisfaction", "security", "simpleRocket", "soldier", "su57", "suicideDrone", "taad", "tank", "tu16", "uranium", "uraniumMine", "userid", "witnessDrone") SELECT "acash", "am50", "antiRocket", "b2", "ballisticRocket", "battleship", "breakerShip", "capital", "chemicalRocket", "clusterRocket", "continentalRocket", "country", "countryName", "crossDrone", "crossRocket", "crowd", "dailyProfit", "dotTargetRocket", "espionageDrone", "f16", "f22", "f35", "f47", "gold", "goldMine", "government", "heavyTank", "hq9", "hyperSonicRocket", "iron", "ironDome", "ironMine", "j20", "level", "lottery", "marineShip", "nuclearSubmarine", "oil", "rank", "refinery", "religion", "s400", "satisfaction", "security", "simpleRocket", "soldier", "su57", "suicideDrone", "taad", "tank", "tu16", "uranium", "uraniumMine", "userid", "witnessDrone" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
