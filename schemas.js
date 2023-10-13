const Joi = require('joi')    //handles error validations for individual schemas//


module.exports.hangoutSchema = Joi.object({
    hangout: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        daysOpen: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})