import mongoose, { Document, Schema } from 'mongoose';
import { Status } from '../enum/appEnum';

export interface IRefund extends Document {
    paymentId: mongoose.Types.ObjectId;
    customerName: string;
    amount: number;
    paystackReference: string;
    status: Status;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}