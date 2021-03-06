import joi from 'joi';

const regex: RegExp = /^[0-9]{4}$/;
const schemaActiveCard: joi.ObjectSchema = joi.object({
    cardId: joi.number().integer().required(),
    cvv: joi.string().length(3).required(),
    password: joi.string().length(4).pattern(regex).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required()
});

export default schemaActiveCard;
