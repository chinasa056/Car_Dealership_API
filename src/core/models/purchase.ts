import { Schema, model, models } from "mongoose";
import { IPurchase } from "../interfaces/payment_and_purchase";
import { PaymentOption, Status } from "../enum/appEnum";

const purchaseSchema = new Schema<IPurchase>(
    {
        buyer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        car: {
            type: Schema.Types.ObjectId,
            ref: "Car",
            required: true,
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        },
        priceSold: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        carModel: {
            type: String,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        categoryName: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.PENDING,
        },
        paymentOption: {
            type: String,
            enum: Object.values(PaymentOption), 
            default: PaymentOption.FULL_PAYMENT,
            required: false,
        },
    },
    { timestamps: true }
);

export const Purchase = models.Purchase || model<IPurchase>("Purchase", purchaseSchema);
