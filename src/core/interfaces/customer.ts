import { Types, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  purchasesId?: Types.ObjectId[];
};

export interface RegisterCustomerResponse {
  message: string;
  data: any;
};

export interface CustomerLoginRequest {
  email: string;
  password: string;
};

export interface LoginCustomerResponse {
  name: any;
  email: string;
  token: string
};
