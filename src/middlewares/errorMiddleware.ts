import { NextFunction, Request, Response } from "express";

export async function handleError(err: any, req: Request, res: Response, next: NextFunction){

    if(err){
        const verify = err.type === 'InvalidCode' || err.type === 'InvalidPassword' ||
        err.type === 'InvalidPasswordCard' || err.type === 'CardNotActive' ||
        err.type === 'CardNotActiveOrExpired' || err.type === 'BusinessTypeNotMatch' ||
        err.type === 'InsufficientBalance' || err.type === 'InvalidNumberCards' ||
        err.typw === 'NoCards' || err.type === 'InvalidCVVCard' || err.type === 'InvalidCard';

        if(verify) return res.status(401).send(err.message);
        if(err.type === 'EmployeeNotFound' || err.type === 'CompanyNotFound' || err.type === 'CardNotFound') return res.status(404).send(err.message);
        if(err.type === 'CardAlreadyExists') return res.status(409).send(err.message);
        if(err.type === 'CardNotCanBeBlocked' || err.type === 'CardNotCanBeUnlocked') return res.status(403).send(err.message);
    }

    res.sendStatus(500);
}
