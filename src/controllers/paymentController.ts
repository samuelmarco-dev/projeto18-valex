import { Request, Response } from "express";

import paymentService from "../services/paymentService.js";

export async function createPaymentCardId(req: Request, res: Response){
    interface BodyPayment {
        cardId: number;
        password: string;
        businessesId: number;
        amount: number;
    }

    const { card, business } = res.locals;
    const { cardId, businessesId, amount, password }: BodyPayment = req.body;

    if(!cardId || !businessesId || !amount || !password) return res.status(400).send("Missing data");
    if(card.id !== cardId) return res.status(401).send("Card identifiers do not match");
    if(business.id !== businessesId) return res.status(401).send("Business identifiers do not match");

    await paymentService.createPayment(card, business, amount, password);
    res.sendStatus(201);
}
