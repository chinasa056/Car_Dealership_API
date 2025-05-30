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

export interface ManagerLoginRequest {
  email: string;
  password: string;
};

export interface ManagerLoginResponse {
  name: any;
  email: string;
  token: string
};
