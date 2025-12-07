/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "paymentStatus";

-- CreateTable
CREATE TABLE "booking_payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundAmount" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_payments_bookingId_key" ON "booking_payments"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_payments_razorpayOrderId_key" ON "booking_payments"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_payments_razorpayPaymentId_key" ON "booking_payments"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "booking_payments_bookingId_idx" ON "booking_payments"("bookingId");

-- CreateIndex
CREATE INDEX "booking_payments_razorpayOrderId_idx" ON "booking_payments"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "booking_payments_razorpayPaymentId_idx" ON "booking_payments"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "booking_payments_status_idx" ON "booking_payments"("status");

-- CreateIndex
CREATE INDEX "booking_payments_paidAt_idx" ON "booking_payments"("paidAt");

-- AddForeignKey
ALTER TABLE "booking_payments" ADD CONSTRAINT "booking_payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
