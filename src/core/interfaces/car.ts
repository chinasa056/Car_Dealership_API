import { Types, Document } from "mongoose";

export interface ICar extends Document {
    brand: string;
    carModel: string;
    price: number;
    year: number;
    available: boolean;
    category: Types.ObjectId;
};

export interface CreateCarRequest {
  brand: string;
  carModel: string;
  price: number;
  year: number;
  available?: boolean;
  category: Types.ObjectId | string;
};

export interface UpdateCarRequest {
  brand?: string;
  carModel?: string;
  price?: number;
  year?: number;
  available?: boolean;
  category?: Types.ObjectId | string;
};

export interface CarFilters {
  brand?: string;
  carModel?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
};

export interface CreateCarResponse {
  message: string;
  data: any;
};

export interface UpdateCarResponse {
  message: string;
  data: any;
};

export interface GetSingleCarResponse {
  message: string;
  data: any;
}

export interface DeleteCarResponse {
  message: string;
  data: null;
}

export interface GetAllCarsResponse {
  message: string;
  data: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

