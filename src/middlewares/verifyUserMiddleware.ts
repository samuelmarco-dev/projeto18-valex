import { NextFunction, Request, Response } from "express";

import * as employeeRepository from "../repositories/employeeRepository.js"

export async function checkUserExists(req: Request, res: Response, next: NextFunction){
    const { employeeId }: { employeeId: number } = req.body;
    if(!employeeId){
        return res.status(422).send('Missing employeeId');
    }

    const employeeFound = await employeeRepository.findById(employeeId);
    if(!employeeFound) throw {
        type: "EmployeeNotFound", message: "Employee not found"
    }

    res.locals.employee = employeeFound;
    next();
}
