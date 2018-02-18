const Boom = require('boom');
const { params, requestSuccess, sendPutResponse } = require('../schemas/controllers/request');
const { orderStatuses, userTypes, carrierRequestStatuses } = require('../resources/model-constants');
const Order = require('../models/Order');
const CarrierRequest = require('../models/CarrierRequest');

const targets = {
  ACCEPT: 0,
  REJECT: 1,
  CANCEL: 2,
  DONE: 3,
  SEND: 4,
};

module.exports = ({ log }) => {
  const errorCodes = {
    customerCanNotSendCarrierRequest: 'customer_can_not_send_carrier_request',
    youAlreadyRequestedThisOrder: 'you_already_requested_this_order',
    invalidUserType: 'invalid_user_type',
    requestStatusNotCompatible: 'request_status_not_compatible',
    orderStatusNotCompatible: 'order_status_not_compatible',
    canNotChangeToSameStatus: 'can_not_change_to_same_status'
  };

  async function manageSendState(target, { order }, { id, userType }, childLog){
    childLog.info('Got send carrier request.');
    // check for invalid situations.
    if(userType !== userTypes.CARRIER) return Boom.badRequest(errorCodes.customerCanNotSendCarrierRequest);
    if(await CarrierRequest.count({ order, carrier: id }) > 0) return Boom.badRequest(errorCodes.youAlreadyRequestedThisOrder);
    if(order.status !== orderStatuses.WAITING) return Boom.badRequest(errorCodes.orderStatusNotCompatible);

    childLog.info('Generating carrier request.');
    // Insert a new carrier request otherwise.
    const updates = [{ status: carrierRequestStatuses.WAITING, date: new Date() }];
    const cr = await new CarrierRequest({
      user: order.user,
      carrier: id,
      order: order._id,
      status: carrierRequestStatuses.WAITING,
      updates
    }).save();

    // TODO: emit request sent to websocket
    return { success: true, id: cr.id, createdAt: new Date().getTime() };
  }

  async function manageAcceptState(target, { request }, { id, userType }, childLog){
    childLog.info('Got accept carrier request request');
    if(request.user._id.toString() !== id) return Boom.notFound();
    if(userType !== userTypes.CUSTOMER) return Boom.badRequest(errorCodes.invalidUserType);
    if(request.status === carrierRequestStatuses.OBTAINED) return Boom.badRequest(errorCodes.canNotChangeToSameStatus);
    if(request.status !== carrierRequestStatuses.WAITING) return Boom.badRequest(errorCodes.requestStatusNotCompatible);
    if(request.order.status !== orderStatuses.WAITING) return Boom.badRequest(errorCodes.orderStatusNotCompatible);

    childLog.info('Accepting carrier request.');
    request.status = carrierRequestStatuses.OBTAINED;
    await CarrierRequest.findByIdAndUpdate(request._id, { $set: { status: request.status }});
    request.order.status = orderStatuses.OBTAINED;
    await request.order.save();
    // TODO: emit accepted status to websocket
    return { success: true };
  }

  async function manageRejectState(target, { request }, { id, userType }, childLog){
    childLog.info('Got reject carrier request request.');
    if(request.user._id.toString() !== id) return Boom.notFound();
    if(userType !== userTypes.CUSTOMER) return Boom.badRequest(errorCodes.invalidUserType);
    if(request.status === carrierRequestStatuses.CANCELED_BY_USER) return Boom.badRequest(errorCodes.canNotChangeToSameStatus);
    if(request.status !== carrierRequestStatuses.WAITING) return Boom.badRequest(errorCodes.requestStatusNotCompatible);
    if(request.order.status !== orderStatuses.WAITING) return Boom.badRequest(errorCodes.orderStatusNotCompatible);

    childLog.info('Rejecting carrier request.');
    request.status = carrierRequestStatuses.CANCELED_BY_USER;
    await CarrierRequest.findByIdAndUpdate(request._id, { $set: { status: request.status }});
    request.order.status = orderStatuses.OBTAINED;
    await request.order.save();
    // TODO: emit rejected status to websocket
    return { success: true };
  }

  async function manageCancelState(target, { request }, { id, userType }, childLog){
    childLog.info('Got cancel carrier request request.');
    if(request.carrier._id.toString() !== id) return Boom.notFound();
    if(userType !== userTypes.CARRIER) return Boom.badRequest(errorCodes.invalidUserType);
    if(request.status === carrierRequestStatuses.CANCELED_BY_CARRIER) return Boom.badRequest(errorCodes.canNotChangeToSameStatus);
    if(![carrierRequestStatuses.OBTAINED, carrierRequestStatuses.WAITING].includes(request.status)){
      return Boom.badRequest(errorCodes.requestStatusNotCompatible);
    }

    if(request.order.status === orderStatuses.OBTAINED){
      childLog.info('Changing order status to waiting.');
      request.order.status = orderStatuses.WAITING;
      await request.order.save();
      // TODO: emit carrier canceled to order user via websocket
    }
    childLog.info('Canceling the carrier request.');
    request.status = carrierRequestStatuses.CANCELED_BY_CARRIER;
    await CarrierRequest.findByIdAndUpdate(request._id, { $set: { status: request.status }});
    // TODO: emit carrier canceled request to websocket
    return { success: true };
  }

  async function manageDoneState(target, { request }, { id, userType }, childLog){
    childLog.info('Got carrier request done request.');
    if(request.carrier._id.toString() !== id) return Boom.notFound();
    if(userType !== userTypes.CARRIER) return Boom.badRequest(errorCodes.invalidUserType);
    if(request.status === carrierRequestStatuses.FINISHED) return Boom.badRequest(errorCodes.canNotChangeToSameStatus);
    if(request.status !== carrierRequestStatuses.OBTAINED) return Boom.badRequest(errorCodes.requestStatusNotCompatible);
    if(request.order.status !== orderStatuses.OBTAINED) return Boom.badRequest(errorCodes.orderStatusNotCompatible);

    childLog.info('Marking as finished.');
    request.status = carrierRequestStatuses.FINISHED;
    await CarrierRequest.findByIdAndUpdate(request._id, { $set: { status: request.status }});
    request.order.status = orderStatuses.FINISHED;
    await request.order.save();
    // TODO: emit event done to websocket
    return { success: true };
  }

  const manageMap = {
    [targets.SEND]: manageSendState,
    [targets.ACCEPT]: manageAcceptState,
    [targets.REJECT]: manageRejectState,
    [targets.CANCEL]: manageCancelState,
    [targets.DONE]: manageDoneState,
  };

  async function manageRequestState(target, entities, user, childLog){
    return manageMap[target](target, entities, user, childLog);
  }

  function handlerCreator(target){
    return async function handler({ auth: { credentials: { id, userType } }, params, payload }){
      const entities = {
        order: null,
        request: null
      };
      let childLog = log;

      if(target === targets.SEND){
        entities.order = await Order.findById(payload.id);
        const { order } = entities;

        childLog = log.child({ order: order._id, user: order.user });
      } else {
        entities.request = await CarrierRequest.findById(params.id).populate('order carrier user').exec();
        const { request } = entities;

        childLog = log.child(
          { carrierRequest: request._id, user: request.user._id, order: request.order._id, carrier: request.carrier._id },
        );
      }

      // GET order
      // GET request if you can
      return manageRequestState(target, entities, { id, userType }, childLog);
    };
  }

  return {
    indexPut: {
      config: {
        validate: { payload: params },
        response: { schema: sendPutResponse },
        auth: 'jwt',
        description: 'creates a carrier request to given order. for the authenticated carrier'
      },
      handler: handlerCreator(targets.SEND)
    },
    acceptPatch: {
      config: {
        validate: { params },
        response: { schema: requestSuccess },
        auth: 'jwt',
        description: 'accepts the given carrier request. with the authenticated customer'
      },
      handler: handlerCreator(targets.ACCEPT)
    },
    rejectPatch: {
      config: {
        validate: { params },
        response: { schema: requestSuccess },
        auth: 'jwt',
        description: 'rejects the given carrier request. for the authenticated customer'
      },
      handler: handlerCreator(targets.REJECT)

    },
    cancelDelete: {
      config: {
        validate: { params },
        response: { schema: requestSuccess },
        auth: 'jwt',
        description: 'cancels the given carrier request. for the authenticated carrier'
      },
      handler: handlerCreator(targets.CANCEL)
    },
    donePatch: {
      config: {
        validate: { params },
        response: { schema: requestSuccess },
        auth: 'jwt',
        description: 'marks the carrier request and order as done. with the authenticated carrier'
      },
      handler: handlerCreator(targets.DONE)
    }
  };
};
