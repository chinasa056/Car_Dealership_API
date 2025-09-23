// routes/purchaseRoutes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authentication';
import { asyncHandler } from 'src/core/helpers/asyncHandler';
import * as PurchaseHandler from '../requestHandlers/purchase';

const router = Router();

router.post(
  '/:carId',
  authenticate,
  asyncHandler(PurchaseHandler.purchaseCar)
);

router.patch('/:id', authenticate,
  asyncHandler(PurchaseHandler.viewSinglePurchaseDetail)
);

router.get('/', authenticate, asyncHandler(PurchaseHandler.viewAllPurchases));

router.patch('/:id/select-payment-option', authenticate,
  asyncHandler(PurchaseHandler.selectPaymentOption)
);

export default router;
