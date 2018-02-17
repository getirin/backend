const Joi = require('joi');
const { loginRequest, loginSuccess } = require('./common');
const CarrierJoiSchema = require('../models/User');
const { pickJoiObj } = require('../../utils');
const { geoPoint } = require('./common');
const CarrierJoiSchemaWithNameAndLocation = pickJoiObj(CarrierJoiSchema, ['name', 'lastSeen']);

module.exports = {
  loginGetRequestPayload: loginRequest,
  loginGetSuccess: loginSuccess,
  nearbyPostRequest: Joi.object().keys({
    location: geoPoint.required(),
    maxDistance: Joi.number().min(0).optional(),
    minDistance: Joi.number().min(0).optional(),
  }),
  nearbyPostResponse: Joi.array().items(
    CarrierJoiSchemaWithNameAndLocation.keys({ id: Joi.string() }).optional()
  ).optional()
};
