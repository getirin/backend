const JWT = require('jsonwebtoken');

/**
 * Validates the decoded jwt token, without any checks.
 * @param decoded value for the jwt token.
 * @param req the request object.
 * @param h the hapijs h object.
 * @return {*}
 */
async function validateTokenNoop(decoded, req, h){
  return { isValid: true };
}

function createJWTInstance({ key, algorithm }){
  const addOptions = (options) => ({ algorithm, ...options });

  return {
    sign: function(payload, options = {}){
      return JWT.sign(payload, key, addOptions(options));
    },
    verify: function(token, options = {}){
      return JWT.verify(token, key, addOptions(options));
    },
  };
}

module.exports = {
  validateTokenNoop,
  createJWTInstance
};
