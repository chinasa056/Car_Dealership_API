import { Router } from 'express';
import * as RequestHandler from '../requestHandlers/customer';

const router = Router();

router.post('/customer/create', RequestHandler.createCustomer);
router.post('/customer/login', RequestHandler.loginCustomer);

export default router
