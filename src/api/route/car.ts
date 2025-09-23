import { Router } from "express";
import * as CarHandler from '../requestHandlers/cars';
import { authenticate, authorizeManager } from "../middleware/authentication";
import { createCarValidator, updateCarValidator } from "src/core/validation/car";
const router = Router();
import upload from "src/core/utils/multer";
import { asyncHandler } from "src/core/helpers/asyncHandler";

router.post(
  '/cars/:categoryId',
  authenticate,
  authorizeManager,
  upload.array('images', 5), 
  createCarValidator, 
  asyncHandler(CarHandler.createCar)
);

router.get('/:id', authenticate, asyncHandler(CarHandler.getCarById));

router.patch('/:id', authenticate, authorizeManager,updateCarValidator, asyncHandler(CarHandler.updateCar));

router.delete('/:id', authenticate, authorizeManager, asyncHandler(CarHandler.deleteCar));

router.get('/', authenticate, asyncHandler(CarHandler.getAllCars));


export default router