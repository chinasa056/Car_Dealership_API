import { Types, Document } from "mongoose";
import { InstallmentStatus } from "../enum/appEnum";

export interface InstallmentPlanInterface extends Document {
    purchaseId: Types.ObjectId;
    userId: Types.ObjectId;
    totalAmount: number;
    numberOfMonths: number;
    monthlyAmount: number;
    startDate: Date;
    endDate: Date;
    remainingBalance: number;
    status: InstallmentStatus;
}

export interface InstallmentPaymentInterface extends Document {
    installmentPlanId: Types.ObjectId;
    nextDueDate: Date; 
    amount: number;
    isPaid: boolean;
    paymentDate?: Date;
    penaltyApplied?: boolean;
    penaltyAmount?: number;
}

export interface CreatePlanResponse {
    message: string;
    data: {
        installmentPlanId: string,
        totalAmountToPay: number,
        numberOfMonthsToPay: number,
        monthlyAmount: number,
        paymentStartsFrom: Date,
        endsOn: Date
    };
}

