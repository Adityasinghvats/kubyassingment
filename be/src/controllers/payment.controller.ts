import Razorpay from "razorpay";
import { configDotenv } from "dotenv";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { prisma } from "../utils/db";
import crypto from 'crypto';
configDotenv();

const rzp = new Razorpay({
    key_id: process.env.RZP_KEY_ID!,
    key_secret: process.env.RZP_KEY_SECRET!
})

const createOrder = asyncHandler(async (req, res) => {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
        throw new ApiError(400, "Amount and booking ID are required");
    }

    // Verify booking exists and belongs to user or is for user
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { id: true, clientId: true, providerId: true }
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.clientId !== req.user.id) {
        throw new ApiError(403, "You can only pay for your own bookings");
    }

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `booking_rcptid_${Math.random().toString(36).substring(2, 9)}`,
        notes: {
            userId: req.user.id,
            bookingId: bookingId
        }
    };

    const order = await rzp.orders.create(options);

    if (!order) {
        throw new ApiError(500, "Unable to create order");
    }

    // Create or update BookingPayment record
    await prisma.bookingPayment.upsert({
        where: { bookingId },
        update: {
            razorpayOrderId: order.id,
            amount: parseFloat(amount),
            status: "PENDING"
        },
        create: {
            bookingId,
            razorpayOrderId: order.id,
            amount: parseFloat(amount),
            currency: "INR",
            status: "PENDING"
        }
    });

    res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

const validatePayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError(400, "Please provide valid payment data");
    }

    // Verify signature
    const sha = crypto.createHmac("sha256", process.env.RZP_KEY_SECRET!);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
        throw new ApiError(400, "Invalid signature sent!");
    }

    // Update BookingPayment with payment details
    const bookingPayment = await prisma.bookingPayment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: "COMPLETED",
            paidAt: new Date()
        },
        include: { booking: true }
    });

    // Update Booking status to COMPLETED
    await prisma.booking.update({
        where: { id: bookingPayment.bookingId },
        data: { status: "COMPLETED" }
    });

    res.status(200).json(new ApiResponse(200, { orderId: razorpay_order_id, paymentId: razorpay_payment_id }, "Payment verified successfully"));
});

export { createOrder, validatePayment };