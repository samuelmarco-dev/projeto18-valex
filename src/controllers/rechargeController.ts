import { Request, Response } from "express";

import rechargeService from "../services/rechargeService.js";

export async function createRechargeOfCard(req: Request, res: Response){
    const { company, card } = res.locals;
    const { cardId, amount } = req.body;

    if(!cardId || !amount) return res.status(400).send("Missing parameters");
    if(card.id !== cardId) return res.status(401).send("Card identifiers do not match");

    await rechargeService.createRechargeAmountCardId(card, amount, company);
    res.sendStatus(201);
}
