import { Router } from "express";
import * as RequestHandler from '../requestHandlers/cars';
import { authenticate, authorizeManager } from "../middleware/authentication";
import { carQueryValidator, createCarValidator } from "src/core/validation/car";
const router = Router();

router.post('/car/create/:categoryId', authenticate, authorizeManager, createCarValidator, RequestHandler.createCar);

router.get('/car/getbyid/:id', authenticate, RequestHandler.getCarById);

router.patch('/car/update/:id', authenticate, authorizeManager, RequestHandler.updateCar);

router.delete('/car/delete/:id', authenticate, authorizeManager, RequestHandler.deleteCar);

router.get('/cars', authenticate, carQueryValidator, RequestHandler.getAllCars)


export default router