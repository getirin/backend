const Joi = require('joi');
const { pickJoiObj } = require('../../utils');
const User = require('../../schemas/models/User');

const loginSuccess = Joi.object().keys({
  token: Joi.string().required(),
  success: Joi.valid(true).required(),
});

const putRequestSuccess = Joi.object().keys({
  success: Joi.valid(true).required(),
  id: Joi.string().required(),
  createdAt: Joi.date().timestamp(),
});

const loginRequest = pickJoiObj(User, ['name', 'password']);

module.exports = {
  loginRequest,
  loginSuccess,
  putRequestSuccess
};
