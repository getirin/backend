const path = require('path');

function createMongooseEnumValidator(values, message){
  return {
    validator: function(v){ return values.includes(v); },
    message,
  };
}

function requireFolderWithKeys(folder, keys){
  keys.reduce((curr, key) => ({ ...curr, key: require(path.join(folder, key)) }), {});
}

/**
 * Given an object and a path tries to get the value at given path.
 * @param obj the object to get the value from.
 * @param path list of keys or a string where keys are seperated by dot.
 * @return {*}
 */
function deepGet(obj, path){
  if(!path || path.length === 0) return obj;
  if(!obj || obj.constructor !== Object) return obj;
  if(path.constructor !== Array && path.constructor !== String) return obj;
  const keys = path.constructor === Array ? path : path.split('.');

  return keys.reduce((curr, key) => curr ? curr[key] : curr, obj);
}

/**
 * Sets the given value at the key given. Doesn't mutate the target obj.
 * @param obj the object to set the property of
 * @param path a dot delimited string or an array of keys
 * @param value the value to set at the object's target path.
 * @return {*}
 */
function deepSet(obj, path, value){
  if(!path || path.length === 0) return obj;
  if(!obj || obj.constructor !== Object) return obj;
  if(path.constructor !== Array && path.constructor !== String) return obj;
  const keys = path.constructor === Array ? [...path] : path.split('.');

  return keys.reduceRight((v, key, idx, keys) => {
    return { ...deepGet(obj, keys.slice(0, idx)), ...{ [key]: v } };
  }, value);
}

/**
 * Picks the given keys from the object, creates a new one.
 * @param obj the object to pick the keys from.
 * @param keys the keys to pick from the object.
 */
function pick(obj, keys){
  if(!keys || keys.length === 0 || ![Array, String].includes(keys.constructor)) return {};
  if(!obj || obj.constructor !== Object) return {};
  const k = keys.constructor === Array ? keys : [keys];

  return k.reduce((acc, key) => deepSet(acc, key, deepGet(obj, key)), {});
}

/**
 * Merges the given route to the original routes array by comparing path and method.
 * @param original the original routes array
 * @param toMerge the routes to override the original array with.
 * @return {*[]}
 */
function mergeRoutes(original, toMerge){
  return [
    ...toMerge,
    ...original.filter(o => !toMerge.find(m => m.path === o.path && m.method === o.method))
  ];
}

/**
 * Creates a helper function to generate hapijs routes given a controller and a route config.
 * @param routeDefinitionOverrides the object which the helper function will use to override route definitions with.
 * @param routeConfigOverrides the object which the helper function will use to override route.config with.
 * @return a function to generate routes given controller and a base routeConfig.
 */
function createRouteGenerator(routeDefinitionOverrides, routeConfigOverrides){
  return function createRouteForController(controller, routeConfig){
    return {
      ...routeConfig,
      config: {
        ...controller.config,
        ...routeConfig.config,
        ...routeConfigOverrides,
      },
      handler: controller.handler,
      ...routeDefinitionOverrides
    };
  };
}

module.exports = {
  requireFolderWithKeys,
  createMongooseEnumValidator,
  deepGet,
  deepSet,
  mergeRoutes,
  createRouteGenerator,
  pick
};
