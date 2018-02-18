module.exports = {
  userTypes: {
    CUSTOMER: 0,
    CARRIER: 1,
  },
  /**
   * Same name order/carrier request statuses should have the same constant value.
   */
  orderStatuses: {
    WAITING: 0,
    OBTAINED: 1,
    FINISHED: 2,
    CANCELED_BY_USER: 3,
  },
  carrierRequestStatuses: {
    WAITING: 0,
    OBTAINED: 1,
    FINISHED: 2,
    CANCELED_BY_USER: 3,
    CANCELED_BY_CARRIER: 4,
  },
};
