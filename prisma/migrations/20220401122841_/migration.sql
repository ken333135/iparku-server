/*
  Warnings:

  - Added the required column `sat_rate` to the `Rate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sun_rate` to the `Rate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekday_rate` to the `Rate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rate" ADD COLUMN     "sat_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sun_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weekday_rate" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "CarparkPrivate" (
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "weekday_before_5" TEXT NOT NULL,
    "weekday_after_5" TEXT NOT NULL,
    "sat" TEXT NOT NULL,
    "sun" TEXT NOT NULL,
    "postal" TEXT NOT NULL,
    "x_coord" DOUBLE PRECISION NOT NULL,
    "y_coord" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CarparkPrivate_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarparkPrivate_name_key" ON "CarparkPrivate"("name");
