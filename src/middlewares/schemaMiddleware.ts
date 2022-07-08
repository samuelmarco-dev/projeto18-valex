import { NextFunction, Request, Response } from 'express';
import joi from 'joi';

export default function schemaValidation(schema: joi.ObjectSchema){
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.body, { abortEarly: false });
        const { error }: { error: joi.ValidationError} = validation;

        if(error){
            return res.status(422).send(error.details.map((detail: {message: string}) => detail.message));
        }
        next();
    }
}
