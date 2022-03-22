-- CreateTable
CREATE TABLE "Carpark" (
    "car_park_no" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "x_coord" DOUBLE PRECISION NOT NULL,
    "y_coord" DOUBLE PRECISION NOT NULL,
    "car_park_type" TEXT NOT NULL,
    "type_of_parking_system" TEXT NOT NULL,
    "short_term_parking" TEXT NOT NULL,
    "free_parking" BOOLEAN NOT NULL,
    "night_parking" BOOLEAN NOT NULL,
    "car_park_decks" INTEGER NOT NULL,
    "gantry_height" DOUBLE PRECISION NOT NULL,
    "car_park_basement" BOOLEAN NOT NULL,
    "central" BOOLEAN NOT NULL,

    CONSTRAINT "Carpark_pkey" PRIMARY KEY ("car_park_no")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" SERIAL NOT NULL,
    "car_park_no" TEXT NOT NULL,
    "pricing" DOUBLE PRECISION NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lots" (
    "car_park_no" TEXT NOT NULL,
    "total_lots" INTEGER NOT NULL,
    "lots_available" INTEGER NOT NULL,
    "lot_type" TEXT NOT NULL,
    "update_datetime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lots_pkey" PRIMARY KEY ("car_park_no")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carpark_car_park_no_key" ON "Carpark"("car_park_no");

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_car_park_no_fkey" FOREIGN KEY ("car_park_no") REFERENCES "Carpark"("car_park_no") ON DELETE RESTRICT ON UPDATE CASCADE;
