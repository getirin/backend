const Joi = require('joi');

module.exports = Joi.object().keys({
  name: Joi.string().min(1).required(),
  price: Joi.number().required(),
});
