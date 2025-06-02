import { Router } from "express";
import * as RequestHandler from '../requestHandlers/cars';
import { authenticate, authorizeManager } from "../middleware/authentication";
import { carQueryValidator, createCarValidator, updateCarValidator } from "src/core/validation/car";
const router = Router();

router.post('/create/:categoryId', authenticate, authorizeManager, createCarValidator, RequestHandler.createCar);

router.get('/:id', authenticate, RequestHandler.getCarById);

router.patch('/update/:id', authenticate, authorizeManager,updateCarValidator, RequestHandler.updateCar);

router.delete('/delete/:id', authenticate, authorizeManager, RequestHandler.deleteCar);

router.get('/', authenticate, carQueryValidator, RequestHandler.getAllCars)


export default router