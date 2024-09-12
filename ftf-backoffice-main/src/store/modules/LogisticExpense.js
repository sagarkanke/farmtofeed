import { LogisticsService } from '../../service/LogisticsService';

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
    
    async fetchLogisticsExpenseData({ commit }) {
      commit('FETCH_DATA_REQUEST');
      try {
        const data = await new LogisticsService().fetchAllVehicles();
        // const data = await response.json();
        console.log('data', data )
        commit('FETCH_DATA_SUCCESS',  data.data.map(user => ({

            date : user?.date || '22/06/2024',
            vehicle : user?.vehicle || 'KAZ 005L',
            Owner : user?.owner || 'Issac Ogolla',
            expense_type : user?.expense_type || 'Fuel',
            mileage  : user?.mileage || '200 KM',
            first_mile  : user?.first_mile || '200 KM',
            last_mile  : user?.last_mile || '200 KM',
            fm_cost  : user?.fm_cost || 'KSH 200.00',
            lm_cost  : user?.lm_cost || 'KSH 200.00',
            total_cost  : user?.total_cost || 'KSH 200.00',
            transaction_cost  : user?.transaction_cost || '-',
            qb_reference  : user?.qb_reference || 'QB-001',
            status  : user?.status ?  'Approved' : "Pending",
        })));
      } catch (error) {
        console.log('error', error)
        commit('FETCH_DATA_FAILURE', error.message);
      }
    },
   
    async setSelectedMileage({ commit }, driver) {
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

