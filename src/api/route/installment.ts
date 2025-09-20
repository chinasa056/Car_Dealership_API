import { Router } from 'express';
import { authenticate } from '../middleware/authentication';
import { asyncHandler } from 'src/core/helpers/asyncHandler';
import * as RequestHandler from '../requestHandlers/installment';

const router = Router();
router.post('/:purchaseId', authenticate, asyncHandler(RequestHandler.createInstallmentPlan));

export default router