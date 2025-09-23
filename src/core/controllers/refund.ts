import axios from "axios";
import { ErrorCode } from "../enum/error";
import { HttpStatus } from "../enum/httpCode";
import { CustomError } from "../error/CustomError";
import { Payment } from "../models/payment";
import { Refund } from "../models/refund";
const url = "https://api.paystack.co/refund"

export const requestRefund = async (installmentPlanId: string, reason: string) => {
    // Find all successful payments 
    const payments = await Payment.find({ installmentPaymentId: installmentPlanId, status: 'Success' }).populate('purchase');
    if (payments.length === 0) {
        throw new CustomError('No payments found to refund', ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
    };

    // Get the Purchase and calculate penalty based on the purchase's total price
    const purchase: any = payments[0].purchase; 
    if (!purchase) {
        throw new CustomError('Purchase not found', ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Calculate total paid amount and the penalty
    const totalAmountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const penaltyRate = 0.05;
    const penaltyAmount = penaltyRate * purchase.totalPrice; 
    
    // Check if total paid is less than penalty
    if (totalAmountPaid < penaltyAmount) {
        throw new CustomError('Amount paid is less than the penalty amount. No refund is possible.', ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }
    
    let amountToRefund = totalAmountPaid - penaltyAmount;
    
    // Loop through each payment and process refunds
    const refunds = [];
    for (const payment of payments) {
        // Skip payments that are already refunded
        if (payment.refunded === true) {
            console.log(`Payment with reference ${payment.reference} already refunded. Skipping.`);
            continue;
        };

        let refundAmountForThisPayment;
        if (amountToRefund <= 0) {
            // If the refundable amount has been exhausted, exit the loop
            break;
        }

        // Refund the full payment amount or the remaining amount to refund
        if (amountToRefund >= payment.amount) {
            refundAmountForThisPayment = payment.amount;
        } else {
            refundAmountForThisPayment = amountToRefund;
        }

        const refundDetails = {
            transaction: payment.reference,
            amount: Math.round(refundAmountForThisPayment * 100), 
            customer_note: reason,
        };

        try {
            const response = await axios.post(url, refundDetails, {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
            });
            const { data } = response.data;

            const newRefundRecord = new Refund({
                paymentId: payment._id,
                amount: data.amount / 100, 
                paystackReference: data.reference,
                status: 'Pending',
                reason: reason,
            });

            await newRefundRecord.save();
            refunds.push(newRefundRecord);

            payment.refunded = true;
            await payment.save();
            amountToRefund -= refundAmountForThisPayment; 

        } catch (error) {
            if (typeof error === "object" && error !== null) {
                const errMsg = (error as any).response?.data || (error as any).message || error;
                console.error(`Failed to refund payment ${payment.reference}:`, errMsg);
            } else {
                console.error(`Failed to refund payment ${payment.reference}:`, error);
            }
            // willkeep the option to save a failed refund record or send a notification
        }
    }
    
    if (refunds.length === 0) {
        throw new CustomError('No new refunds were processed. Check logs for errors.', ErrorCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
        message: 'Refund process initiated successfully. Check each refund status for completion.',
        data: refunds
    };
};