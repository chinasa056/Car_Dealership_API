import { Document } from "mongoose";
export interface ICategory extends Document {
  name: string;
  description?: string;
};

// Request payload when creating a new category
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

// Response after creating or updating a category
export interface CategoryResponse {
  message: string;
  data: any
}

// Response when fetching multiple categories
export interface CategoryListResponse {
  message: string;
  data: {
    categories: {
      _id: string;
      name: string;
      description?: string;
    }[];
  };
}

// src/interfaces/category.ts

export interface CreateCategoryResponse {
  message: string;
  data: any
}

export interface GetAllCategoriesResponse {
  message: string;
  data: any
}

export interface GetSingleCategoryResponse {
  message: string;
  data: any
}

export interface DeleteCategoryResponse {
  message: string;
  data: null;
}
