const userAndJwtCreator = require('./common/userAndJwtCreator');
const errorCodes = require('../resources/error-codes');
const { userTypes } = require('../resources/model-constants');
const { loginGetSuccess, loginGetRequestPayload } = require('../schemas/controllers/courrier');

module.exports = ({ log, jwt }) => {
  return {
    loginPost: {
      config: {
        validate: { payload: loginGetRequestPayload },
        response: { schema: loginGetSuccess },
        description: 'The login endpoint for the courriers. Creates a new courrier if not exists.'
      },
      handler: userAndJwtCreator(jwt, userTypes.COURIER, errorCodes.courrierLoginFail)
    }
  };
};
