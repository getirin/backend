const Joi = require('joi');

module.exports = ({ log }) => ({
  indexGet: {
    config: {
      validate: {},
      response: {
        schema: Joi.object().keys({ status: Joi.boolean(), time: Joi.date().timestamp() }).label('Healthz Response')
      },
      description: 'returns if the server is healthy or not',
    },
    handler: async function(req){
      log.info('Got request for healthz.');
      return { status: true, time: new Date().valueOf() };
    }
  },
});
