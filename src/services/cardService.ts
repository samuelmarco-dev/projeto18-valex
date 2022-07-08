import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';

import { TransactionTypes } from '../repositories/cardRepository.js';
import { Employee } from './../repositories/employeeRepository.js';
import { CardInsertData } from '../repositories/cardRepository.js';
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
        isBlocked: false,
        type: type
    };
    return cardDice;
}

function generateHolderName(fullname: string){
    const arrName = fullname.split(' ');
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
            holderName.push(names[i].toLocaleUpperCase());
        }else{
            holderName.push(names[i].charAt(0).toLocaleUpperCase());
        }
    }
    return holderName.join(' ');
}

const cardService = {
    createCard
}

export default cardService;
