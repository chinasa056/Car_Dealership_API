import { Router } from "express";
import * as RequestHandler from '../requestHandlers/manager';
import { authenticate } from "../middleware/authentication";

const router = Router();

router.post('/register', RequestHandler.registerManager);

router.post('/login', RequestHandler.loginManager);

router.delete('/delete/:managerId', authenticate, RequestHandler.deleteManagerHandler)

export default router