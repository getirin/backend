const Joi = require('joi');
const ProductJoiSchema = require('../models/Product');
const { putRequestSuccess } = require('./common');
const ProductJoiSchemaWithId = ProductJoiSchema.keys({ id: Joi.string().required() }).optional();

module.exports = {
  indexPutRequest: ProductJoiSchema,
  indexPutResponse: putRequestSuccess,
  indexGetResponse: Joi.array().items(ProductJoiSchemaWithId).optional()
};
