const Boom = require('boom');
const { loginGetRequestPayload, loginGetSuccess } = require('../schemas/controllers/user');
const { userTypes } = require('../resources/model-constants');
const { customerLoginFail } = require('../resources/error-codes');
const User = require('../models/User');

module.exports = ({ log, jwt }) => {
  return {
    loginPost: {
      config: {
        validate: { payload: loginGetRequestPayload },
        response: { schema: loginGetSuccess },
        description: 'The login endpoint for the user. Creates user if not exists.'
      },
      handler: async function({ payload: { name, password } }, h){
        const user = await User.findOrCreate({ name, password, userType: userTypes.CUSTOMER });
        if(!await user.verifyPassword(password)) throw Boom.unauthorized(customerLoginFail);
        const token = jwt.sign({ id: user._id, name: user.name, userType: userTypes.CUSTOMER });

        return h.response({ success: true, token })
          .header('Authorization', token)
          .takeover();
      }
    }
  };
};
