import { Request, Response } from "express";

import { TransactionTypes } from "../repositories/cardRepository.js";
import cardService from "../services/cardService.js";

export async function createCardWithApiKey(req: Request, res: Response){
    const { employee } = res.locals;
    const { typeCard }: {typeCard: TransactionTypes} = req.body;

    await cardService.createCard(employee, typeCard);
    res.sendStatus(201);
}

export async function activeCardWithPassword(req: Request, res: Response){
    const { card } = res.locals;
    const { cardId, cvv, password }: {cardId: number, cvv: string, password: string} = req.body;

    await cardService.activePasswordCardId(cardId, password, card, cvv);
    res.sendStatus(200);
}
