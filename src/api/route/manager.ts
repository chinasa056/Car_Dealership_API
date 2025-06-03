import { Router } from "express";
import * as RequestHandler from '../requestHandlers/manager';
import { authenticate } from "../middleware/authentication";
import { createManagerValidator, loginManagerValidator } from "src/core/validation/manaer";

const router = Router();

router.post('/', createManagerValidator, RequestHandler.registerManager);

router.post('/login',loginManagerValidator, RequestHandler.loginManager);

router.delete('/:managerId', authenticate, RequestHandler.deleteManagerHandler)

export default router