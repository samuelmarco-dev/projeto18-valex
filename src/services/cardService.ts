import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

import * as cardRepository from '../repositories/cardRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import { TransactionTypes } from '../repositories/cardRepository.js';
import { Employee } from './../repositories/employeeRepository.js';
import { CardInsertData, CardUpdateData, Card } from '../repositories/cardRepository.js';
import { PaymentWithBusinessName, Payment } from '../repositories/paymentRepository.js';
import { Recharge } from '../repositories/rechargeRepository.js';

async function createCard(employee: Employee, type: TransactionTypes) {
    const cardTypeExists = await cardRepository.findByTypeAndEmployeeId(type, employee.id);
    if(cardTypeExists) throw {
        type: "CardAlreadyExists",
        message: `Card already exists for ${type} transactions`
    }

    const {id, fullName} = employee;
    const dataCard = createDiceOfCard(id, fullName, type);

    await cardRepository.insert(dataCard);
}

function createDiceOfCard(id: number, fullName: string, type: TransactionTypes) {
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const cvv = faker.finance.creditCardCVV();

    const cardDice: CardInsertData = {
        employeeId: id,
        number: faker.finance.creditCardNumber('63[7-9]#-####-####-###L'),
        cardholderName: generateHolderName(fullName),
        securityCode: cryptr.encrypt(cvv),
        expirationDate: dayjs().add(5, 'year').format('MM/YYYY'),
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: true,
        type: type
    };
    return cardDice;
}

function generateHolderName(fullname: string){
    const arrName: string[] = fullname.split(' ');
    const firstName = arrName[0];
    const lastName = arrName.at(-1);

    const names = arrName.map((name: string) => {
        if(name.length >= 3) return name;
        if(name.length < 3 && (name === firstName || name === lastName)) return name;
    });

    const holderName: string[] = [];
    for(let i: number = 0; i < names.length; i++){
        if(!names[i]) continue;
        if(i === 0 || i === names.length - 1){
            holderName.push(names[i].toUpperCase());
        }else{
            holderName.push(names[i].charAt(0).toUpperCase());
        }
    }
    return holderName.join(' ');
}

async function activePasswordCardId(card: Card, password: string, code: string) {
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const cvvDecrypted: string = cryptr.decrypt(card.securityCode);

    if(code !== cvvDecrypted) throw {
        type: "InvalidCode",
        message: "Invalid code CVV"
    }
    if(password.length !== 4) throw {
        type: "InvalidPassword",
        message: "Invalid password"
    }

    const passwordEncrypted: string = cryptr.encrypt(password);
    const cardUpdated: CardUpdateData = {
        ...card,
        password: passwordEncrypted,
        originalCardId: card.id,
        isBlocked: false
    }
    await cardRepository.update(card.id, cardUpdated);
}

async function blockCard(card: Card, password: string){
    const date = dayjs().format('MM/YYYY');
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const passwordDecrypted: string = cryptr.decrypt(card.password);

    const verifyBlock = date > card.expirationDate || card.isBlocked || !card.password;
    if(verifyBlock) throw {
        type: "CardNotCanBeBlocked",
        message: "Card not can be blocked"
    }
    verifyEqualityPassword(password, passwordDecrypted);

    const cardBlock: CardUpdateData = {
        ...card,
        isBlocked: true
    }
    await cardRepository.update(card.id, cardBlock);
}

async function unlockCard(card: Card, password: string){
    const date = dayjs().format('MM/YYYY');
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const passwordDecrypted: string = cryptr.decrypt(card.password);

    const verifyUnlock = date > card.expirationDate || !card.isBlocked || !card.password;
    if(verifyUnlock) throw {
        type: "CardNotCanBeUnlocked",
        message: "Card not can be unlocked"
    }
    verifyEqualityPassword(password, passwordDecrypted);

    const cardUnlock: CardUpdateData = {
        ...card,
        isBlocked: false
    }
    await cardRepository.update(card.id, cardUnlock);
}

function verifyEqualityPassword(password: string, passwordDecrypted: string){
    if(password !== passwordDecrypted) throw{
        type: "InvalidPasswordCard",
        message: "Invalid password"
    }
    return true;
}

async function getInformationDataOfCard(card: Card) {
    const date = dayjs().format('MM/YYYY');
    const verifyCard = !card.password || card.isBlocked;

    if(verifyCard) throw {
        type: "CardNotActive",
        message: "Card not activated yet"
    }
    if(date > card.expirationDate) return {
        cardExpirationDate: card.expirationDate,
        cardExpiration: true
    }

    const transacionsCard: PaymentWithBusinessName[] = await paymentRepository.findByCardId(card.id);
    const rechargesCard: Recharge[] = await rechargeRepository.findByCardId(card.id);
    const balangeTotal = calculeTotalCardBalance(transacionsCard, rechargesCard);

    const dataCard: {
        balance: number,
        transactions: PaymentWithBusinessName[],
        recharges: Recharge[]
    } = {
        balance: balangeTotal,
        transactions: transacionsCard,
        recharges: rechargesCard
    }
    return dataCard;
}

function calculeTotalCardBalance(transactions: any[], recharges: any[]) {
    const spent: number = transactions.reduce((total: number, transaction: Payment) => {
        return total + transaction.amount;
    }, 0);
    const received: number = recharges.reduce((total: number, recharge: Recharge)=> {
        return total + recharge.amount;
    }, 0);

    return (received - spent);
}

const cardService = {
    createCard,
    activePasswordCardId,
    blockCard,
    unlockCard,
    getInformationDataOfCard
}

export default cardService;
