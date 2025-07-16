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
const formattedDate = new Date().toLocaleString();


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

export const verifyPayment = async (reference) => {
    try {
        const payment = await Payment.findOne({reference: reference}); 

        if (!payment) {
            throw new CustomError(
                "Payment not found",
                ErrorCode.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        };

        const purchase = await Purchase.findById(payment.purchase);
        if (!purchase) {
            throw new CustomError(
                "Purchase not found for this payment",
                ErrorCode.NOT_FOUND,
                HttpStatus.NOT_FOUND
            );
        }
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
                    user
                }
            };

           
        } else if (data?.status && data.data?.status !== "success") {
            booking.status = "failed";

            const { reference } = booking
            const supportEmail = "hubspotnigeria@gmail.com"


            const failedeHtml = bookingFailure(
                firstName,
                reference,
                supportEmail
            );

            const failureMailOptions = {
                email: user.email,
                subject: "booking Failed",
                html: failedeHtml,
            };

            await sendMail(failureMailOptions);
            await booking.save();

            res.status(200).json({
                message: "booking failed",
                // error: error.message
            });
        };

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error verifying booking by hour",
            error: error.message,
        })
    };
};