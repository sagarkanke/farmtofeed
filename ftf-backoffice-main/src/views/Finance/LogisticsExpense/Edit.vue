<template>
    <FormComponent v-if="initialValues" :initialValues="initialValues" :type="type" :validationSchema="validationSchema"
        :handleSubmit="handleSubmit" :close="close" />
</template>

<script setup>
import FormComponent from './Form.vue';
import * as yup from 'yup';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { LogisticsService } from '../../../service/LogisticsService';
import { useToast } from 'primevue/usetoast';
import {  useRoute, useRouter } from 'vue-router';

// Props
const props = defineProps({
    close: {
        type: Function,
        required: true,
    }
});
// Access the Vuex store
const store = useStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const id = route.params.vehicleId;
const initialValues = ref(null);
const selected_driver = computed(() => store.getters['logistics/selected_driver']);
const drivers = computed(() => store.getters['logistics/data']);
const driverTypes =
    { 'owned': 'Own', 'lease': 'Lease', 'truck_owner': 'Truck owner' }
const leaseRates = 
  { 'per_day': 'Per Day' ,
    'weekly': 'Weekly' ,
   'monthly': 'Monthly' };
const vehicleTypes =
{
    'boda_boda': 'Boda Boda',
    'closed_box_truck': 'Close Box Truck',
    'open_pickup_truck': 'Open Pickup Truck',
    'closed_pickup_truck': 'Closed Pickup Truck',
    'closed_van': 'Closed Van'
};
console.log("rowid", route.params.vehicleId)
onMounted(async () => {
    try {
        const data = await new LogisticsService().fetchSelectedVehicles(id);
        // const data = await new LogisticsService().fetchDriverById(id);
        console.log('data?.vehicle_type', vehicleTypes[`${data?.vehicle_type}`])
        initialValues.value = {
            registration_number: data?.registration_number,
            ownwer: data.owner.name,
            phone_number: data?.phone_number,
            ownership: { name: data?.type, label: driverTypes[`${data?.type}`] },
            vehicle: { name: data?.vehicle_type, label: vehicleTypes[`${data?.vehicle_type}`] }, // vehicle_type
            load_capacity: data?.load_capacity,
            tank_capacity: data?.tank_capacity,
            ksh_km: data?.cost_per_km,
            lease_terms: data?.lease_terms,
            lease_rate: data.lease_rate  ? { name : data?.lease_rate , label : leaseRates[`${data?.lease_rate}`] } : null ,
            lease_cost: data?.lease_cost,
            mpesa_paybill: data?.mpesa_paybill,
            bank: data?.bank,
            branch: data?.branch,
            account_name: data?.account_name,
            account_number: data?.account_number,
            driver_type: { name: data?.type, label: driverTypes[`${data?.type}`] },
            // code_of_conduct: data.code_of_conduct,
            // food_handling_certificate: data.food_handling_certificate,
            // drivers_license: data.drivers_license,
            // food_handling_certificate_expiration_date: data.food_handling_certificate_expiration_date || '',
            // code_of_conduct_expiration_date: data.code_of_conduct_expiration_date || '',
            // drivers_license_expiration_date: data.drivers_license_expiration_date || '',
        };
    } catch (error) {
        console.error('Error fetching initial values:', error);
    }
});

const type = 'edit'
// Validation schema
const validationSchema = yup.object({
    registration_number: yup.string().required('Registration number is required'),
  load_capacity: yup.string().required('Load capacity is required'),
  tank_capacity: yup.string().required('Tank capacity is required'),
  ksh_km: yup.string().required('Ksh km is required'),
  lease_rate: yup.string().required('Lease rate is required'),
  lease_cost: yup.string().required('Lease cost is required'),
    phone_number: yup
        .string()
        .matches(/^[0-9]+$/, 'Phone number must be only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
        ownership: yup.object().required('Ownership  is required'),
        owner: yup.object().required('Owner  is required'),
        vehicle: yup.object().required('Vehicle  is required'),
    // vehicle: yup.string().required('Vehicle is required'),
    
    lease_expiration_date: yup.date().transform((value, orignalValue) => orignalValue === '' ? null : value).nullable().required('Lease expiration date  is required'),
});

const handleSubmit = async (formData) => {



    // Send formData to your API using fetch or axios
    // Example using fetch
    try {
        formData.vehicle_owner_id = formData?.owner?.id,
    formData.type = formData?.ownership?.name
    formData.registration_number = formData?.registration_number  
    formData.load_capacity = formData?.load_capacity
    formData.cost_per_km = formData?.ksh_km
    formData.vehicle_type = formData.vehicle?.name
        const response = await new LogisticsService().editVehicle(formData, id);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Form Submitted.', life: 1000 });
        await store.dispatch('logistics/fetchVehiclesData');
        router.push('/logistics/vehicles')
    } catch (error) {
        console.log('error', error)
        toast.add({ severity: 'error', summary: 'Submission Failed..!!', detail: `${error?.response?.data?.message}`, life: 1000 });
    }
}
</script>