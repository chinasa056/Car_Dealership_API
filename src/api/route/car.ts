import { NextFunction, Router } from "express";
import * as RequestHandler from '../requestHandlers/cars';
import { authenticate, authorizeManager } from "../middleware/authentication";
import { createCarValidator, updateCarValidator } from "src/core/validation/car";
const router = Router();
import upload from "src/core/utils/multer";
import { asyncHandler } from "src/core/utils/asyncHandler";

router.post(
  '/cars/:categoryId',
  authenticate,
  authorizeManager,
  upload.array('images', 5), 
  createCarValidator, 
  asyncHandler(RequestHandler.createCar)
);

router.get('/:id', authenticate, asyncHandler(RequestHandler.getCarById));

router.patch('/:id', authenticate, authorizeManager,updateCarValidator, asyncHandler(RequestHandler.updateCar));

router.delete('/:id', authenticate, authorizeManager, asyncHandler(RequestHandler.deleteCar));

router.get('/', authenticate, asyncHandler(RequestHandler.getAllCars));


export default router