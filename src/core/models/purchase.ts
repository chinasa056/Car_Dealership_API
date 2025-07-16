import { Schema, model } from "mongoose";
import { IPurchase } from "../interfaces/payment_and_purchase";

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
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

export const Purchase = model<IPurchase>("Purchase", purchaseSchema);
