const Joi = require('joi');
const { setupServer, setupTestLogger } = require('../helper');
const config = require('../../src/config');
const log = setupTestLogger();

describe('healthz controller', () => {
  let server;

  beforeAll(async () => {
    server = await setupServer({ log }, { jwt: config.auth.jwt });
  });

  describe('GET /', () => {
    it('should response with a valid example', async () => {
      const { payload } = await server.inject('/healthz');
      const schema = Joi.object().keys({
        status: Joi.boolean().required(),
        time: Joi.date().timestamp(),
      }).required();

      Joi.assert(payload, schema, "Couldn't match the /healthz result with the expected schema.");
    });
  });
});
