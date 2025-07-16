// routes/purchaseRoutes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authentication';
import { asyncHandler } from 'src/core/utils/asyncHandler';
import { purchaseCarHandler } from '../requestHandlers/purchase';

const router = Router();

router.post(
  '/:carId',
  authenticate,
  asyncHandler(purchaseCarHandler)
);

export default router;
