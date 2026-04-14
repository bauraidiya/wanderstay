const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    Listing : Joi.object({
        title:Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required().messages({
      "number.base": "Please enter a valid price",
      "number.min": "Price cannot be negative",
      "any.required": "Price is required"}),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null)
    }).required()
});