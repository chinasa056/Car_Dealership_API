import { Request, Response, NextFunction } from "express";
import { any } from "joi";
import mongoose from "mongoose";
import * as CarController from "src/core/controllers/cars";
import { responseHandler } from "src/core/helpers/utilities";


// export const createCar = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = res.locals.user._id
//     const categoryId = req.params.categ
//     const result = await CarController.processCreateCar(req.body, userId, categoryId);
//     res.status(201).json(responseHandler(result.data, result.message));
//   } catch (error) {
//     next(error);
//   }
// };

export const createCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user._id
    const { categoryId } = req.params;
    const category = new mongoose.Types.ObjectId(categoryId);
    
    const result = await CarController.processCreateCar(req.body, userId, category);
    res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CarController.processUpdateCar(req.params.id, req.body);
    res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CarController.processDeleteCar(req.params.id);
    res.status(201).json({ message: 'Car deleted successfully' })
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CarController.processGetCarById(req.params.id);
    res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};


export const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 5,
      brand: req.query.brand as string,
      carModel: req.query.carModel as string,
      available: req.query.available !== undefined ? req.query.available === 'true' : undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    };

    const result = await CarController.processGetALLCars(query);
    res.status(200).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};
