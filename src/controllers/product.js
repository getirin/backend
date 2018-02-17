const Boom = require('boom');
const { indexPutRequest, indexPutResponse, indexGetResponse } = require('../schemas/controllers/product');
const Product = require('../models/Product');
const mapInsertForPutOutput = require('./common/mapInsertForPutOutput');
const errorCodes = require('../resources/error-codes');

function mapProductForOutput({ name, price, _id }){
  return { name, price, id: _id.toString() };
}

module.exports = ({ log }) => {
  return {
    indexPut: {
      config: {
        validate: { payload: indexPutRequest },
        response: { schema: indexPutResponse },
        description: 'creates and puts product record'
      },
      handler: async function({ payload: { name, price } }){
        return new Product({ name, price }).save()
          .then(mapInsertForPutOutput)
          .catch((e) => e.code === 11000 ? Boom.conflict(errorCodes.couldNotCreateProduct) : Boom.internal());
      }
    },
    indexGet: {
      config: {
        response: { schema: indexGetResponse },
        description: 'lists all products'
      },
      handler: async function(){
        const products = await Product.find({ });

        return products.map(mapProductForOutput);
      }
    },
  };
};
