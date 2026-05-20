import Joi from "@hapi/joi";

export default{
    createUse: Joi.object({
        user_user: Joi.string().required().min(10),
        user_password: Joi.string().required().min(7),
        userStatus_fk: Joi.number().required(),
        role_fk: Joi.number().required(),
    }),
    updateUser: Joi.object({
        user_user: Joi.string().min(10),
        user_password: Joi.string().min(7),
        userStatus_fk: Joi.number(),
        role_fk: Joi.number(),   
    }),
}