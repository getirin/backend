const redis = require('redis');

function createRedisClient(host, port){
  return new Promise((resolve, reject) => {
    const client = redis.createClient({ host, port });

    client.on('connect', () => resolve(client));
    client.on('error', (err) => reject(err));
  });
}

const types = {
  LOCATION_UPDATE_TYPE: 'LOCATION',
  ORDER_CREATE_TYPE: 'CREATE',
  ORDER_ACCEPT_TYPE: 'ACCEPT',
  ORDER_FINISH_TYPE: 'FINISH',
  REQUEST_CREATE_TYPE: 'REQUEST',
};

async function configureEvents({ host, port, channel }){
  const client = await createRedisClient(host, port);

  const emit = async (payload) => {
    client.publish(channel, JSON.stringify(payload));
  };

  return {
    locationChange: async (id, lastSeen, carrier) => {
      return emit({ type: types.LOCATION_UPDATE_TYPE, payload: { [carrier.id]: { lastSeen, name: carrier.name } } });
    },
    orderFinished: async (orderId) => {
      return emit({ type: types.ORDER_FINISH_TYPE, payload: { order_id: orderId } });
    },
    carrierRequest: async (orderId, requestId, carrier) => {
      return emit({ type: types.REQUEST_CREATE_TYPE, payload: { order_id: orderId, request_id: requestId, name: carrier.name } });
    },
    orderCreated: async (orderId, userId) => {
      return emit({ type: types.ORDER_CREATE_TYPE, payload: { order_id: orderId, user_id: userId } });
    },
    orderAccepted: async (orderId, carrier) => {
      return emit({ type: types.ORDER_ACCEPT_TYPE, payload: { order_id: orderId, carrier_id: carrier.id, name: carrier.name  } });
    }
  };
}

module.exports = { configureEvents };
