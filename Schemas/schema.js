const Joi = require('joi');

const newListingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().max(255).required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required()
});

module.exports = newListingSchema;




