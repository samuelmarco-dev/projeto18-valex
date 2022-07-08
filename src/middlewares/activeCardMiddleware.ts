import { NextFunction, Request, Response } from "express";
import dayjs from "dayjs";
import Cryptr from 'cryptr';
import dotenv from 'dotenv';
dotenv.config();

import * as cardRepository from "../repositories/cardRepository.js";

export async function validateActiveCard(req: Request, res: Response, next: NextFunction){
    const { cardId, cvv }: {cardId: number, cvv: string} = req.body;
    if(!cardId || !cvv) return res.status(400).send('Missing cardId or cvv');

    const cardFound = await cardRepository.findById(cardId);

    const date = dayjs().format('MM/YYYY');
    const verify = cardFound.password || cardFound.isBlocked || date >= cardFound.expirationDate;
    if(!cardFound || verify) return res.status(400).send('Card is blocked, expired or already activated');

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET);
    const cvvDecrypt = cryptr.decrypt(cardFound.securityCode);
    if(cvv !== cvvDecrypt) return res.status(400).send('Invalid cvv');

    res.locals.card = cardFound;
    next();
}
