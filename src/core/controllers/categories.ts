// src/core/controllers/category.ts
import { Category } from "src/core/models/category";
import { CustomError } from "src/core/error/CustomError";
import { ErrorCode } from "src/core/enum/error";
import { HttpStatus } from 'src/core/enum/httpCode'
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetAllCategoriesResponse,
  GetSingleCategoryResponse,
  DeleteCategoryResponse,
} from "src/core/interfaces/category";
import { Manager } from "../models/manager";

export const processCreateCategory = async (
  body: CreateCategoryRequest,
  userId: string
): Promise<CreateCategoryResponse> => {

  const manager = await Manager.findById({ _id: userId });
  if (!manager) {
    throw new CustomError('Manager not found', ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND)
  };

  const existingCategory = await Category.findOne({ name: body.name });
  if (existingCategory) {
    throw new CustomError(
      `Category with name '${body.name}' already exists`,
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT
    );
  };

  const newCategory = await Category.create(body);

  return {
    message: "Category created successfully",
    data: newCategory
  };
};

export const processGetAllCategories = async (): Promise<GetAllCategoriesResponse> => {
  const categories = await Category.find()

  return {
    message: "Categories fetched successfully",
    data: categories
  };
};

export const processGetCategoryById = async (
  id: string
): Promise<GetSingleCategoryResponse> => {
  const category = await Category.findById(id);
  if (!category) {
    throw new CustomError(
      `Category with ID ${id} not found`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  };

  return {
    message: "Category fetched successfully",
    data: category
  };
};

export const processDeleteCategory = async (
  id: string
): Promise<DeleteCategoryResponse> => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new CustomError(
      `Category with ID ${id} not found`,
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND
    );
  };

  return {
    message: "Category deleted successfully",
    data: null,
  };
};
