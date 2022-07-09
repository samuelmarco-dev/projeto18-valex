import { Router } from 'express';

import cardRouter from './cardRouter.js';
import rechargeRouter from './rechargeRouter.js';
import paymentRouter from './paymentRouter.js';

const routesApp = Router();

routesApp.use(cardRouter);
routesApp.use(rechargeRouter);
routesApp.use(paymentRouter);

export default routesApp;
