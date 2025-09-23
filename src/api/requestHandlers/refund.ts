import { NextFunction, Request, Response } from "express";
import * as refundController from "src/core/controllers/refund";
import { responseHandler } from "src/core/helpers/utilities";

export const requuestRefund = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = req.params.id;
        const reason = req.body.reason
        const result = await refundController.requestRefund(paymentId, reason);
        return res.status(200).json(responseHandler(result, result.message));
    } catch (error) {
        next(error);
    }
}