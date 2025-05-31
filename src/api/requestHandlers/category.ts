// src/core/handlers/category.ts
import { RequestHandler } from "express";
import {
  processCreateCategory,
  processGetAllCategories,
  processGetCategoryById,
  processDeleteCategory,
} from "src/core/controllers/categories";
import { responseHandler } from "src/core/helpers/utilities";

export const createCategory: RequestHandler = async (req, res, next) => {
  try {

    const response = await processCreateCategory(req.body, res.locals.user.userId);
    res
      .status(201)
      .json(responseHandler(response, "Category created successfully"));
  } catch (error) {
    next(error);
  };
};

export const getAllCategories: RequestHandler = async (req, res, next) => {
  try {
    const response = await processGetAllCategories();
    res.status(200).json(responseHandler(response, "Categories fetched successfully"));
  } catch (error) {
    next(error);
  };
};

export const getCategoryById: RequestHandler = async (req, res, next) => {
  try {
    const response = await processGetCategoryById(req.params.id);
    res.status(200).json(responseHandler(response));
  } catch (error) {
    next(error);
  };
};

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const response = await processDeleteCategory(req.params.id);
    res.status(200).json(responseHandler(response, 'Category Deleted Successfully'));
  } catch (error) {
    next(error);
  }
};
