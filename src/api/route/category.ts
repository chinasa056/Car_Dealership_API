import { Router } from 'express';
import * as RequestHandler from '../requestHandlers/category';
import { authenticate, authorizeManager } from '../middleware/authentication';
import { createCategoryValidator } from 'src/core/validation/category';

const router = Router();

router.post('/', authenticate, authorizeManager,createCategoryValidator ,RequestHandler.createCategory);

router.get('/', RequestHandler.getAllCategories);

router.get('/:categoryId', RequestHandler.getCategoryCarsHandler)

router.delete('/:id', authenticate, authorizeManager, RequestHandler.deleteCategory);

export default router;
