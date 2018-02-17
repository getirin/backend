const Joi = require('joi');
const MarketJoiSchema = require('../models/Market');
const { putRequestSuccess, geoPoint } = require('./common');
const MarketJoiSchemaWithId = MarketJoiSchema.keys({
  id: Joi.string().required(),
}).optional();

module.exports = {
  indexPutRequest: MarketJoiSchema,
  indexPutResponse: putRequestSuccess,
  nearbyPostRequest: Joi.object().keys({
    location: geoPoint.required(),
    maxDistance: Joi.number().min(0).optional(),
    minDistance: Joi.number().min(0).optional(),
  }),
  nearbyPostResponse: Joi.array().items(
    MarketJoiSchemaWithId.optional()
  ).optional()
};
