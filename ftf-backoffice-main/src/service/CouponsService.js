import apiClient from './apiClient';

export class CouponsService{

    fetchAllCoupons(){
        return apiClient.get('/coupons')
        .then(response => response.data);
    }

    saveCoupon(data){
        return apiClient.post('/coupons',data)
        .then(response => response.data);
    }

    deleteCoupon(id){
        return apiClient.delete(`/coupons/${id}`)
        .then(response => response.data);
    }

    editCoupon(id,data){
        return apiClient.put(`/coupons/${id}`,data)
        .then(response => response.data);
    }
}