import { Types, Document } from "mongoose";
import { PaymentOption, Status } from "../enum/appEnum";

export interface IPurchase extends Document {
  buyer: Types.ObjectId;
  car: Types.ObjectId;
  purchaseDate: Date;
  priceSold: number;
  quantity: number;
  totalPrice: number;
  brand: string;
  carModel: string;
  categoryId: Types.ObjectId;
  categoryName: string;
  status: Status
  paymentOption?: PaymentOption;
  createdAt: Date;
  updatedAt: Date;
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