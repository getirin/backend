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
const Market = require('./Market');
const { orderStatuses } = require('../resources/model-constants');
const { application: { orderMatch: { closeMarketMaxDistance: maxDistance, sorting } } } = require('../config');

const orderMarketMatchSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  closeMarkets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Market' }],
  destination: { type: [Number], index: '2dsphere' },
  totalPrice: { type: Number }
}, { timestamps: true });

// Can be read from the config file etc.
const defaultMatcherOptions = {
  // max distance in meters.
  maxDistance
};

/**
 * Calculates the nearby markets for the given order, and creates a database entry.
 * This operation can be done outside of this script, and can also be optimized by doing the calculation outside of mongodb.
 * Third party apis may be used to **real** shortest path from the market to the order destination point.
 * @param order
 * @param maxDistance the maximum distance to look for in meters.
 * @return {Promise<mongoose.Schema.methods>}
 */
orderMarketMatchSchema.statics.createMarketMatchForOrder = async function(order, { maxDistance } = defaultMatcherOptions){
  const markets = await Market.nearbyOfLocation(order.destination, maxDistance);

  return new this({
    order: order._id,
    user: order.user,
    destination: order.destination,
    closeMarkets: markets,
    totalPrice: order.totalPrice
  });
};

function createScoreCalculationQueryGenerator(factors, groups){
  //
  function multiplyWithFactor(obj, factor){
    return { $multiply: [ obj, factor ] };
  }

  function divideConstantQueryGenerator(field, divideValue){
    return { $divide: [ `$${field}`, divideValue ]  };
  }

  function branchQueryGenerator(field, group){
    // If there are no factors, we can just return a constant.
    if(!group.factors || group.factors.length === 0) return group.default || 0;
    // Calculate the divider for the whole grup.
    const calculateGroupDivideConstant =
      // sum of the all factors + the default
      group.factors.map(f => f.factor).reduce((acc, v) => acc + v, group.default || 0);

    /**
     * Given a matcher in our config, converts it to mongo query
     * @return {*}
     */
    function convertMatcher(field, key, value){
      if(!key || !['$gt', '$gte', '$lt', '$lte'].includes(key)) return null;
      return { [`${key}`]: [ `$${field}`, value ] };
    }

    return {
      $switch: {
        // For each factors in the array, convert them to a switch case branch.
        branches: group.factors.map(({ matchers, factor }) => ({
          // do the conversion by looking at the keys of the matchers value of each group.
          case: { $and: Object.keys(matchers).map((key) => convertMatcher(field, key, matchers[key])).filter(x => x) },
          then: factor / calculateGroupDivideConstant
        })),
        default: (group.default || 0) / calculateGroupDivideConstant
      }
    };
  }

  function callAlgorithmFunction(name, cfg){
    if(!factors[name]) return null;
    const { type, field } = cfg;
    const factor = factors[name];

    if(type === 'divideConstant') return multiplyWithFactor(divideConstantQueryGenerator(field, cfg.constant), factor);
    else if(type === 'branch') return multiplyWithFactor(branchQueryGenerator(field, groups[name]), factor);
    return null;
  }

  return function weightCalculationQueryGenerator(configuration){
    return {
      $add:
        Object.keys(configuration)
          .map((key) => callAlgorithmFunction(key, configuration[key]))
          .filter(x => x)
    };
  };
}
const scoreCalculationQueryGenerator = createScoreCalculationQueryGenerator(sorting.factors, sorting.groups);

/**
 * Given a radius finds orders that can be satisfied without leaving this radius.
 * e.g. you can go the to Market(supplier), fulfill the order, and deliver it to the order destination without
 * leaving your set radius.
 * The returned records are sorted by a configurable algorithm where you can associate different weights to 4 variables
 *  - distance of the person from your location represented in %
 *  - count of intersection between markets in your range and order's range in %
 *  - price of the order in TL
 *  - amount of seconds passed since order creation
 * @param location the center point of the radius.
 * @param maxDistance the radius of the search in meters.
 * @param order the sorting order as int, default is read from config.
 * @return {Promise<Aggregate>}
 */
orderMarketMatchSchema.statics.findMatchesWithRadius = async function(location, maxDistance, order = sorting.order){
  const locationCloseMarkets = await Market.nearbyOfLocation(location, maxDistance);
  // Define how to handle sorting fields, if they are convertible to percentages
  // just divide them with the given constant, otherwise we need to use branching to group the values into some
  // factors. For example distance and closeMarketCount are convertible to percentages so we just do so.
  // but with time and prices we need custom defined groups.
  const configuration = {
    distance: { field: 'distance', type: 'divideConstant', constant: maxDistance },
    markets: { field: 'marketIntersection', type: 'divideConstant', constant: locationCloseMarkets.length },
    price: { field: 'totalPrice', type: 'branch' },
    time: { field: 'timePassedMs', type: 'branch' }
  };

  const results = await this.aggregate([
    // Limit to the order destinations within the given radius
    { $geoNear: { near: location, spherical: true, distanceField: 'distance', maxDistance } },
    {
      $project: {
        // Create a field that holds how many of the user's close markets collide with orders
        marketIntersection: { $size: { $setIntersection: ['$closeMarkets', locationCloseMarkets.map(m => m._id)] } },
        // Create a field that holds how many milliseconds it passed since the order was created.
        timePassedMs: { $subtract: [ new Date(), '$createdAt' ] },
        order: 1,
      },
    },
    { $match: { marketIntersection: { $gt: 0 } } },
    // The the orders from the foreign table.
    { $lookup: { from: 'orders', localField: 'order', foreignField: '_id', as: 'order' } },
    // Match the status of the order.
    { $match: { 'order.0.status': orderStatuses.WAITING } },
    // Calculate the score for the match.
    {
      $project: {
        order: 1,
        marketIntersection: 1,
        distance: 1,
        totalPrice: 1,
        timePassedMs: 1,
        // Dynamically generating a mongo query for calculating the score
        score: scoreCalculationQueryGenerator(configuration)
      },
    },
    { $sort: { score: order } }
  ]);

  return results.map((item) => item.order[0]);
};

module.exports = mongoose.model('OrderMarketMatch', orderMarketMatchSchema);
