const Joi = require('joi');

const loginSuccess = Joi.object().keys({
  token: Joi.string().required(),
  success: Joi.valid(true).required(),
});

const putRequestSuccess = Joi.object().keys({
  success: Joi.valid(true).required(),
  id: Joi.string().required(),
  createdAt: Joi.date().timestamp(),
});

const loginRequest = Joi.object().keys({
  name: Joi.string().required(),
  password: Joi.string().required(),
}).required();

const geoPoint = Joi.object().keys({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

module.exports = {
  loginRequest,
  loginSuccess,
  putRequestSuccess,
  geoPoint
};
