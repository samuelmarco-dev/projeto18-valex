import { Router } from 'express';

import { authBusinesses } from '../middlewares/establishmentMiddleware.js';
import { authCardIsActive } from '../middlewares/authCardActiveMiddleware.js';
import schemaValidation from '../middlewares/schemaMiddleware.js';
import schemaPayment from '../models/schemaPayment.js';
import { createPaymentCardId } from '../controllers/paymentController.js';

const paymentRouter = Router();

paymentRouter.post('/payment/:id', schemaValidation(schemaPayment), authCardIsActive, authBusinesses, createPaymentCardId);

export default paymentRouter;
