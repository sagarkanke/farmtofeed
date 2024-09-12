import { createStore } from 'vuex';
import { AuthService } from '../service/AuthService';
import orders from './modules/Order/Orders';
import mileage from './modules/Logistics/Mileage';
import driver from './modules/Logistics/Driver';
import pods from './modules/Logistics/Pods';
import vehicle from './modules/Logistics/Vehicles';
import logisticsExpense from './modules/LogisticExpense';
import customers from './modules/Customer/Customers';  // Import the customer module
import leads from './modules/Lead/Lead';  // Import the customer module
import customerPricing from './modules/CustomerPricing/CustomerPricing';
import suppliers from './modules/Supplier/Supplier';
import purchaseReceive from './modules/PurchaseReceive/PurchaseReceive';
import farmer from './modules/Farmer/Farmer';
const store = createStore({
  state: {
    token: null,
    name: null, // Add name to state
  },
  modules: {
    orders,
    mileage,
    vehicle,
    driver,
    pods,
    logisticsExpense,
    customers,
    leads,
    customerPricing,
    suppliers,
    purchaseReceive,
    farmer
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    },
    setName(state, name) {
      state.name = name; // Add mutation to set name
    },
    clearName(state) {
      state.name = null; // Add mutation to clear name
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const authService = new AuthService();
      try {
        const data = await authService.login(credentials);
        commit('setToken', data.data.token);
        commit('setName', data.data.user.name); // Commit the name from the response
        return true; // Indicate login success
      } catch (error) {
        console.error('Error logging in:', error);
        return false; // Indicate login failure
      }
    },
    logout({ commit }) {
      commit('clearToken');
      commit('clearName'); // Clear the name on logout
    },
  },
  getters: {
    token: state => state.token,
    name: state => state.name, // Add getter to retrieve name
  },
});

export default store;
