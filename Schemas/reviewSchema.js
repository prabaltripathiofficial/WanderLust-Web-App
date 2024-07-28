const Joi = require('joi');

const newReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
    comment: Joi.string().max(150).required()
}).required()
});

module.exports  = newReviewSchema;