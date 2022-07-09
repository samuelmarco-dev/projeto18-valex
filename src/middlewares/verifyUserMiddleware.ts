import { NextFunction, Request, Response } from "express";

import * as employeeRepository from "../repositories/employeeRepository.js";
import { Employee } from "../repositories/employeeRepository.js";

export async function checkUserExists(req: Request, res: Response, next: NextFunction){
    const { employeeId }: { employeeId: number } = req.body;
    if(!employeeId) return res.status(400).send('Missing employeeId');

    const employeeFound: Employee = await employeeRepository.findById(employeeId);
    if(!employeeFound) throw {
        type: "EmployeeNotFound", message: "Employee not found"
    }

    res.locals.employee = employeeFound;
    next();
}
