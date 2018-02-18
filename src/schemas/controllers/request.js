const Joi = require('joi');
const { putRequestSuccess } = require('../controllers/common');

module.exports = {
  sendPutResponse: putRequestSuccess,
  params: { id: Joi.string().required() },
  requestSuccess: { success: Joi.valid(true).required() }
};
