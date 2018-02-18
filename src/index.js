const Hapi = require('hapi');
const config = require('./config');
const log = require('./log')(config.logging);
const { configureEvents, configureMock } = require('./configureEvents');
const { connectDatabase } = require('./configureDatabase');
const { registerProductionPlugins } = require('./configureServer');
const { createJWTInstance } = require('./auth');

(async function(){
  const jwt = createJWTInstance(config.auth.jwt);
  const events = process.env.NODE_ENV === 'production' ? await configureMock() : await configureEvents(config.events);
  const dependencies = { log, jwt, events };
  const controllers = require('./controllers')(dependencies);
  const routes = require('./routes')({ controllers, routeConfigOverrides: { tags: ['api'] } });
  const server = Hapi.server({ port: config.port, routes: { cors: config.cors } });

  await connectDatabase(config.database);
  await registerProductionPlugins(server, config);
  await server.route(routes);
  await server.start();
})()
  .then(() => {
    const { host, port } = config;
    log.info({ host, port }, 'Started listening');
  })
  .catch((err) => {
    log.error(`There was an error while setting up the server.`);
    log.error(err);
    process.exit(-1);
  });
