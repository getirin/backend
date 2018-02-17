const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiAuthJWT2 = require('hapi-auth-jwt2');
const ErrorStandard = require('./plugins/error-standard');
const errorCodes = require('./resources/error-codes');
const { validateTokenNoop } = require('./auth');

/**
 * Registers swagger plugin with documentation interface.
 * @param server the server to register the plugin
 * @param host the host address swagger editor will use
 * @param port the port swagger editor will use
 * @return {Promise<void>}
 */
async function registerSwaggerPlugins(server, { host, port, schemes }){
  await server.register([
    Inert,
    Vision,
  ]);

  await server.register({
    plugin: HapiSwagger,
    options: {
      host: process.env.NODE_ENV == "production" ? `${host}` : `${host}:${port}`,
      schemes,
      securityDefinitions: {
        jwt: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      },
      security: [{ 'jwt': [] }]
    }
  });
}

/**
 * Registers the error standardization plugin
 * @param server the server to register the plugin
 * @return {Promise<void>}
 */
async function registerErrorStandardPlugin(server){
  await server.register({
    plugin: ErrorStandard,
    options: { errorCodes }
  });
}

/**
 * Register jwt auth plugin to hapijs
 * @param server the server to register the plugin.
 * @param key the secret key to use when signing and verifying jwt tokens
 * @param algorithm the algorithm to use for the jwt.
 * @param validate the function to use when validation jwt.
 * @return {Promise<void>}
 */
async function registerJWTPlugins(server, { key, algorithm }, validate = validateTokenNoop){
  await server.register(HapiAuthJWT2);
  await server.auth.strategy('jwt', 'jwt', { key, validate, verifyOptions: { algorithm, ignoreExpiration: true } });
}

/**
 * Registers plugins that will be used in production.
 * @param server the server to register the plugin
 * @param swagger the swagger configuration object.
 * @param jwt the jwt configuration object.
 * @param validateFunc validate func to be used for the jwt plugin
 * @return {Promise<void>}
 */
async function registerProductionPlugins(server, { swagger, auth: { jwt } }, { validateFunc } = {}){
  await registerErrorStandardPlugin(server);
  await registerSwaggerPlugins(server, swagger);
  await registerJWTPlugins(server, jwt, validateFunc);
}

module.exports = {
  registerErrorStandardPlugin,
  registerSwaggerPlugins,
  registerJWTPlugins,
  registerProductionPlugins,
};
