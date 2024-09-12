import { LogisticsService } from '../../../service/LogisticsService';
const driverTypes = 
  { 'own' : 'Own' ,
  'lease' : 'Lease',
  'truck_owner' : 'Truck owner' };
export default {
  namespaced: true,
  state: () => ({
    data: null,
    loading: false,
    error: null,
    selected_driver : null,
   
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
    SET_SELECTED_DRIVER(state, driver) {
      state.selected_driver = driver;
    }
    
  },
  actions: {
    
    
    async fetchDriversData({ commit } , data) {
      commit('FETCH_DATA_REQUEST');
      try {
        const currentDate = new Date();
        const data = await new LogisticsService().fetchAllDrivers();
        // const data = await response.json();
        commit('FETCH_DATA_SUCCESS',  data.data.map(user => ({
            id: user.id,
            name: user.user.name,
            phone_number: user.phone || '1234567890',
            type: driverTypes[`${user.type}`] || '',
            vehicles: user?.vehicle?.registration_number,
            code_of_conduct:  currentDate >  new Date(user?.code_of_conduct_expiry) ? 'Expired' :  'Valid',
            code_of_conduct_expiry : user?.code_of_conduct_expiry?.split('T')[0],
            drivers_license_expiry : user?.drivers_license_expiry?.split('T')[0],
            food_handling_expiry :  user?.food_handling_expiry?.split('T')[0],
            drivers_license: currentDate > new Date(user?.drivers_license_expiry) ? 'Expired' : 'Valid',
            food_handling: currentDate >  new Date(user?.food_handling_expiry) ? 'Expired'  : 'Valid',
        })));
      } catch (error) {
        console.log(' error ', error )
        commit('FETCH_DATA_FAILURE', error.message);
      }
    },
    async setSelectedDriver({ commit }, driver) {
      commit('SET_SELECTED_DRIVER', driver);
    }
    // async setSelectedDriver({ commit }, vehicle) {
    //   commit('SET_SELECTED_VEHICLE', vehicle);
    // },
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
    selected_driver(state) {
      return state.selected_driver;
    },
  
  },
};

