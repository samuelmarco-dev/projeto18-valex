import { NextFunction, Request, Response } from "express";
import dayjs from "dayjs";

import * as cardRepository from "../repositories/cardRepository.js";

export async function validateActiveCard(req: Request, res: Response, next: NextFunction){
    const { cardId, cvv }: {cardId: number, cvv: string} = req.body;
    if(!cardId || !cvv) return res.status(400).send('Missing cardId or cvv');

    const cardFound = await cardRepository.findById(cardId);

    const date = dayjs().format('MM/YYYY');
    const verify = cardFound.password || cardFound.isBlocked || date > cardFound.expirationDate;
    if(!cardFound || verify) return res.status(400).send('Card is blocked, expired or already activated');

    res.locals.card = cardFound;
    next();
}
