import { LogisticsService } from '../../../service/LogisticsService';

export default {
  namespaced: true,
  state: () => ({
    data: null,
    loading: false,
    error: null,
    selected_mileage : null,
   
  }),
  mutations: {
    FETCH_DATA_REQUEST(state) {
      state.loading = true;
      state.error = null;
    },
    FETCH_DATA_SUCCESS(state, data) {
      state.loading = false;
      state.data = data;
    },
    FETCH_DATA_FAILURE(state, error) {
      state.loading = false;
      state.error = error;
    },
    SET_SELECTED_MILEAGE(state, driver) {
      state.selected_mileage = driver;
    },
    
  },
  actions: {
    
    async fetchPodsData({ commit }) {
      commit('FETCH_DATA_REQUEST');
      try {
        const data = await new LogisticsService().fetchAllVehicles();
        // const data = await response.json();
        console.log('data', data )
        commit('FETCH_DATA_SUCCESS',  data.data.map(user => ({
            id: user?.id,
            name: user?.name,
            registration_number: user?.registration_number,
            phone_number: user?.phone || '1234567890',
            driver : user?.driver?.name,
            type: 'own',
            rates : user?.rates || 'Weekly',
            vehicles: 'KAX 200K',
            status : user?.status,
            owner: user?.owner?.name || 'sagar k',
            vehicle_type : user?.vehicle_type || '-',
            lease_cost : user?.lease_cost || 'KSH 0.00',
            code_of_conduct: 'Valid',
            driver_license: 'Expired',
            food_handling_certificates: 'Expired',
        })));
      } catch (error) {
        console.log('error', error)
        commit('FETCH_DATA_FAILURE', error.message);
      }
    },
   
    async setSelectedPods({ commit }, driver) {
      commit('SET_SELECTED_MILEAGE', driver);
    },
   
  },
  getters: {
    data(state) {
      return state.data;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    selected_mileage(state) {
      return state.selected_mileage;
    },
  },
};

