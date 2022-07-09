import { Request, Response } from "express";

export async function createPaymentOfCard(req: Request, res: Response){
    const { company, card } = res.locals;
    const { cardId, amount } = req.body;

    if(!cardId || !amount) return res.status(400).send("Missing parameters");
    if(card.id !== cardId) return res.sendStatus(401);

    res.sendStatus(200);
}
