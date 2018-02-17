const { loginGetRequestPayload, loginGetSuccess } = require('../schemas/controllers/user');
const { userTypes } = require('../resources/model-constants');
const { customerLoginFail } = require('../resources/error-codes');
// const User = require('../models/User');
const userAndJwtCreator = require('./common/userAndJwtCreator');

module.exports = ({ log, jwt }) => {
  return {
    loginPost: {
      config: {
        validate: { payload: loginGetRequestPayload },
        response: { schema: loginGetSuccess },
        description: 'The login endpoint for the user. Creates user if not exists.'
      },
      handler: userAndJwtCreator(jwt, userTypes.CUSTOMER, customerLoginFail)
    }
  };
};
