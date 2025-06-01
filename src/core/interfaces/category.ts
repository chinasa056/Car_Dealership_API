import { Document } from "mongoose";
export interface ICategory extends Document {
  name: string;
  description?: string;
};

export interface CreateCategoryResponse {
  message: string;
  data: any
};

export interface DeleteCategoryResponse {
  message: string;
  data: null;
};

export interface GetCategoryCarsResponse {
  message: string;
  data: {
    category: any;
    cars: any[];
  };
};
