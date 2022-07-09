import { Router } from 'express';

import { activeCardWithPassword, createCardWithApiKey } from '../controllers/cardController.js';
import { validateActiveCard } from '../middlewares/activeCardMiddleware.js';
import { checkUserExists } from '../middlewares/verifyUserMiddleware.js';
import { authKeyCompany } from '../middlewares/authKeyMiddleware.js';
import schemaValidation from '../middlewares/schemaMiddleware.js';
import schemaCreateCard from '../models/schemaCreateCard.js';
import schemaActiveCard from '../models/schemaActiveCard.js';

const cardRouter = Router();

cardRouter.post('/card/create', schemaValidation(schemaCreateCard), checkUserExists, authKeyCompany, createCardWithApiKey);
cardRouter.post('/card/active/:id', schemaValidation(schemaActiveCard), validateActiveCard, activeCardWithPassword);
cardRouter.get('/cards/:employeeId', );
cardRouter.post('/card/balance/transactions/:id', );
cardRouter.post('/card/block/:id', );
cardRouter.post('/card/unlock/:id', );

export default cardRouter;
