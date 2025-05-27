-- CreateTable
CREATE TABLE "car_positions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "carId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "car_positions_uuid_key" ON "car_positions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "car_positions_carId_key" ON "car_positions"("carId");

-- AddForeignKey
ALTER TABLE "car_positions" ADD CONSTRAINT "car_positions_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
