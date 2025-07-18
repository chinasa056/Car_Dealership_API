import { Request, Response, NextFunction } from "express";
import { any } from "joi";
import mongoose from "mongoose";
import { processPaymentInitialization } from "src/core/controllers/payment";
import { responseHandler } from "src/core/helpers/utilities";
export const initializePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const purchaseId = req.params.purchaseId;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ messgage: "Unauthorized: User ID is missing" });
        };

        const purchase = new mongoose.Types.ObjectId(purchaseId);
        const result = await processPaymentInitialization(purchase, userId);

        res.status(201).json(responseHandler(result.message, result.data));
    } catch (error) {
        next(error);
    }
};
