import { NextFunction, Request, Response } from "express";
import dayjs from "dayjs";

import * as cardRepository from "../repositories/cardRepository.js";
import { Card } from "../repositories/cardRepository.js";

export async function validateActiveCard(req: Request, res: Response, next: NextFunction){
    const { cardId, cvv }: {cardId: number, cvv: string} = req.body;
    const { id } = req.params;

    if(!cardId || !cvv) return res.status(400).send('Missing cardId or cvv');
    if(cardId !== Number(id)) return res.status(400).send('Card identifiers do not match');

    const cardFound: Card = await cardRepository.findById(cardId);
    if(!cardFound) return res.status(404).send('Card not found');

    const date = dayjs().format('MM/YYYY');
    const verify = cardFound.password || !cardFound.isBlocked || date > cardFound.expirationDate || cardFound.originalCardId;
    if(verify) return res.status(400).send('Card is blocked, expired or already activated');

    res.locals.card = cardFound;
    next();
}
