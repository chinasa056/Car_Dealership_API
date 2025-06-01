import { Router } from "express";
import * as RequestHandler from '../requestHandlers/manager';

const router = Router();

router.post('/register', RequestHandler.registerManager);
router.post('/login', RequestHandler.loginManager);
router.patch('/update/:mnagerId', RequestHandler.updateManagerHandler);
router.delete('/delete/:managerId', RequestHandler.deleteManagerHandler)

export default router