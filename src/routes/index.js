const { createRouteGenerator } = require('../utils');

module.exports = ({ controllers, routeDefinitionOverrides = {}, routeConfigOverrides = {} }) => {
  const { healthz, user } = controllers;
  const createRouteForController = createRouteGenerator(routeDefinitionOverrides, routeConfigOverrides);

  return [
    createRouteForController(healthz.indexGet, {
      method: 'GET',
      path: '/healthz',
    }),
    createRouteForController(user.loginPost, {
      method: 'POST',
      path: '/user/login'
    })
  ];
};
