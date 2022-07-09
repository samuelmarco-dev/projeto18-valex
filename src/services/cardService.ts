import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

import { TransactionTypes } from '../repositories/cardRepository.js';
import { Employee } from './../repositories/employeeRepository.js';
import { CardInsertData, CardUpdateData, Card } from '../repositories/cardRepository.js';
import * as cardRepository from '../repositories/cardRepository.js';

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
        number: faker.finance.creditCardNumber(),
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

    if(password !== passwordDecrypted) throw{
        type: "InvalidPasswordCard",
        message: "Invalid password"
    }

    const cardBlock: CardUpdateData = {
        ...card,
        isBlocked: true
    }
    await cardRepository.update(card.id, cardBlock);
}

async function unblockCard(){

}

const cardService = {
    createCard,
    activePasswordCardId,
    blockCard,
    unblockCard
}

export default cardService;
