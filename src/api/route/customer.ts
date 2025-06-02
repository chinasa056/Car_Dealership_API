import { Router } from 'express';
import * as RequestHandler from '../requestHandlers/customer';
import { loginCustomerValidator, registerCustomerValidator } from 'src/core/validation/customer';

const router = Router();

router.post('/create',registerCustomerValidator, RequestHandler.createCustomer);
router.post('/login',loginCustomerValidator, RequestHandler.loginCustomer);

export default router
