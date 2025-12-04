/*
  Warnings:

  - You are about to drop the column `slotId` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `duration` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_slotId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "slotId",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
