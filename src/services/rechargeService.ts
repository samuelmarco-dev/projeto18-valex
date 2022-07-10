import dayjs from 'dayjs';

import * as cardRepository from '../repositories/cardRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import { Card } from '../repositories/cardRepository.js';
import { Company } from '../repositories/companyRepository.js';

async function createRechargeAmountCardId(card: Card, amount: number, company: Company) {
    const amountCent = amount * 100;
    const date = dayjs().format('MM/YYYY');
    const unionCardEmployee = await cardRepository.findCardJoinEmployee(card.id);

    if(unionCardEmployee.companyId !== company.id) throw {
        type: "CompanyIdDoesNotMatch",
        message: "Company not authorized to make payment"
    }

    const verifyCard = !card.password || card.isBlocked || !card.originalCardId;
    if(date > card.expirationDate || verifyCard) throw{
        type: "CardNotActiveOrExpired",
        message: "Card not activated yet or expired"
    }

    await rechargeRepository.insert({ cardId: card.id, amount: amountCent });
}

const rechargeService = {
    createRechargeAmountCardId
}

export default rechargeService;
