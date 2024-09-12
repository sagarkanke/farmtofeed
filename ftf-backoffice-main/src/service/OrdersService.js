import apiClient from './apiClient';

export class OrdersService{

    // Fetch all orders

    fetchAllOrders(){
        return apiClient.get('/orders')
      .then(response => response.data);
    }

    createNewOrder(data){
      return apiClient.post('/orders',data)
      .then(response => response.data);
    }

    fetchSingleOrder(orderId){
      return apiClient.get(`/orders/${orderId}`)
      .then(response => response.data);
    }

  
    checkCouponValidity(data){
      return apiClient.post(`/orders/coupon/check`,data)
      .then(response => response.data);
    }

    //  Farmer Order
    createNewFarmerOrder(data){
      return apiClient.post('/sourcing/orders',data)
      .then(response => response.data);
    }

}