const Joi = require('joi');
const { geoPoint } = require('../controllers/common');

module.exports = Joi.object().keys({
  name: Joi.string().min(3).required(),
  location: geoPoint.required(),
}).required();
