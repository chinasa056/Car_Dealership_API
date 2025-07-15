// src/models/Car.ts
import { Schema, model } from 'mongoose';
import { ICar } from '../interfaces/car';

const carSchema = new Schema<ICar>(
  {
    brand: { type: String, required: true },
    carModel: { type: String, required: true },
    price: { type: Number, required: true },
    year: { type: Number, required: true },
    available: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [
      {
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Car = model<ICar>('Car', carSchema);
