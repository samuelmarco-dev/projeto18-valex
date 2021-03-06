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
    return devolveCardCVV(dataCard.securityCode);
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

function devolveCardCVV(code: string){
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const cvv = cryptr.decrypt(code);

    return cvv;
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
    const verifyBlock = date > card.expirationDate || card.isBlocked || !card.password;

    if(verifyBlock) throw {
        type: "CardNotCanBeBlocked",
        message: "Card not can be blocked"
    }

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const passwordDecrypted = cryptr.decrypt(card.password);
    verifyEqualityPassword(password, passwordDecrypted);

    const cardBlock: CardUpdateData = {
        ...card,
        isBlocked: true
    }
    await cardRepository.update(card.id, cardBlock);
}

async function unlockCard(card: Card, password: string){
    const date = dayjs().format('MM/YYYY');
    const verifyUnlock = date > card.expirationDate || !card.isBlocked || !card.password;

    if(verifyUnlock) throw {
        type: "CardNotCanBeUnlocked",
        message: "Card not can be unlocked"
    }

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const passwordDecrypted: string = cryptr.decrypt(card.password);
    verifyEqualityPassword(password, passwordDecrypted);

    const cardUnlock: CardUpdateData = {
        ...card,
        isBlocked: false
    }
    await cardRepository.update(card.id, cardUnlock);
}

export function verifyEqualityPassword(password: string, passwordDecrypted: string){
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

export function calculeTotalCardBalance(transactions: any[], recharges: any[]) {
    const spent: number = transactions.reduce((total: number, transaction: Payment) => {
        return total + transaction.amount;
    }, 0);
    const received: number = recharges.reduce((total: number, recharge: Recharge)=> {
        return total + recharge.amount;
    }, 0);

    return (received - spent);
}

async function getInformationCardWithSafety(allInformations: any[], employee: Employee) {
    validateCardTypesInArray(allInformations.map(item => item.type));
    validateCardTypesInArray(allInformations.map(item => item.cardId));

    const numberCardsUser = await cardRepository.findCardsByEmployeeId(employee.id);
    if(numberCardsUser.length !== allInformations.length) throw {
        type: "InvalidNumberCards",
        message: "Number of invalid cards"
    }
    if(!numberCardsUser.length) throw {
        type: "NoCards",
        message: "No cards"
    }

    return await returnArrayOfUserCards(employee, allInformations);
}

function validateCardTypesInArray(array: any[]){
    for(let i = 0; i < array.length; i++){
        for(let j = i + 1; j < array.length; j++){

            if(array[i] === array[j]) throw {
                type: "CardAlreadyExists",
                message: "Card type or id already exists in the request"
            }
        }
    }
    return true;
}

function verifyEqualityCVV(cvv: string, cvvDecrypted: string){
    if(cvv !== cvvDecrypted) throw{
        type: "InvalidCVVCard",
        message: "Invalid CVV"
    }
    return true;
}

async function returnArrayOfUserCards(employee: Employee, arrRequest: any[]){
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const date = dayjs().format('MM/YYYY');
    const arrFinally: any[] = [];

    for(const card of arrRequest){
        const { cardId, password, cvv, type }: {cardId: number, password: string, cvv: string, type: TransactionTypes} = card;
        const cardFound: Card = await cardRepository.findById(cardId);

        if(!cardFound) throw {
            type: "CardNotFound",
            message: "Card not found"
        }

        const verifyCard = !cardFound.password || cardFound.isBlocked || cardFound.type !== type || cardFound.id !== cardId;
        if(verifyCard || cardFound.employeeId !== employee.id || date > cardFound.expirationDate) throw {
            type: "InvalidCard",
            message: "Invalid card"
        }

        const passwordDecrypted: string = cryptr.decrypt(cardFound.password);
        verifyEqualityPassword(password, passwordDecrypted);

        const cvvDecrypted: string = cryptr.decrypt(cardFound.securityCode);
        verifyEqualityCVV(cvv, cvvDecrypted);

        arrFinally.push({
            number: cardFound.number.split("-").join(" "),
            cardholderName: cardFound.cardholderName,
            expirationDate: returnExpirationDateFormated(cardFound.expirationDate),
            securityCode: passwordDecrypted
        });
    }

    return arrFinally;
}

function returnExpirationDateFormated(expirationDate: string){
    const arrSplit = expirationDate.split("/");
    const arrFormat = [arrSplit[0], arrSplit[1].slice(2, 4)];

    return arrFormat.join("/");
}

const cardService = {
    createCard,
    activePasswordCardId,
    blockCard,
    unlockCard,
    getInformationDataOfCard,
    getInformationCardWithSafety
}

export default cardService;
