/*
  Warnings:

  - Added the required column `car_park_no` to the `CarparkPrivate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarparkPrivate" ADD COLUMN     "car_park_no" TEXT NOT NULL;
