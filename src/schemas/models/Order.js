const Joi = require('joi');
const { orderStatuses } = require('../../resources/model-constants');

module.exports = Joi.object().keys({
  title: Joi.string().required(),
  items: Joi.array().items(
    Joi.object().keys({
      product: Joi.string().meta({ type: 'ObjectId', ref: 'Product' }),
      count: Joi.number()
    })
  ).required(),
  user: Joi.string().meta({ type: 'ObjectId', ref: 'User' }).required(),
  destination: Joi.array().items(Joi.number()).required(),
  status: Joi.number().valid(...Object.values(orderStatuses)).required()
}).required();
