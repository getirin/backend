const Joi = require('joi');
const { carrierRequestStatuses } = require('../../resources/model-constants');

module.exports = Joi.object().keys({
  status: Joi.number().valid(...Object.values(carrierRequestStatuses)),
  date: Joi.date().timestamp(),
  meta: Joi.any().optional()
});
