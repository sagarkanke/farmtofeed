// store/modules/orders.js
const state = {
  orderDetailsArray: [],
};

const mutations = {
  SET_ORDER_DETAILS_ARRAY(state, orders) {
    state.orderDetailsArray = orders;
  },
};

const actions = {
  setOrderDetailsArray({ commit }, orders) {
    commit('SET_ORDER_DETAILS_ARRAY', orders);
  },
};

const getters = {
  orderDetailsArray: (state) => state.orderDetailsArray,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
