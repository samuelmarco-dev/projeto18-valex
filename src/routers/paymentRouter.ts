import { Router } from 'express';

import { authCardIsActive } from '../middlewares/authCardActiveMiddleware.js';
import schemaValidation from '../middlewares/schemaMiddleware.js';
import schemaPayment from '../models/schemaPayment.js';

const paymentRouter = Router();

paymentRouter.post('/payment/:id', schemaValidation(schemaPayment), authCardIsActive);

export default paymentRouter;
