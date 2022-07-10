import joi from 'joi';

const schemaPayment: joi.ObjectSchema = joi.object({
    cardId: joi.number().integer().required(),
    amount: joi.number().min(0.01).positive().required()
})

export default schemaPayment;
