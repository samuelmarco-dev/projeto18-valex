import { Router } from 'express';

import { activeCardWithPassword, applyBlockCardId, applyUnlockCardId, createCardWithApiKey, getBalanceAndTransactions, getInformationFromEachUserCard } from '../controllers/cardController.js';
import { authKeyCompany } from '../middlewares/authKeyMiddleware.js';
import { checkUserExists } from '../middlewares/verifyUserMiddleware.js';
import { validateActiveCard } from '../middlewares/activeCardMiddleware.js';
import { authCardIsActive } from '../middlewares/authCardActiveMiddleware.js';
import schemaValidation from '../middlewares/schemaMiddleware.js';
import schemaCreateCard from '../models/schemaCreateCard.js';
import schemaActiveCard from '../models/schemaActiveCard.js';
import schemaBlockUnblockCard from '../models/schemaBlockUnblock.js';
import schemaInformationCard from '../models/schemaInformationCard.js';

const cardRouter = Router();

cardRouter.post('/card/create', schemaValidation(schemaCreateCard), checkUserExists, authKeyCompany, createCardWithApiKey);
cardRouter.post('/card/active/:id', schemaValidation(schemaActiveCard), validateActiveCard, activeCardWithPassword);
cardRouter.get('/cards/:employeeId', schemaValidation(schemaInformationCard), checkUserExists, getInformationFromEachUserCard);
cardRouter.get('/card/balance/:id', authCardIsActive, getBalanceAndTransactions);
cardRouter.put('/card/lock/:id', schemaValidation(schemaBlockUnblockCard), authCardIsActive, applyBlockCardId);
cardRouter.put('/card/unlock/:id', schemaValidation(schemaBlockUnblockCard), authCardIsActive, applyUnlockCardId);

export default cardRouter;
