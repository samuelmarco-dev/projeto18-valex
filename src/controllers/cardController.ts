import { Request, Response } from "express";

import { TransactionTypes } from "../repositories/cardRepository.js";
import cardService from "../services/cardService.js";

export async function createCardWithApiKey(req: Request, res: Response){
    const { employee, company } = res.locals;
    const { typeCard }: {typeCard: TransactionTypes} = req.body;

    if(company.id !== employee.companyId) return res.status(401).send("Company not authorized to create card");

    await cardService.createCard(employee, typeCard);
    res.sendStatus(201);
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
}

export async function applyUnblockCardId(req: Request, res: Response){
    const { card } = res.locals;
    const { cardId, password }: {cardId: number, password: string} = req.body;

    if(!cardId) return res.status(400).send('Missing cardId');
    if(card.id !== cardId) return res.status(401).send('Card identifiers do not match');

    await cardService.unblockCard();
}
