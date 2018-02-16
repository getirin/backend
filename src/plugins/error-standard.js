const Joi = require('joi');

/**
 * Checks the given error and makes sure its caused by async throws.
 * @param boom
 */
function checkIfAsyncThrowError(boom){
  return boom.statusCode === 500 &&
    boom.error === 'Internal Server Error' &&
    boom.message === 'An internal server error occurred';
}

function createGenericErrorChecker(invalidMessageRegex = /[ A-Z]+/){
  return function checkIfGenericError({statusCode, message, error}){
    return statusCode &&
      statusCode.constructor === Number &&
      (!message || error === message || message.match(invalidMessageRegex));
  };
}

function checkIfInvalidJson(boom){
  return boom.statusCode === 400 && boom.message === 'Invalid request payload JSON format';
}

function checkIfInvalidPayload(boom){
  return boom.statusCode === 400 && boom.message === 'Invalid request payload input';
}

function fixBoomPayload(boom, message){
  boom.output.payload.message = message;
  return boom;
}

function fixBoomPayloadWithCode(boom, code, errorCodes){
  return fixBoomPayload(boom, errorCodes.http[code] || errorCodes.noCustomMessage || boom.message || boom.error);
}

const internal = {
  schema: Joi.object().keys({
    invalidMessageRegex: Joi.object().type(RegExp).optional(),
    errorCodes: Joi.object().keys({
      http: Joi.object().unknown().required(),
      noCustomMessage: Joi.string().required(),
      invalidRequestBody: Joi.string().required(),
      invalidPayloadJson: Joi.string().required(),
    }).unknown().required()
  }).optionalKeys('invalidMessageRegex')
};

/**
 * This plugin tries to standardize Boom errors, so we have consistent error structure where each errors has
 * `status`, `error` and `message` fields. This helps with internationalization.
 */
module.exports = {
  name: 'errorStandard',
  version: '0.0.1',

  register(server, options){
    Joi.assert(options, internal.schema);
    const { errorCodes, invalidMessageRegex } = options || {};

    const customErrorFixes = [
      { check: checkIfAsyncThrowError, fix: (res) => fixBoomPayloadWithCode(res, 500, errorCodes) },
      { check: checkIfInvalidPayload, fix: (res) => fixBoomPayload(res, errorCodes.invalidRequestBody) },
      { check: checkIfInvalidJson, fix: (res) => fixBoomPayload(res, errorCodes.invalidPayloadJson) },
      { check: createGenericErrorChecker(invalidMessageRegex), fix: (res, { statusCode }) => fixBoomPayloadWithCode(res, statusCode, errorCodes) },
    ];

    server.ext('onPreResponse', function(req, h){
      const res = req.response;
      if(!res.isBoom) return h.continue;
      const { payload } = res.output;
      const customError = customErrorFixes.find(({ check }) => check(payload));

      if(customError){
        customError.fix(res, payload);
      }

      return h.continue;
    });
  }
};
