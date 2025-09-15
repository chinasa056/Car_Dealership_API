import { NextFunction, Request, Response } from 'express';
import * as installmentController from '../../core/controllers/installment';
import { responseHandler } from '../../core/helpers/utilities';
import { CustomError } from 'src/core/error/CustomError';
import { ErrorCode } from 'src/core/enum/error';
import { HttpStatus } from 'src/core/enum/httpCode';

export const createInstallmentPlan = async (req:Request, res: Response, next:NextFunction) => {
    try {
        const purchaseId = req.params.purchaseId;
        if(!purchaseId){
            throw new CustomError('Purchase ID is missing', ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST)
        };

        const userId = req.user?.userId;
        if(!userId){
            throw new CustomError('User ID is undefined', ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST)
        };

        const response = await installmentController.createInstallmentPlan(purchaseId, userId, req.body);
        
        res.json(responseHandler(response, 'Installment plan created successfully'));
    } catch (error) {
        next(error);
    }
};