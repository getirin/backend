const Boom = require('boom');
const {
  indexPutRequest, indexPutResponse, listGetResponse,
  idDeleteParams, idDeleteResponse, findMatchPostRequest, findMatchPostResponse
} = require('../schemas/controllers/order');
const errorCodes = require('../resources/error-codes');
const { userTypes, orderStatuses, carrierRequestStatuses } = require('../resources/model-constants');
const mapInsertForPutOutput = require('./common/mapInsertForPutOutput');
const { mongoToObject, objectToMongo } = require('./common/convertLatLngToMongoArray');
const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderMarketMatch = require('../models/OrderMarketMatch');
const CarrierRequest = require('../models/CarrierRequest');

function mapOrderForOutput(payload){
  const { title, totalPrice, address, status, createdAt, carrier, updatedAt } = payload;
  return {
    title,
    totalPrice,
    address,
    status,
    createdAt,
    updatedAt,
    carrier,
    destination: mongoToObject(payload.destination),
    id: payload._id.toString(),
    items: payload.items.map(item => ({count: item.count, product: item.product.toString()})),
  };
}

module.exports = ({ log, events }) => {
  return {
    indexPut: {
      config: {
        validate: { payload: indexPutRequest },
        response: { schema: indexPutResponse },
        description: 'create an order record for the authenticated user in the database',
        auth: 'jwt'
      },
      handler: async function({ auth, payload }){
        const { id: user, userType } = auth.credentials;
        if(userType !== userTypes.CUSTOMER) return Boom.unauthorized(errorCodes.onlyCustomersCanPostOrders);
        const totalPrice = await Product.calculateTotalPriceOfProducts(payload.items.map(item => item.product));
        const order = await new Order({ ...payload, totalPrice, destination: objectToMongo(payload.destination), user }).save();
        log.info({ insertId: order._id, destination: payload.destination }, 'Inserted order without any problems, trying to calculate the nearest markets.');
        // TODO: move this out of this service.
        const orderMarketMatch = await OrderMarketMatch.createMarketMatchForOrder(order);
        const ommSaveResult = await orderMarketMatch.save();

        log.info(
          { insertId: ommSaveResult._id, closeMarkets: ommSaveResult.closeMarkets.map(m => m && m.name) },
          'Created order market match for our new order'
        );

        events.orderCreated(order.id, user);
        return mapInsertForPutOutput(order);
      }
    },
    listGet: {
      config: {
        response: { schema: listGetResponse },
        description: 'lists the orders for the authenticated user',
        auth: 'jwt'
      },
      handler: async function({ auth }){
        const { id: user } = auth.credentials;
        const result = await Order.listUserOrders(user);

        return result.map(mapOrderForOutput);
      }
    },
    idDelete: {
      config: {
        validate: { params: idDeleteParams },
        response: { schema: idDeleteResponse },
        description: 'cancels the order',
        auth: 'jwt',
      },
      handler: async function({ auth: { credentials: { id: userID, userType } }, params: { id: orderID } }){
        if(userType !== userTypes.CUSTOMER) return Boom.unauthorized(errorCodes.onlyCustomersCanCancelOrders);
        const order = await Order.findById(orderID).catch(() => Promise.resolve());
        if(!order || order.user.toString() !== userID) return Boom.notFound();
        if(order.status === orderStatuses.FINISHED) return Boom.badRequest(errorCodes.canNotCancelFinishedOrders);
        if(order.status === orderStatuses.CANCELED_BY_USER) return Boom.badRequest(errorCodes.orderAlreadyCancelled);

        // If the order is already obtained, we need to cascade the status to carrier
        if(order.status === orderStatuses.OBTAINED){
          const carrierRequestQuery = {
            order: order.id,
            status: { $in: [ carrierRequestStatuses.WAITING, carrierRequestStatuses.OBTAINED ] }
          };

          // find carriers that got effected by this.
          const requests = await CarrierRequest.find(carrierRequestQuery).select('carrier');
          const carriers = requests.map(request => request.carrier);

          await CarrierRequest.update(
            carrierRequestQuery,
            { $set: { status: carrierRequestStatuses.CANCELED_BY_USER } },
          );

          // TODO: emit event order canceled with order id end effected carriers
          log.info({ affectedCount: carriers.length, order: order._id }, 'Carrier requests removed.');
        }

        order.status = orderStatuses.CANCELED_BY_USER;
        await order.save();

        // TODO: emit event cancelled?
        log.info({ order: order._id }, 'Order cancelled without any problems.');
        return { success: true };
      }
    },
    findMatchPost: {
      config: {
        validate: { payload: findMatchPostRequest },
        response: { schema: findMatchPostResponse },
        description: 'finds orders which customer and markets are in the given radius',
        auth: 'jwt',
      },
      handler: async function({ auth: { credentials: { userType } }, payload: { location, maxDistance } }){
        if(userType !== userTypes.CARRIER) return Boom.badRequest(errorCodes.onlyCarrierCanFindMatches);
        const mongoLocation = objectToMongo(location);
        log.info({ location, maxDistance }, 'Querying orders in radius.');
        const orders = await OrderMarketMatch.findMatchesWithRadius(mongoLocation, maxDistance);

        log.info({ location, maxDistance, resultSize: orders.length }, 'Returning radius match results.');
        return orders.map(mapOrderForOutput);
      }
    }
  };
};
