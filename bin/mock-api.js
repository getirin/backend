const Hapi = require('hapi');
const Boom = require('boom');
const Felicity = require('felicity');

const { registerProductionPlugins } = require('../src/configureServer');
const { deepGet, mergeRoutes } = require('../src/utils');
const config = require('../src/config');
const log = require('../src/log')({ ...config.logging, name: 'mock-api' });
const controllers = require('../src/controllers')({ log });
const modifiedOriginalRoutes = require('../src/routes')({
  controllers,
  routeDefinitionOverrides: { handler: mockHandler },
  routeConfigOverrides: { tags: ['api'] }
});
const mockRoutes = require('../__mocks__/routes')({
  routeConfigOverrides: { tags: ['api'] }
});
const server = Hapi.server({ port: config.port });

async function mockHandler(request){
  const schema = deepGet(request, 'route.settings.response.schema');
  const { method, path } = request;

  if(!schema){
    log.info({ method, path }, 'No response schema for this endpoint.');
    return Boom.notImplemented(`Don't have a response schema for ${request.method} ${request.path}`);
  }

  log.info({ method, path }, `Generating mock response.`);
  return Felicity.example(request.route.settings.response.schema);
}

(async function(){
  const routes = mergeRoutes(modifiedOriginalRoutes, mockRoutes);

  await registerProductionPlugins(server, config);
  await server.route(routes);
  await server.start();
})()
  .then(() => {
    const { host, port } = config;
    log.info({ host, port }, 'Started listening');
  })
  .catch((err) => {
    log.error(`There was an error while setting up the mock-api.`);
    log.error(err);
  });
