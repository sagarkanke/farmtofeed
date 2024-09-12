import apiClient from './apiClient';

export class LeadService{
    fetchLeadsList(){
        return apiClient.get('/leads')
        .then(response => response.data);
    }
}