/*
  Warnings:

  - You are about to drop the column `car_park_basement` on the `Carpark` table. All the data in the column will be lost.
  - You are about to drop the column `car_park_decks` on the `Carpark` table. All the data in the column will be lost.
  - You are about to drop the column `central` on the `Carpark` table. All the data in the column will be lost.
  - You are about to drop the column `free_parking` on the `Carpark` table. All the data in the column will be lost.
  - You are about to drop the column `gantry_height` on the `Carpark` table. All the data in the column will be lost.
  - You are about to drop the column `night_parking` on the `Carpark` table. All the data in the column will be lost.
  - You are about to drop the column `short_term_parking` on the `Carpark` table. All the data in the column will be lost.
  - You are about to drop the column `type_of_parking_system` on the `Carpark` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Carpark" DROP COLUMN "car_park_basement",
DROP COLUMN "car_park_decks",
DROP COLUMN "central",
DROP COLUMN "free_parking",
DROP COLUMN "gantry_height",
DROP COLUMN "night_parking",
DROP COLUMN "short_term_parking",
DROP COLUMN "type_of_parking_system";
