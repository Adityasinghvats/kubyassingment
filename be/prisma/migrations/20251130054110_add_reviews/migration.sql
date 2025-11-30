-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CATEGORY" ADD VALUE 'AIRCONDITIONING';
ALTER TYPE "CATEGORY" ADD VALUE 'BEAUTY';
ALTER TYPE "CATEGORY" ADD VALUE 'HOMEIMPROVEMENT';
ALTER TYPE "CATEGORY" ADD VALUE 'PESTCONTROL';
ALTER TYPE "CATEGORY" ADD VALUE 'FITNESS';
ALTER TYPE "CATEGORY" ADD VALUE 'HOMEAPPLIANCEREPAIR';
ALTER TYPE "CATEGORY" ADD VALUE 'EVENTPLANNING';

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "paymentStatus" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
