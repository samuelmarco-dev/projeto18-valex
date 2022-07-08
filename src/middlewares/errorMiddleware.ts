import { NextFunction, Request, Response } from "express";
import chalk from 'chalk';

export async function handleError(err: any, req: Request, res: Response, next: NextFunction){
    console.log(chalk.red(err));

    res.sendStatus(500);
}
