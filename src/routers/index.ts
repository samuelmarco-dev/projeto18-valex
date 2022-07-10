import { Router } from 'express';

import cardRouter from './cardRouter.js';
import rechargeRouter from './paymentRouter.js';
import paymentRouter from './rechargeRouter.js';

const routesApp = Router();

routesApp.use(cardRouter);
routesApp.use(rechargeRouter);
routesApp.use(paymentRouter);

export default routesApp;
