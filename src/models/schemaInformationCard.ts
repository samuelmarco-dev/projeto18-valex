import joi from 'joi';

const regex: RegExp = /^[0-9]{4}$/;
const schemaInformationCard: joi.ObjectSchema = joi.object({
    employeeId: joi.number().integer().required(),
    passwords: joi.array().min(1).max(5).items(joi.object({
        cardId: joi.number().integer().required(),
        password: joi.string().length(4).pattern(regex).required(),
        cvv: joi.string().length(3).required(),
        type: joi.equal(
            "groceries", "restaurant", "transport",
            "education", "health"
        ).required()
    })).required()
});

export default schemaInformationCard;
