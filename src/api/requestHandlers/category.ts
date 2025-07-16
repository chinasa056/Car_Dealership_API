// src/core/handlers/category.ts
import { RequestHandler } from "express";
import {
  processCreateCategory,
  processGetAllCategories,
  processDeleteCategory,
  processGetCategoryCars,
} from "src/core/controllers/categories";
import { responseHandler } from "src/core/helpers/utilities";

export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
       res.status(400).json({ message: 'User ID not found in request.' });
       return
    };
    
    const response = await processCreateCategory(req.body, userId);
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

export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const response = await processDeleteCategory(req.params.id);
    res.status(200).json(responseHandler(response, 'Category Deleted Successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCategoryCarsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { categoryId } = req.params;
    const response = await processGetCategoryCars(categoryId);
    res.status(200).json(responseHandler(response.data, response.message));
  } catch (error) {
    next(error);
  }
};

