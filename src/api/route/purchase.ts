// routes/purchaseRoutes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authentication';
import { asyncHandler } from 'src/core/helpers/asyncHandler';
import * as RequestHandler from '../requestHandlers/purchase';

const router = Router();

router.post(
  '/:carId',
  authenticate,
  asyncHandler(RequestHandler.purchaseCar)
);

router.patch('/:id', authenticate,
  asyncHandler(RequestHandler.viewSinglePurchaseDetail)
);

router.get('/', authenticate, asyncHandler(RequestHandler.viewAllPurchases));

router.patch('/:id/select-payment-option', authenticate,
  asyncHandler(RequestHandler.selectPaymentOption)
);

export default router;
