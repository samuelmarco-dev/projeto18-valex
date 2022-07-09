import joi from 'joi';

const regex: RegExp = /^[0-9]{4}$/;
const schemaBlockUnblockCard: joi.ObjectSchema = joi.object({
    cardId: joi.number().integer().required(),
    password: joi.string().length(4).pattern(regex).required()
});

export default schemaBlockUnblockCard;
