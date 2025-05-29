import { Types, Document } from "mongoose";

export interface ICar extends Document {
    brand: string;
    carModel: string;
    price: number;
    year: number;
    available: boolean;
    category: Types.ObjectId;
}
