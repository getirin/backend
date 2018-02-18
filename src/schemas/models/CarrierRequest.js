const Joi = require('joi');
const CarrierRequestUpdate = require('./CarrierRequestUpdate');
const { carrierRequestStatuses } = require('../../resources/model-constants');

module.exports = Joi.object().keys({
  carrier: Joi.string().meta({ type: 'ObjectId', ref: 'User' }).required(),
  user: Joi.string().meta({ type: 'ObjectId', ref: 'User' }).required(),
  order: Joi.string().meta({ type: 'ObjectId', ref: 'Order' }).required(),
  status: Joi.number().valid(...Object.values(carrierRequestStatuses)),
  updates: Joi.array().items(CarrierRequestUpdate).optional()
}).required();
