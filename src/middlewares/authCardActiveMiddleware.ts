import { NextFunction, Request, Response } from "express";

import * as cardRepository from "../repositories/cardRepository.js";
import { Card } from "../repositories/cardRepository.js";

export async function authCardIsActive(req: Request, res: Response, next: NextFunction){
    const { id } = req.params;

    const cardFound: Card = await cardRepository.findById(Number(id));
    if(!cardFound) return res.status(404).send('Card not found');

    res.locals.card = cardFound;
    next();
}
