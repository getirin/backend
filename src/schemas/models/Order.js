const Joi = require('joi');
const { orderStatuses } = require('../../resources/model-constants');
const { geoPoint } = require('../controllers/common');

module.exports = Joi.object().keys({
  title: Joi.string().required(),
  items: Joi.array().items(
    Joi.object().keys({
      product: Joi.string().meta({ type: 'ObjectId', ref: 'Product' }),
      count: Joi.number().min(1)
    })
  ).required(),
  user: Joi.string().meta({ type: 'ObjectId', ref: 'User' }).required(),
  address: Joi.object().unknown().optional(),
  destination: geoPoint.required(),
  status: Joi.number().valid(...Object.values(orderStatuses)).required().default(orderStatuses.WAITING),
  totalPrice: Joi.number().min(0).required(),
}).required();
