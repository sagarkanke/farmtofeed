import apiClient from './apiClient';

export class FlashSalesService{

    // Fetch all orders

    fetchAllFlashSales(){
        return apiClient.get('/flash-sales')
      .then(response => response.data);
    }

    saveFlashSale(data){
      return apiClient.post('/flash-sales',data)
    .then(response => response.data);
  }

  deleteFlashSale(id){
    return apiClient.delete(`/flash-sales/${id}`)
    .then(response => response.data);
  }

  editFlashSale(id,data){
    return apiClient.put(`/flash-sales/${id}`,data)
    .then(response => response.data);
  }

}