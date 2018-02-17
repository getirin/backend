const Joi = require('joi');
const { userTypes } = require('../../resources/model-constants');
const { geoPoint } = require('../controllers/common');

module.exports = Joi.object().keys({
  name: Joi.string().min(3).required(),
  password: Joi.string().min(1).required(),
  userType: Joi.number().valid(...Object.values(userTypes)).required(),
  lastSeen: geoPoint.optional(),
}).required();
