const { createRouteGenerator } = require('../utils');

module.exports = ({ controllers, routeDefinitionOverrides = {}, routeConfigOverrides = {} }) => {
  const { healthz, user, carrier, product, market, order } = controllers;
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
    createRouteForController(carrier.loginPost, {
      method: 'POST',
      path: '/carrier/login'
    }),
    createRouteForController(product.indexGet, {
      method: 'GET',
      path: '/product'
    }),
    createRouteForController(product.indexPut, {
      method: 'PUT',
      path: '/product'
    }),
    createRouteForController(market.indexPut, {
      method: 'PUT',
      path: '/market',
    }),
    createRouteForController(market.nearbyPost, {
      method: 'POST',
      path: '/market/nearby',
    }),
    createRouteForController(order.indexPut, {
      method: 'PUT',
      path: '/order',
    }),
    createRouteForController(order.listPost, {
      method: 'POST',
      path: '/order/list',
    }),
  ];
};
