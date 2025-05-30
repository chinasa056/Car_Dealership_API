import { Router } from "express";
import * as RequestHandler from '../requestHandlers/manager';

const router = Router();

router.post('/manager/register', RequestHandler.registerManager);
router.post('/manager/login', RequestHandler.loginManager);

export default router