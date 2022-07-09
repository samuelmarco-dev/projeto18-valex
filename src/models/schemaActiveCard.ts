import joi from 'joi';

const schemaActiveCard = joi.object({
    cardId: joi.number().integer().required(),
    cvv: joi.string().length(3).required(),
    password: joi.string().length(4).required()
});

export default schemaActiveCard;