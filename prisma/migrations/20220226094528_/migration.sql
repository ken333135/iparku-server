-- CreateTable
CREATE TABLE "Zipcodes" (
    "postal" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longtitude" TEXT NOT NULL,
    "searchval" TEXT NOT NULL,
    "blk_no" TEXT NOT NULL,
    "road_name" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Zipcodes_pkey" PRIMARY KEY ("postal")
);
