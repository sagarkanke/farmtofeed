// store/modules/customerPricing.js
const state = {
    customerPricingDetails: null,
  };
  
  const mutations = {
    SET_CUSTOMER_PRICING_DETAILS(state, details) {
      state.customerPricingDetails = details;
    },
  };
  
  const actions = {
    setCustomerPricingDetails({ commit }, details) {
      commit('SET_CUSTOMER_PRICING_DETAILS', details);
    },
  };
  
  const getters = {
    customerPricingDetails: (state) => state.customerPricingDetails,
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };
  