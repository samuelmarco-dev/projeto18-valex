import { NextFunction, Request, Response } from "express";

import * as companyRepository from "../repositories/companyRepository.js";
import { Company } from "../repositories/companyRepository.js";

export async function authKeyCompany(req: Request, res: Response, next: NextFunction) {
    const apiKey: string = req.header("x-api-key");
    if(!apiKey) return res.status(400).send("Missing API key");

    const companyFound: Company = await companyRepository.findByApiKey(apiKey);
    if(!companyFound || !companyFound.apiKey) throw {
        type: "CompanyNotFound", message: "Company not found"
    }

    res.locals.company = companyFound;
    next();
}
