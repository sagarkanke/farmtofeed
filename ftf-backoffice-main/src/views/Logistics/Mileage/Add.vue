<template>
    <FormComponent :initialValues="initialValues" :type="type" :validationSchema="validationSchema" :handleSubmit="handleSubmit" :close="close" />
</template>

<script setup>
import FormComponent from './Form.vue';
import * as yup from 'yup';
import { ref } from 'vue';
import { LogisticsService } from '../../../service/LogisticsService';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import {  useRouter } from 'vue-router';
const toast = useToast();
const store = useStore();
const router = useRouter();

// Props
const props = defineProps({
    close: {
        type: Function,
        required: true,
    },
});
const type = 'add'
const initialValues = ref({
  registration_number: '',
  ownership: null,
  owner : null,
  vehicle : null,
  phone_number : '',
  load_capacity : '',
  tank_capacity : '',
  ksh_km : '',
  lease_rate  : '',
  lease_cost : '',
  lease_expiration_date : '',
  mpesa_paybill : '',
  payment_details_phone_number : '',
  bank : '',
  branch : '',
  account_number : '',
  account_name : '',
    
  
    })

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
function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('') + `${Math.floor(Math.random() * 900) + 100}`;
}
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
    const response = await new mileageService().createVehicle(formData);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Form Submitted.', life: 1000 });
    await store.dispatch('mileage/fetchVehiclesData');
    router.push('/logistics/vehicles')
    // props.close()
  } catch (error) {
    console.log('error', error)
    toast.add({ severity: 'error', summary: 'Submission Failed..!!', detail: `${error?.response?.data?.message}`, life: 1000 });
  }
  
   

}
</script>