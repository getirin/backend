/**
 * Helpers functions for tests.
 */
const Hapi = require('hapi');
const controllerCreator = require('../src/controllers/index');
const routeCreator = require('../src/routes/index');
const logCreator = require('../src/log');
const { registerJWTPlugins } = require('../src/configureServer');

async function setupServer(dependencies, { jwt: jwtConfig }){
  const controllers = controllerCreator(dependencies);
  const routes = routeCreator({ controllers });
  const server = Hapi.server();

  if(jwtConfig) await registerJWTPlugins(server, jwtConfig);
  await server.start();
  server.route(routes);
  return server;
}

function setupTestLogger(){
  return logCreator({ name: 'tests', level: 'debug' });
}

module.exports = {
  setupServer,
  setupTestLogger
};
