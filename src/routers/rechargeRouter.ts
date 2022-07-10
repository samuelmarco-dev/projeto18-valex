import { Router } from 'express';

import { createRechargeOfCard } from '../controllers/rechargeController.js';
import { authCardIsActive } from '../middlewares/authCardActiveMiddleware.js';
import { authKeyCompany } from '../middlewares/authKeyMiddleware.js';
import schemaValidation from '../middlewares/schemaMiddleware.js';
import schemaPayment from '../models/schemaPayment.js';

const rechargeRouter = Router();

rechargeRouter.post('/recharge/:id', schemaValidation(schemaPayment), authKeyCompany, authCardIsActive, createRechargeOfCard);

export default rechargeRouter;
