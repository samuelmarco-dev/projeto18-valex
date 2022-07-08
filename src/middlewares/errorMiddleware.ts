import { NextFunction, Request, Response } from "express";
import chalk from 'chalk';

export async function handleError(err: any, req: Request, res: Response, next: NextFunction){
    console.log(chalk.red(err));
    if(err){
        if(err.type === 'EmployeeNotFound' || err.type === 'CompanyNotFound') return res.status(404).send(err.message);
    }

    res.sendStatus(500);
}
