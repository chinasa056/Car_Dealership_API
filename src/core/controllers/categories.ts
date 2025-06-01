// src/core/controllers/category.ts
import { Category } from "src/core/models/category";
import { CustomError } from "src/core/error/CustomError";
import { ErrorCode } from "src/core/enum/error";
import { HttpStatus } from 'src/core/enum/httpCode'
import {
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoryCarsResponse,
  ICategory,
} from "src/core/interfaces/category";
import { Manager } from "../models/manager";
import { Car } from "../models/car";

export const processCreateCategory = async (
  body: ICategory,
  userId: string
): Promise<CreateCategoryResponse> => {

  const manager = await Manager.findById({ _id: userId });
  if (!manager) {
    throw new CustomError('Manager not found', ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND)
  };

  const existingCategory = await Category.findOne({ name: body.name.toLowerCase() });
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

export const processGetAllCategories = async (): Promise<CreateCategoryResponse> => {
  const categories = await Category.find().select('name');

  return {
    message: "Categories fetched successfully",
    data: categories
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

export const processGetCategoryCars = async (
  categoryId: string
): Promise<GetCategoryCarsResponse> => {
  const category = await Category.findById(categoryId).select('name');
  if (!category) {
    throw new CustomError('Category not found', ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  };

  const cars = await Car.find({ category: categoryId });

  return {
    message: 'Category and associated cars fetched successfully',
    data: {
      category,
      cars,
    },
  };
};

