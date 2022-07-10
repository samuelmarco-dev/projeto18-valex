import joi from 'joi';

const schemaInformationCard: joi.ObjectSchema = joi.object({
    employeeId: joi.number().integer().required(),
    passwords: joi.array().min(1).max(5).items(joi.object({
        cardId: joi.number().integer().required(),
        password: joi.string().required(),
        cvv: joi.string().required(),
        type: joi.string().required()
    })).required()
});

export default schemaInformationCard;
