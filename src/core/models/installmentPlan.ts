import { model, Schema } from "mongoose";
import { InstallmentPlanInterface } from "../interfaces/installment";
import { InstallmentStatus } from "../enum/appEnum";


const installmentPlanSchema = new Schema<InstallmentPlanInterface>({
    purchaseId: { type: Schema.Types.ObjectId, ref: "Purchase", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    totalAmount: { type: Number, required: true },
    numberOfMonths: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    remainingBalance: { type: Number, required: true },
    status: { type: String, enum: Object.values(InstallmentStatus),default: InstallmentStatus.PENDING },
}, { timestamps: true });

export const InstallmentPlan = model<InstallmentPlanInterface>("InstallmentPlan", installmentPlanSchema);
