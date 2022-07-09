import { NextFunction, Request, Response } from "express";
import chalk from 'chalk';

export async function handleError(err: any, req: Request, res: Response, next: NextFunction){
    console.log(chalk.red(err));
    if(err){
        if(err.type === 'EmployeeNotFound' || err.type === 'CompanyNotFound') return res.status(404).send(err.message);
        if(err.type === 'CardAlreadyExists') return res.status(409).send(err.message);
        if(err.type === 'InvalidCode') return res.status(400).send(err.message);
    }

    res.sendStatus(500);
}
