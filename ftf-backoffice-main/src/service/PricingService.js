import apiClient from './apiClient';

export class PricingService {

    //Customer Pricing
    fetchAllPricingList(){
        return apiClient.get('/inventory/custom-pricing')
        .then(response => response.data);
      }
}