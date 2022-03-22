/*
  Warnings:

  - You are about to drop the column `car_park_type` on the `Carpark` table. All the data in the column will be lost.
  - Added the required column `night_parking` to the `Carpark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Carpark" DROP COLUMN "car_park_type",
ADD COLUMN     "night_parking" BOOLEAN NOT NULL;
