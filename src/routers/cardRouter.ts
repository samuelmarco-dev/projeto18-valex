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
/*ON HOLD:
    cardRouter.get('/cards/:employeeId', );
    FIXME: visualizar cartões do usuário, com falha de segurança até o momento...
        - um usuário qualquer pode chutar senhas de outros usuários
        - caso o usuário erre a senha de pelo menos 1 cartão, ainda pode visualizar os
        cartões em que a senha está correta
*/
cardRouter.post('/card/balance/transactions/:id', );
cardRouter.post('/card/block/:id', );
cardRouter.post('/card/unlock/:id', );

export default cardRouter;
