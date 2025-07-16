// src/requestHandlers/purchase.ts

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { processPurchaseCar } from 'src/core/controllers/purchase';
import { responseHandler } from 'src/core/helpers/utilities';

export const purchaseCarHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const carId = req.params.id;
    const buyer = req.user?.userId; 
    const buyerId = new mongoose.Types.ObjectId(buyer);

    const result = await processPurchaseCar(carId, buyerId);

    return res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};
