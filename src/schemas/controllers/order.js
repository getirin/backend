const Joi = require('joi');
const { putRequestSuccess, cancelSuccessResponse, geoPoint } = require('./common');
const OrderJoiSchema = require('../models/Order');
const { pickJoiObj } = require('../../utils');
const OrderJoiSchemaWithoutUser = pickJoiObj(OrderJoiSchema, ['title', 'items', 'address', 'destination', 'status']).required();

const orderListingSchema = Joi.array().items(
  OrderJoiSchemaWithoutUser.keys({
    id: Joi.string().required(),
    totalPrice: Joi.number().required(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.date().timestamp(),
    carrier: Joi.object().keys({ name: Joi.string().required() }).optional()
  }).optional()
).optional();

module.exports = {
  indexPutRequest: OrderJoiSchemaWithoutUser,
  indexPutResponse: putRequestSuccess,
  listGetRequest: {},
  listGetResponse: orderListingSchema,
  idDeleteParams: { id: Joi.string().required() },
  idDeleteResponse: cancelSuccessResponse,
  findMatchPostRequest: Joi.object().keys({
    location: geoPoint.required(),
    maxDistance: Joi.number().required(),
  }),
  findMatchPostResponse: orderListingSchema
};
