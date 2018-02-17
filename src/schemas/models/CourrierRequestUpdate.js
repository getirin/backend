const Joi = require('joi');
const { courrierRequestStatuses } = require('../../resources/model-constants');

module.exports = Joi.object().keys({
  status: Joi.number().valid(...Object.values(courrierRequestStatuses)),
  date: Joi.date().timestamp(),
  meta: Joi.any().optional()
});
