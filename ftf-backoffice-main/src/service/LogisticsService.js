import apiClient from './apiClient';

export class LogisticsService {

  // Fetch all drivers
  fetchAllDrivers(sparam) {
    let url = "/drivers"
    if (sparam) {
      const querystring = new URLSearchParams(sparam).toString()
      url = `${url}?${querystring}`
    }
    return apiClient.get(url)
      .then(response => response.data);
  }
  createDriver(data) {
    return apiClient.post('/drivers', data, {
      headers: {
        'Content-Type': 'multipart/form-data', // Override header for multipart request
      },
    })
      .then(response => response.data);
  }
  fetchAllVehicles(sparam) {
    const querystring = new URLSearchParams(sparam).toString()
    let url = sparam ? `/logistics/vehicles?${querystring}` : '/logistics/vehicles'
    console.log('sparam', sparam)
    return apiClient.get(url)
      .then(response => response.data);
  }
  fetchSelectedVehicles(id) {
    return apiClient.get(`/logistics/vehicles/${id}`)
      .then(response => response.data);
  }
  fetchVehicleOwnerList() {
    return apiClient.get(`/logistics/vehicle-owners/list`)
      .then(response => response.data);
  }
  createVehicle(data) {
    return apiClient.post(`/logistics/vehicles`, data)
      .then(response => response.data);
  }
  editVehicle(data, id) {
    return apiClient.put(`/logistics/vehicles/${id}`, data)
      .then(response => response.data);
  }
  vehicles




  editDriver(data, id) {
    return apiClient.put(`/drivers/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data', // Override header for multipart request
      },
    })
      .then(response => response.data);
  }
  deleteDriver(id) {
    return apiClient.delete(`/drivers/${id}`)
      .then(response => response.data);
  }
  deleteVehicle(id) {
    return apiClient.delete(`/logistics/vehicles/${id}`)
      .then(response => response.data);
  }

  fetchAllVehiclesList(data) {
    return apiClient.get('logistics/vehicles/list', data)
      .then(response => response.data);
  }
  fetchDriverById(data) {
    return apiClient.get(`/drivers/${data}`, data)
      .then(response => response.data);
  }

}