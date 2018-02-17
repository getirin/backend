const Joi = require('joi');

module.exports = Joi.object().keys({
  order: Joi.string().meta({ type: 'ObjectId', ref: 'Order' }).required(),
  user: Joi.string().meta({ type: 'ObjectId', ref: 'User' }).required(),
  closeMarkets: Joi.array().items(Joi.string().meta({ type: 'ObjectId', ref: 'Market' }).required()),
  destination: Joi.array().items(Joi.number().required()),
}).required();
