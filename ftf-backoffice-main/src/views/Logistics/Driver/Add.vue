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
const toast = useToast();
const store = useStore();

// Props
const props = defineProps({
    close: {
        type: Function,
        required: true,
    },
});
const type = 'add'
const initialValues = ref({
      name: '',
      phone_number: '',
      driver_type: null,
      vehicle: null,
      code_of_conduct: '',
      food_handling_certificate: '',
      drivers_license: '',
      food_handling_certificate_expiration_date: '',
      code_of_conduct_expiration_date: '',
      drivers_license_expiration_date: '',
    })

// Validation schema
const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    phone_number: yup
        .string()
        .matches(/^[0-9]+$/, 'Phone number must be only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
    driver_type: yup.object().required('Driver type is required'),
    vehicle: yup.object().required('Vehicle is required'),
    code_of_conduct: yup.string().required('Code of conduct file is required'),
    food_handling_certificate: yup.string().required('Food Handling Certificate file is required'),
    drivers_license: yup.string().required('Drivers License file is required'),
    food_handling_certificate_expiration_date: yup.date().transform((value, orignalValue) => orignalValue === '' ? null : value).nullable().required('Expiration date is required'),
    code_of_conduct_expiration_date: yup.date().transform((value, orignalValue) => orignalValue === '' ? null : value).nullable().required('Expiration date is required'),
    drivers_license_expiration_date: yup.date().transform((value, orignalValue) => orignalValue === '' ? null : value).nullable().required('Expiration date is required'),
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


  console.log('formData', formData)
  // Send formData to your API using fetch or axios
  // Example using fetch
  try {
  //   Object.keys(values).forEach(key => {
  //   formData.append(key, values[key]);
  // });
    
    // formData.append('payment_method[bank_name]','ABC')
        // formData.append('payment_method[account_number]','ABC')
        // formData.append('payment_method[bank_transfer]','bank_transfer')
    // if(formData.vehicle){
    //     formData.vehicle_id =formData?.vehicle.name
    // }
    // formData.username = toCamelCase(formData.name)  
    // formData.phone = formData.phone_number
    // formData.address = '123 Main St, Anytown, USA'
    // formData.type = formData.driver_type?.name
    console.log('formData', formData )
    const response = await new LogisticsService().createDriver(formData);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Form Submitted.', life: 1000 });
    await store.dispatch('driver/fetchDriversData');
    props.close()
  } catch (error) {
    console.log(' error', error )
    toast.add({ severity: 'error', summary: 'Submission Failed..!!', detail: `${error?.response?.data?.message}`, life: 1000 });
  }
  
   

}
</script>