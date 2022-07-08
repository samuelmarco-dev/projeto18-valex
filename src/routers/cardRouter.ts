import { Router } from 'express';

import { createCardWithApiKey } from '../controllers/cardController.js';
import { checkUserExists } from '../middlewares/verifyUserMiddleware.js';
import { authKeyCompany } from '../middlewares/authKeyMiddleware.js';
import schemaValidation from '../middlewares/schemaMiddleware.js';
import schemaCreateCard from '../models/schemaCreateCard.js';

const cardRouter = Router();

cardRouter.post('/card/create', schemaValidation(schemaCreateCard), checkUserExists, authKeyCompany, createCardWithApiKey);
cardRouter.post('/card/active/:id', );
cardRouter.get('/cards/:employeeId', );
cardRouter.post('/card/balance/transactions/:id', );
cardRouter.post('/card/block/:id', );
cardRouter.post('/card/unlock/:id', );

export default cardRouter;
