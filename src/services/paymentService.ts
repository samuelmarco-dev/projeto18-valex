import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config();

import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import { Business } from "../repositories/businessRepository.js";
import { Card } from "../repositories/cardRepository.js";
import { Recharge } from '../repositories/rechargeRepository.js';
import { PaymentInsertData, PaymentWithBusinessName } from "../repositories/paymentRepository.js";
import { calculeTotalCardBalance, verifyEqualityPassword } from "./cardService.js";

async function createPayment(card: Card, business: Business, amount: number, password: string){
    const amountCent = amount * 100;
    const date = dayjs().format("MM/YYYY");
    const verifyCard = card.isBlocked || !card.password || !card.originalCardId;

    if(date > card.expirationDate || verifyCard) throw{
        type: "CardNotActiveOrExpired",
        message: "Card not activated yet or expired"
    }

    if(business.type !== card.type) throw{
        type: "BusinessTypeNotMatch",
        message: "Business type does not match card type"
    }

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const passwordDecrypted: string = cryptr.decrypt(card.password);
    verifyEqualityPassword(password, passwordDecrypted);

    const allRecharges: Recharge[] = await rechargeRepository.findByCardId(card.id);
    const allPayments: PaymentWithBusinessName[] = await paymentRepository.findByCardId(card.id);

    const balanceCard = calculateAvailableBalance(allRecharges, amountCent, allPayments);

    if(balanceCard < 0) throw{
        type: "InsufficientBalance",
        message: "Insufficient balance"
    }

    const objPayment: PaymentInsertData = {
        cardId: card.id,
        businessId: business.id,
        amount: amountCent
    }
    await paymentRepository.insert(objPayment);
}

function calculateAvailableBalance(arrRecharges: any[], amount: number, arrPayments: any[]) {
    const availableBalance = calculeTotalCardBalance(arrPayments, arrRecharges);

    return (availableBalance) - amount;
}

const paymentService = {
    createPayment
}

export default paymentService;
