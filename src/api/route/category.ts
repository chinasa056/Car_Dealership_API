import { Router } from 'express';
import * as RequestHandler from '../requestHandlers/category';
import { authenticate, authorizeManager } from '../middleware/authentication';

const router = Router();

router.post('/category/create', authenticate, authorizeManager, RequestHandler.createCategory);

router.get('/category/fetch', RequestHandler.getAllCategories);

router.get('/category/fetchOne/:id', RequestHandler.getCategoryById);

router.delete('/category/delete/:id', authenticate, authorizeManager, RequestHandler.deleteCategory);

export default router;
