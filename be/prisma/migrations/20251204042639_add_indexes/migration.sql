/*
  Warnings:

  - Added the required column `slotId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "slotId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "bookings_clientId_idx" ON "bookings"("clientId");

-- CreateIndex
CREATE INDEX "bookings_providerId_idx" ON "bookings"("providerId");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_startTime_idx" ON "bookings"("startTime");

-- CreateIndex
CREATE INDEX "bookings_slotId_idx" ON "bookings"("slotId");

-- CreateIndex
CREATE INDEX "bookings_clientId_status_idx" ON "bookings"("clientId", "status");

-- CreateIndex
CREATE INDEX "bookings_providerId_status_idx" ON "bookings"("providerId", "status");

-- CreateIndex
CREATE INDEX "reviews_bookingId_idx" ON "reviews"("bookingId");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE INDEX "slots_providerId_idx" ON "slots"("providerId");

-- CreateIndex
CREATE INDEX "slots_status_idx" ON "slots"("status");

-- CreateIndex
CREATE INDEX "slots_startTime_idx" ON "slots"("startTime");

-- CreateIndex
CREATE INDEX "slots_endTime_idx" ON "slots"("endTime");

-- CreateIndex
CREATE INDEX "slots_providerId_status_idx" ON "slots"("providerId", "status");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_category_idx" ON "users"("category");

-- CreateIndex
CREATE INDEX "users_rating_idx" ON "users"("rating");
