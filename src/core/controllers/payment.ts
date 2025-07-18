const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
const transactionUrl = "https://api.paystack.co/transaction/initialize"
const verifyUrl = "https://api.paystack.co/transaction/verify"
import { Payment } from '../models/payment';
import { Purchase } from '../models/purchase';
import { CustomError } from '../error/CustomError';
import axios from "axios";
import { Customer } from '../models/customer';
import { Types } from 'mongoose';
import { ErrorCode } from '../enum/error';
import { HttpStatus } from '../enum/httpCode';

export const processPaymentInitialization = async (purchaseId: Types.ObjectId, userId: string): Promise<any> => {
    const user = await Customer.findById(userId);
    if (!user) {
        throw new CustomError(
            " Payment failed: User not found",
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
        )
    };
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
        throw new CustomError(
            "Payment failed: Purchase not found",
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
        )
    };

    const totalAmount = purchase.priceSold * purchase.quantity;

    const paymentDetails = {
        amount: totalAmount,
        email: user.email,
    };

    const response = await axios.post(transactionUrl, paymentDetails, {
        headers: { Authorization: `Bearer ${paystackSecret}` }
    });

    const { data } = response.data

    const payment = new Payment({
        purchase: purchaseId,
        email: user.email,
        customerName: user.name,
        amunt: totalAmount,
        rference: data.reference,
        status: "pending",
        provider: "Paystack",
    });

    await payment.save();

    return {
        authorization_url: data?.authorization_url,
        reference: data?.reference,
        transactionDetails: payment
    };

};

export const verifyPayment = async (reference: string) => {
    const payment = await Payment.findOne({ reference: reference });

    if (!payment) {
        throw new CustomError(
            `Payment record not found for reference ${reference}`,
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
        );
    };

    if (payment.status === "Success") {
        return {
            message: "Payment already verified and transaction completed",
            data: payment
        };
    };

    const purchase = await Purchase.findById(payment.purchase);
    if (!purchase) {
        throw new CustomError(
            "Purchase record not found for this payment",
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
        );
    };


    if (purchase.status === "Completed") {
        return {
            message: "Payment already verified and transactio completed"
        };
    };


    const user = await Customer.findById(purchase.buyer);
    if (!user) {
        throw new CustomError(
            "User not found for this purchase",
            ErrorCode.NOT_FOUND,
            HttpStatus.NOT_FOUND
        );
    };

    const response = await axios.get(`${verifyUrl}/${reference}`, {
        headers: { Authorization: `Bearer ${paystackSecret}` }
    });

    const { data } = response;
    console.log("response data: ", data);

    if (data?.status && data.data?.status === "success") {
        payment.status = "Success";
        purchase.status = "Completed";
        await payment.save();
        await purchase.save();
        return {
            message: "Payment verified successfully",
            data: {
                payment,
                purchase,
            }
        };

    } else if (data?.status && data.data?.status !== "success") {
        payment.status = "Failed";
        purchase.status = "Failed";

        await payment.save();
        await purchase.save();

        return {
            message: "Payment Failed please try again later",
            payment
        };
    };
}