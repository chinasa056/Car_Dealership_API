import { Router } from 'express';
import * as RequestHandler from '../requestHandlers/category';
import { authenticate, authorizeManager } from '../middleware/authentication';
import { createCategoryValidator } from 'src/core/validation/category';
import { asyncHandler } from 'src/core/helpers/asyncHandler';

const router = Router();

router.post('/', authenticate, authorizeManager, createCategoryValidator, asyncHandler(RequestHandler.createCategory));

router.get('/', asyncHandler(RequestHandler.getAllCategories));

router.get('/:categoryId', asyncHandler(RequestHandler.getCategoryCarsHandler));

router.delete('/:id', authenticate, authorizeManager, asyncHandler(RequestHandler.deleteCategory));

export default router;
 