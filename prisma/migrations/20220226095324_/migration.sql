/*
  Warnings:

  - The primary key for the `Zipcodes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Zipcodes" DROP CONSTRAINT "Zipcodes_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Zipcodes_pkey" PRIMARY KEY ("id");
