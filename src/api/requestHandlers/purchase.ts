import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { responseHandler } from 'src/core/helpers/utilities';
import * as purchaseController from 'src/core/controllers/purchase';

export const purchaseCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const carId = req.params.id;
    const buyer = req.user?.userId; 
    const buyerId = new mongoose.Types.ObjectId(buyer);

    const result = await purchaseController.processPurchaseCar(req.body,carId, buyerId, );

    return res.status(201).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
};

export const viewSinglePurchaseDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseId = req.params.id;
    const purchase = await purchaseController.viewSinglePurchaseDetail(purchaseId);

    return res.status(200).json(responseHandler(purchase.data, purchase.message));
    
  } catch (error) {
    next(error);
  }
};

export const viewAllPurchases = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchases = await purchaseController.viewAllPurchases();

    return res.status(200).json(responseHandler(purchases, "Purchases fetched successfully"));
  } catch (error) {
    next(error);
  }
}

export const selectPaymentOption = async (
  req: Request,
  res: Response,
  next: NextFunction  
) => {
  try {
    const purchaseId = req.params.id;
    const { paymentOption } = req.body; 
    const result = await purchaseController.selectPaymentOption(purchaseId, paymentOption);
    if (!result) {
      return res.status(404).json('Purchase not found');
    };

    return res.status(200).json(responseHandler(result.data, result.message));
  } catch (error) {
    next(error);
  }
}