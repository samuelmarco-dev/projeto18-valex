import { TransactionTypes } from '../repositories/cardRepository.js';
import { Employee } from './../repositories/employeeRepository.js';

async function createCard(employee: Employee, type: TransactionTypes) {

}

const cardService = {
    createCard
}

export default cardService;
