import apiClient from './apiClient';

export class CompanyService {

    // Fetch all companies list
    fetchAllCompanies(){
        return apiClient.get('/companies/list')
      .then(response => response.data);
    }

    // Fetch all companies details
    fetchBillingDetails(companyId){
      return apiClient.get(`/companies/${companyId}`)
      .then(response => response.data);
    }

    // Fetch all companies address details
    fetchCustomerDetails(companyId){
      return apiClient.get(`/companies/${companyId}/addresses`)
    .then(response => response.data);
  }

  fetchAllCompanies(){
    return apiClient.get('/companies')
    .then(response => response.data);
  }

  createCompany(data){
    return apiClient.post('/companies',data)
    .then(response => response.data);
  }

  deleteCompany(id){
    return apiClient.delete(`/companies/${id}`)
    .then(response => response.data);
  }

  editCompany(data,id){
    return apiClient.put(`/companies/${id}`,data)
    .then(response => response.data);
  }
}