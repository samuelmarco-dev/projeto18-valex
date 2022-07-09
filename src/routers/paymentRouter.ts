import { Router } from 'express';

import { createPaymentOfCard } from '../controllers/paymentController';
import { authCardIsActive } from '../middlewares/authCardActiveMiddleware';
import { authKeyCompany } from '../middlewares/authKeyMiddleware';
import schemaValidation from '../middlewares/schemaMiddleware';
import schemaPayment from '../models/schemaPayment';

const paymentRouter = Router();

paymentRouter.post('/payment/:id', schemaValidation(schemaPayment), authKeyCompany, authCardIsActive, createPaymentOfCard);

export default paymentRouter;
