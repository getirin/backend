const Joi = require('joi');
const { putRequestSuccess } = require('./common');
const OrderJoiSchema = require('../models/Order');
const { pickJoiObj } = require('../../utils');
const OrderJoiSchemaWithoutUser = pickJoiObj(OrderJoiSchema, ['title', 'items', 'address', 'destination', 'status', 'totalPrice']).required();

module.exports = {
  indexPutRequest: OrderJoiSchemaWithoutUser,
  indexPutResponse: putRequestSuccess,
  listPostRequest: {},
  listPostResponse: Joi.array().items(
    OrderJoiSchemaWithoutUser.keys({
      id: Joi.string().required(),
      createdAt: Joi.date().timestamp(),
      updatedAt: Joi.date().timestamp()
    }).optional()
  ).optional()
};
