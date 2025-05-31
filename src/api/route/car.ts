import { Router } from "express";
import * as RequestHandler from '../requestHandlers/cars';
import { authenticate, authorizeManager } from "../middleware/authentication";
import { createCarValidator } from "src/core/validation/car";
const router = Router();

router.post('/car/create/:categoryId', authenticate, authorizeManager, createCarValidator, RequestHandler.createCarHandler);

router.get('/car/getbyid/:id', authenticate, RequestHandler.getCarByIdHandler);

router.patch('/car/update/:id', authenticate, authorizeManager, RequestHandler.updateCarHandler);

router.delete('/car/delete/:id', authenticate, authorizeManager, RequestHandler.deleteCarHandler);


export default router