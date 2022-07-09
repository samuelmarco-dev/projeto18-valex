import joi from 'joi';

const schemaBlockUnblockCard: joi.ObjectSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().length(4).required()
});

export default schemaBlockUnblockCard;
