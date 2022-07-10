import { Request, Response } from "express";

import { TransactionTypes } from "../repositories/cardRepository.js";
import cardService from "../services/cardService.js";

export async function createCardWithApiKey(req: Request, res: Response){
    const { employee, company } = res.locals;
    const { typeCard }: {typeCard: TransactionTypes} = req.body;

    if(company.id !== employee.companyId) return res.status(401).send("Company not authorized to create card");

    const cvv = await cardService.createCard(employee, typeCard);
    res.status(201).send(cvv);
}

export async function activeCardWithPassword(req: Request, res: Response){
    const { card } = res.locals;
    const { cardId, cvv, password, confirmPassword }:
    { cardId: number, cvv: string, password: string, confirmPassword: string } = req.body;

    if(password !== confirmPassword) return res.status(422).send("Password and confirm password are not the same");
    if(card.id !== cardId) return res.sendStatus(401);

    await cardService.activePasswordCardId(card, password, cvv);
    res.sendStatus(200);
}

export async function applyBlockCardId(req: Request, res: Response){
    const { card } = res.locals;
    const { cardId, password }: {cardId: number, password: string} = req.body;

    if(!cardId) return res.status(400).send('Missing cardId');
    if(card.id !== cardId) return res.status(401).send('Card identifiers do not match');

    await cardService.blockCard(card, password);
    res.sendStatus(200);
}

export async function applyUnlockCardId(req: Request, res: Response){
    const { card } = res.locals;
    const { cardId, password }: {cardId: number, password: string} = req.body;

    if(!cardId) return res.status(400).send('Missing cardId');
    if(card.id !== cardId) return res.status(401).send('Card identifiers do not match');

    await cardService.unlockCard(card, password);
    res.sendStatus(200);
}

export async function getBalanceAndTransactions(req: Request, res: Response){
    const { card } = res.locals;
    const { id } = req.params;

    if(card.id !== Number(id)) return res.status(401).send('Card identifiers do not match');

    const balanceTotal = await cardService.getInformationDataOfCard(card);
    res.status(200).send(balanceTotal);
}

export async function getInformationFromEachUserCard(req: Request, res: Response){
    const { employee } = res.locals;
    const { employeeId } = req.params;
    const { passwords } = req.body;

    if(employee.id !== Number(employeeId)) return res.status(401).send('Employee identifiers do not match');

    const cards = await cardService.getInformationCardWithSafety(passwords, employee);
    res.status(200).send(cards);
}
