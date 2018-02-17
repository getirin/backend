/**
 * This model will be used to match orders with couriers.
 * After adding a new order, we will run a query that asks for close markets and save the result in this collection.
 * The `close` here means that the market is in a fixed radius of the user .
 * Then the courier can query this collection by filtering the markets near to him, and a destination point within his radius.
 *
 * How a order-market-match ended up in this collection doesn't matter.
 * It can be after inserting orders in the http handler or completely outside of this service, in a scaled manner.
 * e.g.
 *  - Run a service that waits for new orders
 *  - On new orders, calculate near markets to the other's destination point. Using google apis or some custom algo.
 *  - Insert the result into this collection.
 * For ease of development we will just create a record for this collection after creating the order in the http handler.
 */
const mongoose = require('mongoose');

const orderMarketMatchSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  closeMarkets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Market' }],
  destination: { type: [Number], index: '2dsphere' },
}, { timestamps: true });

// Can be read from the config file etc.
const defaultMatcherOptions = {
  // max distance in meters.
  maxDistance: 1000
};

/**
 * Calculates the nearby markets for the given order, and creates a database entry.
 * This operation can be done outside of this script, and can also be optimized by doing the calculation outside of mongodb.
 * Third party apis may be used to **real** shortest path from the market to the order destination point.
 * @param order
 * @param Market
 * @param maxDistance
 * @return {Promise<mongoose.Schema.methods>}
 */
orderMarketMatchSchema.statics.createMarketMatchForOrder = async function(order, Market, { maxDistance } = defaultMatcherOptions){
  const markets = await Market.nearbyOfLocation(order.destination, maxDistance);

  return new this({
    order: order._id,
    user: order.user,
    destination: order.destination,
    closeMarkets: markets
  });
};

module.exports = mongoose.model('OrderMarketMatch', orderMarketMatchSchema);
