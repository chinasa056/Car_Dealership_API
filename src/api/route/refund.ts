import Router from 'express';
import { authenticate } from '../middleware/authentication';
import { asyncHandler } from 'src/core/helpers/asyncHandler';
import * as RefundHandler from '../requestHandlers/refund';
import { ref } from 'joi';

const refundRouter = Router();

refundRouter.post('/', authenticate, asyncHandler(RefundHandler.requuestRefund));

export default refundRouter;