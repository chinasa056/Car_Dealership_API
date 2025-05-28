// src/models/Car.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ICar extends Document {
    brand: string;
    carModel: string;
    price: number;
    year: number;
    available: boolean;
    category: Types.ObjectId;
}

const carSchema = new Schema<ICar>({
    brand: { type: String, required: true },
    carModel: { type: String, required: true },
    price: { type: Number, required: true },
    year: { type: Number, required: true },
    available: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
}, {
    timestamps: true
});

export const Car = model<ICar>('Car', carSchema);
