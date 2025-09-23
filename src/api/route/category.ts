import { Router } from 'express';
import * as CategoryHandler from '../requestHandlers/category';
import { authenticate, authorizeManager } from '../middleware/authentication';
import { createCategoryValidator } from 'src/core/validation/category';
import { asyncHandler } from 'src/core/helpers/asyncHandler';

const router = Router();

router.post('/', authenticate, authorizeManager, createCategoryValidator, asyncHandler(CategoryHandler.createCategory));

router.get('/', asyncHandler(CategoryHandler.getAllCategories));

router.get('/:categoryId', asyncHandler(CategoryHandler.getCategoryCarsHandler));

router.delete('/:id', authenticate, authorizeManager, asyncHandler(CategoryHandler.deleteCategory));

export default router;
 