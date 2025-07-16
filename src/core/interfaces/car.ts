import { Types, Document } from "mongoose";

export interface ICar extends Document {
  brand: string;
  carModel: string;
  price: number;
  year: number;
  quantity: number;
  available: boolean;
  category: Types.ObjectId;
  images: {
    imageUrl: string;
    imagePublicId: string;
  }[];
}


// src/interfaces/dto/CreateCarDTO.ts
export interface CreateCarDTO {
  brand: string;
  carModel: string;
  price: number;
  year: number;
  category: string; 
  images?: {
    imageUrl: string;
    imagePublicId: string;
  }[];
}



export interface UpdateCarRequest {
  brand?: string;
  carModel?: string;
  price?: number;
  year?: number;
  available?: boolean;
};

export interface FilterCarsRequest {
  page?: number;
  limit?: number;
  brand?: string;
  carModel?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export interface PaginatedCarsResponse {
  message: string;
  data: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    results: any[];
  };
};

export interface CreateCarResponse {
  message: string;
  data: any;
};

export interface DeleteCarResponse {
  message: string;
  data: null;
};
