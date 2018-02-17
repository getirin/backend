const { loginGetRequestPayload, loginGetSuccess, lastSeenPostRequest, lastSeenPostResponse } = require('../schemas/controllers/user');
const { userTypes } = require('../resources/model-constants');
const { customerLoginFail } = require('../resources/error-codes');
const User = require('../models/User');
const userAndJwtCreator = require('./common/userAndJwtCreator');
const { objectToMongo } = require('./common/convertLatLngToMongoArray');

module.exports = ({ log, jwt }) => {
  return {
    loginPost: {
      config: {
        validate: { payload: loginGetRequestPayload },
        response: { schema: loginGetSuccess },
        description: 'logins the customer, creates a new one if not exists',
      },
      handler: userAndJwtCreator(jwt, userTypes.CUSTOMER, customerLoginFail)
    },
    lastSeenPost: {
      config: {
        validate: { payload: lastSeenPostRequest },
        response: { schema: lastSeenPostResponse },
        description: 'updates the last seen location of the authenticated user',
        auth: 'jwt',
      },
      handler: async function({ auth, payload: { location } }){
        const { id } = auth.credentials;
        const result = await User.findByIdAndUpdate(id, { $set: { lastSeen: objectToMongo(location) } });

        return { success: true, id, createdAt: result.createdAt };
      }
    }
  };
};
