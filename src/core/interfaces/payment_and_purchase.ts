import { Types, Document } from "mongoose";

export interface IPurchase extends Document {
  buyer: Types.ObjectId;
  car: Types.ObjectId;
  purchaseDate: Date;
  priceSold: number;
  quantity: number;
  brand: string;
  carModel: string;
  categoryId: Types.ObjectId;
  categoryName: string;
  status: "Pending" | "Completed" | "Failed";
};


export interface IPayment extends Document {
  purchase: Types.ObjectId;
  email: string;
  customerName: string;
  amount: number;
  reference: string;
  status: "Pending" | "Success" | "Failed";
  provider: "Paystack";
  createdAt: Date;
};

export interface PaymentInitializationResponse {
  message: string;
  data: {
    authorization_url: string;
    reference: string;
    transactionDetails: IPayment;
  };
}

export interface PaymentVerificationResponse {
  message: string;
  data?: {
    payment: IPayment;
    purchase?: IPurchase;
  };
}

export interface getDetailsResponse {
  message: string;
  data: {}
}