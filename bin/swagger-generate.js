const outPath = process.argv[2];

if(!outPath || outPath.constructor !== String || outPath.match(/[‘“!#$%&+^<=>`]/)){
  console.log('Usage examples: ');
  console.log('\tnpm run swagger-generate -- <outPath>');
  console.log('\tnode bin/swagger-generate.js <outPath>');
  process.exit(-1);
}

const Hapi = require('hapi');
const fs = require('fs');
const { promisify } = require('util');
const writeFilePromise = promisify(fs.writeFile);

const { registerProductionPlugins } = require('../src/configureServer');
const config = require('../src/config');
const log = require('../src/log')({ name: 'mock-api', level: 'info' });
const controllers = require('../src/controllers')({ log });
const routes = require('../src/routes')({
  controllers,
  routeConfigOverrides: { tags: ['api'] }
});

async function requestSwaggerJson(server, path = '/swagger.json'){
  const response = await server.inject(path);

  return response;
}

(async function(){
  const server = Hapi.server();
  await registerProductionPlugins(server, config);
  await server.route(routes);
  await server.start();

  const { rawPayload } = await requestSwaggerJson(server);
  await writeFilePromise(outPath, rawPayload);
  await server.stop();
})()
  .then(() => {
    log.info({ path: outPath }, `Generated swagger.json without any problems.`);
  })
  .catch((err) => {
    log.error(`There was an error while creating the swaggger.json`);
    log.error(err);
  });
