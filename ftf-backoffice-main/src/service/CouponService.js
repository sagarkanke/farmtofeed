import apiClient from './apiClient';

export class CouponsService{

    // Fetch all orders

    fetchSingleCoupon(couponCode) {
      return apiClient.get(`/coupons`, {
          params: {
              coupon_code: couponCode
          }
      })
      .then(response => response.data);
  }
  


}