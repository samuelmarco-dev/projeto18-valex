import joi from 'joi';

const regex: RegExp = /^[0-9]{4}$/;
const schemaPayment: joi.ObjectSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().length(4).pattern(regex).required(),
    businesses: joi.number().integer().required(),
    amount: joi.number().min(0.01).positive().required(),
});

export default schemaPayment;
