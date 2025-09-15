import { model, Schema } from "mongoose";
import { InstallmentPaymentInterface } from "../interfaces/installment";

const installmentPaymentSchema = new Schema<InstallmentPaymentInterface>({
    installmentPlanId: { type: Schema.Types.ObjectId, ref: "InstallmentPlan", required: true },
    nextDueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paymentDate: { type: Date },
    penaltyApplied: { type: Boolean, default: false },
    penaltyAmount: { type: Number, required: false }
}, { timestamps: true });

export const InstallmentPayment = model<InstallmentPaymentInterface>("InstallmentPayment", installmentPaymentSchema);