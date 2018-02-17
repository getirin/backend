const userAndJwtCreator = require('./common/userAndJwtCreator');
const errorCodes = require('../resources/error-codes');
const { userTypes } = require('../resources/model-constants');
const { loginGetSuccess, loginGetRequestPayload, nearbyPostRequest, nearbyPostResponse } = require('../schemas/controllers/carrier');
const User = require('../models/User');
const { mongoToObject, objectToMongo } = require('./common/convertLatLngToMongoArray');

function mapUserForOutput({ _id, lastSeen, name }){
  return { id: _id.toString(), lastSeen: mongoToObject(lastSeen), name };
}

module.exports = ({ log, jwt }) => {
  return {
    loginPost: {
      config: {
        validate: { payload: loginGetRequestPayload },
        response: { schema: loginGetSuccess },
        description: 'logins carriers, creates a new one if not exists',
      },
      handler: userAndJwtCreator(jwt, userTypes.CARRIER, errorCodes.carrierLoginFail)
    },
    nearbyPost: {
      config: {
        validate: { payload: nearbyPostRequest },
        response: { schema: nearbyPostResponse },
        description: 'lists the nearby carriers to the given point',
      },
      handler: async function({ payload: { location, maxDistance, minDistance }}){
        const users = await User.nearbyOfLocation(
          objectToMongo(location),
          maxDistance,
          minDistance,
          userTypes.CARRIER
        );

        return users.map(mapUserForOutput);
      }
    }
  };
};
