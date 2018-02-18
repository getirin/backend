const { createRouteGenerator } = require('../utils');

module.exports = ({ controllers, routeDefinitionOverrides = {}, routeConfigOverrides = {} }) => {
  const { healthz, user, carrier, product, market, order, request } = controllers;
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
    createRouteForController(user.lastSeenPost, {
      method: 'POST',
      path: '/user/lastSeen'
    }),
    createRouteForController(carrier.loginPost, {
      method: 'POST',
      path: '/carrier/login'
    }),
    // Re-use the userLastSeen since they derive from the same model.
    createRouteForController(user.lastSeenPost, {
      method: 'POST',
      path: '/carrier/lastSeen'
    }),
    createRouteForController(carrier.nearbyPost, {
      method: 'POST',
      path: '/carrier/nearby'
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
    createRouteForController(order.idDelete, {
      method: 'DELETE',
      path: '/order/{id}',
    }),
    createRouteForController(order.listGet, {
      method: 'GET',
      path: '/order/list',
    }),
    createRouteForController(order.findMatchPost, {
      method: 'POST',
      path: '/order/findMatch',
    }),
    createRouteForController(request.indexPut, {
      method: 'PUT',
      path: '/request',
    }),
    createRouteForController(request.acceptPatch, {
      method: 'PATCH',
      path: '/request/{id}/accept',
    }),
    createRouteForController(request.rejectPatch, {
      method: 'PATCH',
      path: '/request/{id}/reject',
    }),
    createRouteForController(request.cancelDelete, {
      method: 'DELETE',
      path: '/request/{id}',
    }),
    createRouteForController(request.donePatch, {
      method: 'PATCH',
      path: '/request/{id}/done',
    }),
  ];
};
