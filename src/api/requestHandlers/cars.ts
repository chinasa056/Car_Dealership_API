import { Request, Response, NextFunction } from "express";
import * as CarController from "src/core/controllers/cars";
import { responseHandler } from "src/core/helpers/utilities";
import { HttpStatus } from "src/core/enum/httpCode";
import { CustomError } from "src/core/error/CustomError";

export const createCarHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.userId;
    const { categoryId } = req.params
    const result = await CarController.processCreateCar(req.body, userId, categoryId);
    res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};

export const updateCarHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CarController.processUpdateCar(req.params.id, req.body);
    res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};

export const deleteCarHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CarController.processDeleteCar(req.params.id);
  res.status(201).json({message: 'Car deleted successfully'})
  } catch (error) {
    next(error);
  }
};

export const getCarByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CarController.processGetCarById(req.params.id);
    res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};

// export const getAllCarsHandler = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const {
//       brand,
//       carModel,
//       minPrice,
//       maxPrice,
//       available,
//       page = "1",
//       limit = "10",
//     } = req.query;

//     const filters = {
//       brand: brand as string,
//       carModel: carModel as string,
//       minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
//       maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
//       available: available !== undefined ? available === "true" : undefined,
//     };

//     const result = await CarController.processGetAllCars(filters, parseInt(page as string), parseInt(limit as string));
//     return responseHandler(res, HttpStatus.OK, result.message, {
//       cars: result.data,
//       pagination: result.pagination,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
