const userAndJwtCreator = require('./common/userAndJwtCreator');
const errorCodes = require('../resources/error-codes');
const { userTypes } = require('../resources/model-constants');
const { loginGetSuccess, loginGetRequestPayload } = require('../schemas/controllers/carrier');

module.exports = ({ log, jwt }) => {
  return {
    loginPost: {
      config: {
        validate: { payload: loginGetRequestPayload },
        response: { schema: loginGetSuccess },
        description: 'The login endpoint for the carriers. Creates a new carrier if not exists.'
      },
      handler: userAndJwtCreator(jwt, userTypes.CARRIER, errorCodes.carrierLoginFail)
    }
  };
};
