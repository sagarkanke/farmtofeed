
import apiClient from "./apiClient";

export class SupplierService {


    getSupplierList(){
        return apiClient.get('/sourcing/suppliers/list')
        .then(response => response.data);
    }

    fetchAllOrders(){
        return apiClient.get('/sourcing/orders')
        .then(response => response.data);
    }

    getAllSuppliers(){
        return apiClient.get('/sourcing/suppliers')
        .then(response => response.data);
    }

    createNewSupplier(payload){
        return apiClient.post('/sourcing/suppliers',payload)
        .then(response => response.data);
    }
}
