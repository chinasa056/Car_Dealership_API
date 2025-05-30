import { Document } from "mongoose";

export interface IManager extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager';
};

export interface RegisterManagerResponse {
  message: string;
  data: any;
};