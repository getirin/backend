const Joi = require('joi');
const CourrierRequestUpdate = require('./CourrierRequestUpdate');
const { courrierRequestStatuses } = require('../../resources/model-constants');

module.exports = Joi.object().keys({
  courrier: Joi.string().meta({ type: 'ObjectId', ref: 'User' }).required(),
  order: Joi.string().meta({ type: 'ObjectId', ref: 'Order' }).required(),
  status: Joi.number().valid(...Object.values(courrierRequestStatuses)),
  updates: Joi.array().items(CourrierRequestUpdate).optional()
}).required();
