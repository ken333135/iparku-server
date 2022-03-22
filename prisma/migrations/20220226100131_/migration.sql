/*
  Warnings:

  - You are about to drop the `Zipcodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Zipcodes";

-- CreateTable
CREATE TABLE "Zipcode" (
    "id" SERIAL NOT NULL,
    "postal" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longtitude" TEXT NOT NULL,
    "searchval" TEXT NOT NULL,
    "blk_no" TEXT NOT NULL,
    "road_name" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Zipcode_pkey" PRIMARY KEY ("id")
);
