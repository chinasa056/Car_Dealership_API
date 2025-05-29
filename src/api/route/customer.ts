import { Router } from 'express';
import * as RequestHandler from '../requestHandlers/customer';

const router = Router();

router.post('/customer/create', RequestHandler.createCustomer);

export default router
