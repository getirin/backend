const { indexPutRequest, indexPutResponse, listPostResponse } = require('../schemas/controllers/order');
const mapInsertForPutOutput = require('./common/mapInsertForPutOutput');
const { mongoToObject, objectToMongo } = require('./common/convertLatLngToMongoArray');
const Order = require('../models/Order');

function mapOrderForOutput(payload){
  const { title, totalPrice, address, status, createdAt, updatedAt } = payload;
  return {
    title,
    totalPrice,
    address,
    status,
    createdAt,
    updatedAt,
    destination: mongoToObject(payload.destination),
    id: payload._id.toString(),
    items: payload.items.map(item => ({count: item.count, product: item.product.toString()})),
  };
}

module.exports = ({ log }) => {
  return {
    indexPut: {
      config: {
        validate: { payload: indexPutRequest },
        response: { schema: indexPutResponse },
        description: 'create a order record for the authenticated user in the database.',
        auth: 'jwt'
      },
      handler: async function({ auth, payload }){
        const { id: user } = auth.credentials;
        const result = await new Order({ ...payload, destination: objectToMongo(payload.destination), user }).save();

        return mapInsertForPutOutput(result);
      }
    },
    listPost: {
      config: {
        response: { schema: listPostResponse },
        description: 'lists the orders for the authenticated user.',
        auth: 'jwt'
      },
      handler: async function({ auth }){
        const { id: user } = auth.credentials;
        const result = await Order.listUserOrders(user);

        console.log(JSON.stringify(result.map(mapOrderForOutput)));
        return result.map(mapOrderForOutput);
      }
    }
  };
};
