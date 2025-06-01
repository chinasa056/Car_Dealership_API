import { Router } from 'express';
import * as RequestHandler from '../requestHandlers/customer';
import { loginCustomerValidator, registerCustomerValidator } from 'src/core/validation/customer';

const router = Router();

router.post('/customer/create',registerCustomerValidator, RequestHandler.createCustomer);
router.post('/customer/login',loginCustomerValidator, RequestHandler.loginCustomer);

export default router
