import { Router } from "express";
import * as RequestHandler from '../requestHandlers/manager';

const router = Router();

router.post('/manager/register', RequestHandler.registerManager);

export default router