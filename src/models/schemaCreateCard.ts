import joi from 'joi';

const schemaCreateCard: joi.ObjectSchema = joi.object({
    employeeId: joi.number().integer().required(),
    typeCard: joi.equal(
        "groceries", "restaurant", "transport",
        "education", "health"
    ).required()
});

export default schemaCreateCard;
