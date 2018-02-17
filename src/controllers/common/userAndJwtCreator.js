const User = require('../../models/User');
const Boom = require('boom');

/**
 * Creates a common user and jwt generator for customer/courrier login.
 * @param jwt the jwt instance to use while creating jwt tokens.
 * @param userType the user type to register the user with.
 * @param failCode the failCode to use when responding with login fail.
 * @return {Function}
 */
module.exports = (jwt, userType, failCode) => async function({ payload: { name, password } }, h){
  try {
    const user = await User.findOrCreate({name, password, userType});
    if(!await user.verifyPassword(password)) return Boom.unauthorized(failCode);
    const token = jwt.sign({id: user._id, name: user.name, userType});

    return h.response({success: true, token})
      .header('Authorization', token)
      .takeover();
  } catch (e){
    // happens if the user name exists with another type.
    if(e.code === 11000) return Boom.unauthorized(failCode);
  }
};
