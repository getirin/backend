const { createRouteGenerator } = require('../utils');

module.exports = ({ controllers, routeDefinitionOverrides = {}, routeConfigOverrides = {} }) => {
  const { healthz, user, courrier, product } = controllers;
  const createRouteForController = createRouteGenerator(routeDefinitionOverrides, routeConfigOverrides);

  return [
    createRouteForController(healthz.indexGet, {
      method: 'GET',
      path: '/healthz',
    }),
    createRouteForController(user.loginPost, {
      method: 'POST',
      path: '/user/login'
    }),
    createRouteForController(courrier.loginPost, {
      method: 'POST',
      path: '/courrier/login'
    }),
    createRouteForController(product.indexGet, {
      method: 'GET',
      path: '/product'
    }),
    createRouteForController(product.indexPut, {
      method: 'PUT',
      path: '/product'
    }),
  ];
};
