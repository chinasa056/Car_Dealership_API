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

export interface FilterCarsRequest {
  page?: number;
  limit?: number;
  brand?: string;
  carModel?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginatedCarsResponse {
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    results: any[];
  };
}


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

