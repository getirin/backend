const { createRouteGenerator } = require('../utils');

module.exports = ({ controllers, routeDefinitionOverrides = {}, routeConfigOverrides = {} }) => {
  const { healthz } = controllers;
  const createRouteForController = createRouteGenerator(routeDefinitionOverrides, routeConfigOverrides);

  return [
    createRouteForController(healthz.indexGet, {
      method: 'GET',
      path: '/healthz',
    })
  ];
};
