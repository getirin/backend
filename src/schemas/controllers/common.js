const Joi = require('joi');
const { pickJoiObj } = require('../../utils');
const User = require('../../schemas/models/User');

const userSchema = Joi.object().keys({
  id: Joi.string().guid(),
  name: Joi.string(),
  password: Joi.string().hex().length(32),
  createdAt: Joi.date().timestamp(),
  updatedAt: Joi.date().timestamp()
}).label('User Schema');

const requestSuccessfulSchema = Joi.object().keys({
  ok: Joi.valid(true)
}).label('Request Success');

const loginSuccess = Joi.object().keys({
  token: Joi.string().required(),
  success: Joi.valid(true).required(),
});

const loginRequest = pickJoiObj(User, ['name', 'password']);

module.exports = {
  userSchema,
  requestSuccessfulSchema,
  loginRequest,
  loginSuccess,
};
