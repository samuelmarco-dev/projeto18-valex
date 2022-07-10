import { NextFunction, Request, Response } from "express";

import * as businessRepository from "../repositories/businessRepository.js";
import { Business } from "../repositories/businessRepository.js";

export async function authBusinesses(req: Request, res: Response, next: NextFunction){
    const { businessesId }: { businessesId: number } = req.body;

    const businessFound: Business = await businessRepository.findById(businessesId);
    if(!businessFound) return res.status(404).send("Business not found");

    res.locals.business = businessFound;
    next();
}
