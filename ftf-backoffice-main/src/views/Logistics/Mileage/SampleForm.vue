<template>
    <div class="form-container">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <div class="field">
          <label for="name">Name</label>
          <InputText v-model="name" id="name" type="text" />
          <small v-if="submitted && errors.name" class="error">{{ errors.name }}</small>
        </div>
        <div class="field">
          <label for="phone_number">Phone Number</label>
          <InputText v-model="phone_number" id="phone_number" type="text" />
          <small v-if="submitted && errors.phone_number" class="error">{{ errors.phone_number }}</small>
        </div>
        <Button label="Submit" type="submit" />
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  
  export default {
    name: 'Add',
    components: {
      InputText,
      Button
    },
    setup() {
      const { handleSubmit, errors, setTouched, resetForm } = useForm({
        validationSchema: yup.object({
          name: yup.string().required('Name is required'),
          phone_number: yup.string().required('Phone number is required')
            .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
        })
      });
  
      const { value: name, errorMessage: nameError } = useField('name');
      const { value: phone_number, errorMessage: phoneNumberError } = useField('phone_number');
  
      const submitted = ref(false);
  
      const onSubmit = (values) => {
        console.log('Form Submitted', values); // Debugging line
        submitted.value = true;
        if (Object.keys(errors).length === 0) {
          // Simulate form submission or further processing
          alert('Form submitted successfully!');
          resetForm();  // Reset form after submission (optional)
        }
      };
  
      return {
        name,
        phone_number,
        errors: { name: nameError, phone_number: phoneNumberError },
        submitted,
        handleSubmit,
        onSubmit
      };
    }
  };
  </script>
  
  <style>
  .form-container {
    max-width: 400px;
    margin: 0 auto;
  }
  .field {
    margin-bottom: 1rem;
  }
  .error {
    color: red;
    font-size: 0.875rem;
  }
  </style>
  