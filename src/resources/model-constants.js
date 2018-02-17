module.exports = {
  userTypes: {
    CUSTOMER: 0,
    CARRIER: 1,
  },
  orderStatuses: {
    WAITING: 0,
    OBTAINED: 1,
    CANCELED_BY_USER: 2,
    FINISHED: 3,
  },
  carrierRequestStatuses: {
    WAITING: 0,
    OBTAINED: 1,
    CANCELED_BY_USER: 2,
    CANCELED_BY_CARRIER: 3,
    FINISHED: 4,
  },
};
