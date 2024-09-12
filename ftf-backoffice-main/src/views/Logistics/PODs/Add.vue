<template>
    <div class="flex-col justify-between" :style="{ height: '90%' }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="grid ml-0 mr-0 mt-0">
          <div class="col-12">
            <div class="p-fluid formgrid grid">
              <div class="field col-12 md:col-6">
                <Label text="Name" for="name" :required="true" />
                <InputText v-model="name" @blur="validateField('name')" id="name" type="text" autofocus />
                <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
              </div>
              <div class="field col-12 md:col-6">
                <Label text="Phone Number" for="phone_number" :required="false" />
                <InputText v-model="phone_number" @blur="validateField('phone_number')" id="phone_number" type="text" />
                <small v-if="errors.phone_number" class="text-red-500">{{ errors.phone_number }}</small>
              </div>
              <div class="field col-12 md:col-6">
                <label for="firstname2">Driver Type</label>
                <InputText id="firstname2" type="text" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="lastname2">Vehicle</label>
                <InputText id="lastname2" type="text" />
              </div>
            </div>
  
            <h6>Code Of Conduct</h6>
            <div class="p-fluid formgrid grid">
              <div class="field col-12 md:col-6">
                <label for="firstname2">Expiration Date</label>
                <InputText id="firstname2" type="text" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="lastname2">Lastname</label>
                <InputText id="lastname2" type="text" />
              </div>
            </div>
  
            <h6>Driver License</h6>
            <div class="p-fluid formgrid grid">
              <div class="field col-12 md:col-6">
                <label for="firstname2">Expiration Date</label>
                <InputText id="firstname2" type="text" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="lastname2">Lastname</label>
                <InputText id="lastname2" type="text" />
              </div>
            </div>
  
            <h6>Food Handling Certificates</h6>
            <div class="p-fluid formgrid grid">
              <div class="field col-12 md:col-6">
                <label for="firstname2">Expiration Date</label>
                <InputText id="firstname2" type="text" />
              </div>
              <div class="field col-12 md:col-6">
                <label for="lastname2">Lastname</label>
                <InputText id="lastname2" type="text" />
              </div>
            </div>
          </div>
        </div>
      </form>
  
      <div :style="{ bottom: '15px', right: '15px', position: 'absolute' }">
        <div class="flex gap-3 justify-content-between">
          <Button label="Cancel" @click="close" icon="pi pi-times" class="p-button-outlined" />
          <Button label="Add Driver"  icon="pi pi-plus" type="submit"/>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import Label from '../../../components/Label.vue';
  
//   import RequiredAsterisk from './RequiredAsterisk.vue';
  const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ]);
  
  const dropdownItem = ref(null);
  export default {
    name: 'Add',
    components: {
        Label
    },
    props: {
      close: {
        type: Function,
        required: true,
      }
    },
    setup() {
      const { handleSubmit, errors } = useForm({
        validationSchema: yup.object({
          name: yup.string().required('Name is required'),
          phone_number: yup.string().required('Phone number is required')
            .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
        })
      });
  
      const { value: name, errorMessage: nameError, handleBlur: nameBlur } = useField('name');
      const { value: phone_number, errorMessage: phoneNumberError, handleBlur: phoneNumberBlur } = useField('phone_number');
  
      const validateField = (fieldName) => {
        if (fieldName === 'name') nameBlur();
        if (fieldName === 'phone_number') phoneNumberBlur();
      };
  
      const onSubmit = (values) => {
        console.log('Form Submitted', values);
        console.log(' values ', values)
      };
  
      return {
        name,
        phone_number,
        errors: { name: nameError, phone_number: phoneNumberError },
        validateField,
        handleSubmit,
        onSubmit
      };
    }
  };
  </script>
  