const Joi = require('joi');

module.exports = Joi.object().keys({
  name: Joi.string().min(3).required(),
  location: Joi.array().items(Joi.number()).required()
}).required();
