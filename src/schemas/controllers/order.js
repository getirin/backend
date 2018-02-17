const Joi = require('joi');
const { putRequestSuccess } = require('./common');
const OrderJoiSchema = require('../models/Order');
const { pickJoiObj } = require('../../utils');
const OrderJoiSchemaWithoutUser = pickJoiObj(OrderJoiSchema, ['title', 'items', 'address', 'destination', 'status']).required();

module.exports = {
  indexPutRequest: OrderJoiSchemaWithoutUser,
  indexPutResponse: putRequestSuccess,
  listPostRequest: {},
  listPostResponse: Joi.array().items(
    OrderJoiSchemaWithoutUser.keys({
      id: Joi.string().required(),
      totalPrice: Joi.number().required(),
      createdAt: Joi.date().timestamp(),
      updatedAt: Joi.date().timestamp()
    }).optional()
  ).optional()
};
