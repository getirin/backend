const Market = require('../models/Market');
const { indexPutResponse, indexPutRequest, nearbyPostRequest, nearbyPostResponse } = require('../schemas/controllers/market');
const mapInsertForPutOutput = require('./common/mapInsertForPutOutput');
const { objectToMongo, mongoToObject } = require('./common/convertLatLngToMongoArray');

function mapMarketForOutput({ _id, location, name }){
  return { id: _id.toString(), location: mongoToObject(location), name };
}

module.exports = ({ log }) => {
  return {
    indexPut: {
      config: {
        validate: { payload: indexPutRequest },
        response: { schema: indexPutResponse },
        description: 'creates and put market record'
      },
      handler: async function({ payload: { name, location } }){
        const result = await new Market({ name, location: objectToMongo(location) }).save();

        return mapInsertForPutOutput(result);
      }
    },
    nearbyPost: {
      config: {
        validate: { payload: nearbyPostRequest },
        response: { schema: nearbyPostResponse },
        description: 'lists the nearby markets to the given point.'
      },
      handler: async function({ payload: { location, maxDistance, minDistance } }){
        const result = await Market.nearbyOfLocation(objectToMongo(location), maxDistance, minDistance);

        return result.map(mapMarketForOutput);
      }
    }
  };
};
