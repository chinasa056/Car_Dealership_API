import mongoose, { Schema } from 'mongoose';
import { IRefund } from '../interfaces/refund';
import { Status } from '../enum/appEnum';

const RefundSchema: Schema = new Schema<IRefund>({
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paystackReference: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.PENDING
    },
    reason: {
        type: String,
        required: false
    }
}, { timestamps: true });

export const Refund = mongoose.model<IRefund>('Refund', RefundSchema);