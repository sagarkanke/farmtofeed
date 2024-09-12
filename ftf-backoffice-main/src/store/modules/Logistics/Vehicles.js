import { LogisticsService } from '../../../service/LogisticsService';
const driverTypes = 
  { 'own' : 'Own' ,
  'lease' : 'Lease',
  'truck_owner' : 'Truck owner' };
  const vehicleTypes = {
    boda_boda: 'Boda Boda',
    closed_box_truck: 'Close Box Truck',
    open_pickup_truck: 'Open Pickup Truck',
    closed_pickup_truck: 'Closed Pickup Truck',
    closed_van: 'Closed Van'
};
export default {
  namespaced: true,
  state: () => ({
   
    vehicles_data: null,
    vehicles_loading: false,
    vehicles_error: null,
    selected_vehicle : null,
    selected_vehicles_loading : false,
    selected_vehicles_data : null,
    selected_vehicles_error : null,
  }),
  mutations: {
   
    FETCH_DATA_VEHICLES_REQUEST(state) {
      state.vehicles_loading = true;
      state.vehicles_error = null;
    },
    FETCH_DATA_VEHICLES_SUCCESS(state, data) {
      state.vehicles_loading = false;
      state.vehicles_data = data;
    },
    FETCH_DATA_VEHICLES_FAILURE(state, error) {
      state.vehicles_loading = false;
      state.vehicles_error = error;
    },
    FETCH_DATA_SELECTED_VEHICLES_REQUEST(state) {
      state.selected_vehicles_loading = true;
      state.selected_vehicles_error = null;
    },
    FETCH_DATA_SELECTED_VEHICLES_SUCCESS(state, data) {
      state.selected_vehicles_loading = false;
      state.selected_vehicles_data = data;
    },
    FETCH_DATA_SELECTED_VEHICLES_FAILURE(state, error) {
      state.selected_vehicles_loading = false;
      state.selected_vehicles_error = error;
    },
   
    SET_SELECTED_VEHICLE(state, vehicle) {
      state.selected_vehicle = vehicle;
    },
  },
  actions: {
    
    async fetchVehiclesData({ commit } , sparam) {
      commit('FETCH_DATA_VEHICLES_REQUEST');
      try {
      
        const data = await new LogisticsService().fetchAllVehicles(sparam);
        // const data = await response.json();
        console.log('data', data )
        commit('FETCH_DATA_VEHICLES_SUCCESS',  data.data.map(user => ({
            id: user?.id,
            name: user?.name,
            registration_number: user?.registration_number,
            phone_number: user?.phone || '1234567890',
            driver : user?.driver?.user?.name,
            type: 'own',
            rates : user?.rates || 'Weekly',
            vehicles: 'KAX 200K',
            status : user?.status,
            owner: user?.owner?.name || 'sagar k',
            vehicle_type :  vehicleTypes[`${user.vehicle_type}`]  || '-',
            lease_cost : user?.lease_cost || 'KSH 0.00',
            code_of_conduct: 'Valid',
            driver_license: 'Expired',
            food_handling_certificates: 'Expired',
        })));
      } catch (error) {
        console.log('error', error)
        commit('FETCH_DATA_VEHICLES_FAILURE', error.message);
      }
    },
    async fetchSeclectedVehiclesData({ commit  }, id) {
      console.log('id', id)
      commit('FETCH_DATA_SELECTED_VEHICLES_REQUEST');
      try {
      
        const user = await new LogisticsService().fetchSelectedVehicles(id);
        // const data = await response.json();
        console.log('data', user )
        commit('FETCH_DATA_SELECTED_VEHICLES_SUCCESS',  user);
      } catch (error) {
        console.log('error', error)
        commit('FETCH_DATA_SELECTED_VEHICLES_FAILURE', error.message);
      }
    },
    // async fetchVehiclesData({ commit }) {
    //   commit('FETCH_DATA_VEHICLES_REQUEST');
    //   try {
      
    //     const data = await new LogisticsService().fetchAllVehicles();
    //     // const data = await response.json();
    //     console.log('data', data )
    //     commit('FETCH_DATA_VEHICLES_SUCCESS',  data.data.map(user => ({
    //         id: user?.id,
    //         name: user?.name,
    //         registration_number: user?.registration_number,
    //         phone_number: user?.phone || '1234567890',
    //         driver : user?.driver?.name,
    //         type: 'own',
    //         rates : user?.rates || 'Weekly',
    //         vehicles: 'KAX 200K',
    //         status : user?.status,
    //         owner: user?.owner?.name || 'sagar k',
    //         vehicle_type : user?.vehicle_type || '-',
    //         lease_cost : user?.lease_cost || 'KSH 0.00',
    //         code_of_conduct: 'Valid',
    //         driver_license: 'Expired',
    //         food_handling_certificates: 'Expired',
    //     })));
    //   } catch (error) {
    //     console.log('error', error)
    //     commit('FETCH_DATA_VEHICLES_FAILURE', error.message);
    //   }
    // },
 
   
  },
  getters: {
   
    vehicles_data(state) {
      return state.vehicles_data;
    },
    vehicles_loading(state) {
      return state.vehicles_loading;
    },
    vehicles_error(state) {
      return state.vehicles_error;
    },
    selected_vehicle(state) {
      return state.selected_vehicle;
    },
  },
};

