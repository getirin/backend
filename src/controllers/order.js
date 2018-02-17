const { indexPutRequest, indexPutResponse, listPostResponse } = require('../schemas/controllers/order');
const mapInsertForPutOutput = require('./common/mapInsertForPutOutput');
const { mongoToObject, objectToMongo } = require('./common/convertLatLngToMongoArray');
const Order = require('../models/Order');
const Market = require('../models/Market');
const OrderMarketMatch = require('../models/OrderMarketMatch');

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
        const order = await new Order({ ...payload, destination: objectToMongo(payload.destination), user }).save();
        log.info({ insertId: order._id, destination: payload.destination }, 'Inserted order without any problems, trying to calculate the nearest markets.');
        // TODO: move this out of this service.
        const orderMarketMatch = await OrderMarketMatch.createMarketMatchForOrder(order, Market);
        const ommSaveResult = await orderMarketMatch.save();

        log.info(
          { insertId: ommSaveResult._id, closeMarkets: ommSaveResult.closeMarkets.map(m => m && m.name) },
          'Created order market match for our new order.'
        );

        return mapInsertForPutOutput(order);
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

        return result.map(mapOrderForOutput);
      }
    }
  };
};
