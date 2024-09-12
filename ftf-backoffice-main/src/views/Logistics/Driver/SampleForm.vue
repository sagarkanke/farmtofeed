<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import { LogisticsService } from '../../../service/LogisticsService';
// import { InputText } from 'primevue/inputtext';
// import { Button } from 'primevue/button';
// import { Row, Column } from 'primevue/row';

// Define props to accept the close function
const props = defineProps({
  close: {
    type: Function,
    required: true,
  },
  initialValues: {
    type: Object,
    default: () => ({
      name: 'sagar',
      phone_number: '',
      driver_type: { name: '1', label: 'Own' },
      vehicle: '',
      code_of_conduct: 'https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg',
      food_handling_certificate: 'https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg',
      drivers_license: 'https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg',
      food_handling_certificate_expiration_date: '',
      code_of_conduct_expiration_date: '',
      drivers_license_expiration_date: '',
    }),
  },
});
const vechicles_options = ref([]);
const loading = ref(true);
// Define validation schema using yup
const schema = yup.object({
  name: yup.string().required('Name is required'),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, 'Phone number must be only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  driver_type: yup.object().required('Driver type is required'),
  vehicle: yup.string().required('Vehicle is required'),
  code_of_conduct: yup.mixed().required('Code of conduct file is required'),
  food_handling_certificate: yup.mixed().required('Food Handling Certificate file is required'),
  drivers_license: yup.mixed().required('Drivers License file is required'),
  food_handling_certificate_expiration_date: yup.date().transform((value, orignalValue) => orignalValue === '' ? null : value).nullable().required('Expiration date is required'),
  code_of_conduct_expiration_date: yup.date().transform((value, orignalValue) => orignalValue === '' ? null : value).nullable().required('Expiration date is required'),
  drivers_license_expiration_date: yup.date().transform((value, orignalValue) => orignalValue === '' ? null : value).nullable().required('Expiration date is required'),
});
onMounted(async () => {
  if (props.initialValues.food_handling_certificate) {
    food_handling_certificate_file_name.value = props.initialValues.food_handling_certificate.name;
    food_handling_certificate_file_data.value = props.initialValues.food_handling_certificate;

    const response = await fetch(props.initialValues.food_handling_certificate);

    const blob = await response.blob();
    let code_of_conduct_list = props.initialValues.food_handling_certificate.split('/')
    const file = new File([blob], code_of_conduct_list[code_of_conduct_list.length - 1], { type: blob.type });
    food_handling_certificate_file_name.value = code_of_conduct_list[code_of_conduct_list.length - 1]
    // Manually set the file data
    food_handling_certificate_file_data.value = [file];

    // If the FileUpload component supports an API to manually add files, use it
    food_handling_certificate_file_upload.value.files = [file];
    food_handling_certificate_file_upload.value.$emit('input', [file]);
  }

  if (props.initialValues.drivers_license) {
    drivers_license_file_name.value = props.initialValues.drivers_license.name;
    drivers_license_file_data.value = props.initialValues.drivers_license;

    const response = await fetch(props.initialValues.drivers_license);

    const blob = await response.blob();
    let code_of_conduct_list = props.initialValues.drivers_license.split('/')
    const file = new File([blob], code_of_conduct_list[code_of_conduct_list.length - 1], { type: blob.type });
    drivers_license_file_name.value = code_of_conduct_list[code_of_conduct_list.length - 1]
    // Manually set the file data
    drivers_license_file_data.value = [file];

    // If the FileUpload component supports an API to manually add files, use it
    drivers_license_file_upload.value.files = [file];
    drivers_license_file_upload.value.$emit('input', [file]);

  }

  if (props.initialValues.code_of_conduct) {

    code_of_conduct_file_data.value = props.initialValues.code_of_conduct;
    // Fetch file from S3 and create a File object
    const response = await fetch(props.initialValues.code_of_conduct);

    const blob = await response.blob();
    let code_of_conduct_list = props.initialValues.code_of_conduct.split('/')
    const file = new File([blob], code_of_conduct_list[code_of_conduct_list.length - 1], { type: blob.type });
    code_of_conduct_file_name.value = code_of_conduct_list[code_of_conduct_list.length - 1]
    // Manually set the file data
    code_of_conduct_file_data.value = [file];

    // If the FileUpload component supports an API to manually add files, use it
    code_of_conduct_file_upload.value.files = [file];
    code_of_conduct_file_upload.value.$emit('input', [file]);

  }

  try {
    console.log('api called')
    const response = await new LogisticsService().fetchAllVehiclesList();
    console.log('api response ', response)

    // Assuming response.data is an array of options
    vechicles_options.value = response.map((optn) => ({
      name: optn.id,
      label: optn.registration_number
    }));
  } catch (error) {
    console.error('Error fetching options:', error);
  } finally {
    loading.value = false; // Set loading to false after data is fetched
  }
});
function onSubmit(values) {
  console.log('Form Submitted!', values);

  // Create FormData and append form values
  const formData = new FormData();
  Object.keys(values).forEach(key => {
    formData.append(key, values[key]);
  });
  // Append file if available
  console.log('food_handling_certificate_file_data', food_handling_certificate_file_data.value)
  if (food_handling_certificate_file_data.value) {
    formData.append('food_handling_certificate', food_handling_certificate_file_data.value);
  }
  if (code_of_conduct_file_data.value) {
    formData.append('code_of_conduct', code_of_conduct_file_data.value);
  }
  if (drivers_license_file_data.value) {
    formData.append('drivers_license', drivers_license_file_data.value);
  }


  console.log('Form Data:', formData);

  // Send formData to your API using fetch or axios
  // Example using fetch
  fetch('/your-api-endpoint', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
    })
    .catch((error) => {
      console.error('Error:', error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Submission Failed', life: 3000 });
    });
}
const toast = useToast();

const food_handling_certificate_file_upload = ref();
const food_handling_certificate_file_data = ref(null);
const food_handling_certificate_file_name = ref('');


const drivers_license_file_upload = ref();
const drivers_license_file_data = ref(null);
const drivers_license_file_name = ref('');

const code_of_conduct_file_upload = ref();
const code_of_conduct_file_data = ref(null);
let code_of_conduct_file_name = ref('');

function handleFileChange(event) {
  // event.files contains the selected files array
  if (event && event.files && event.files.length > 0) {
    const file = event.files[0];

    // Update reactive references with the selected file and its name
    food_handling_certificate_file_data.value = file;
    food_handling_certificate_file_name.value = file.name;
  } else {
    // No file selected, clear the references
    food_handling_certificate_file_data.value = null;
    food_handling_certificate_file_name.value = '';
  }
}

function handleFileChangeDriversLicense(event) {
  // event.files contains the selected files array
  if (event && event.files && event.files.length > 0) {
    const file = event.files[0];

    // Update reactive references with the selected file and its name
    drivers_license_file_data.value = file;
    drivers_license_file_name.value = file.name;
  } else {
    // No file selected, clear the references
    drivers_license_file_data.value = null;
    drivers_license_file_name.value = '';
  }
}
function handleFileChangeCodeOfConduct(event) {
  if (event && event.files && event.files.length > 0) {
    const file = event.files[0];
    console.log('Selected File:', file);

    code_of_conduct_file_data.value = file;
    code_of_conduct_file_name.value = file.name;
  } else {
    code_of_conduct_file_data.value = null;
    code_of_conduct_file_name.value = '';
  }

  console.log('code_of_conduct_file_name', code_of_conduct_file_name, 'code_of_conduct_file_data', code_of_conduct_file_data)

}

function clearFileDriversLicense() {
  // Clear the reactive references
  drivers_license_file_data.value = null;
  drivers_license_file_name.value = '';

  // Reset the FileUpload component's internal state
  if (drivers_license_file_upload.value) {
    drivers_license_file_upload.value.clear(); // This clears the selected file(s) in the FileUpload component
  }
}
function clearFile() {
  // Clear the reactive references
  food_handling_certificate_file_data.value = null;
  food_handling_certificate_file_name.value = '';

  // Reset the FileUpload component's internal state
  if (food_handling_certificate_file_upload.value) {
    food_handling_certificate_file_upload.value.clear(); // This clears the selected file(s) in the FileUpload component
  }
}
function codeOfConductFileNameClearFile() {
  // Clear the reactive references
  code_of_conduct_file_data.value = null;
  code_of_conduct_file_name.value = '';

  // Reset the FileUpload component's internal state
  if (code_of_conduct_file_upload.value) {
    code_of_conduct_file_upload.value.clear(); // This should clear the selected file(s) in the FileUpload component
  }
}


function upload() {
  food_handling_certificate_file_upload.value.upload();
}

function onUpload() {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}
const driverTypes = ref([
  { name: '1', label: 'Own' },
  { name: '2', label: 'Lease' },
  { name: '3', label: 'Truck owner' }
]);
const selectedPaymentType = ref(null);
// Define a reactive key based on the initialValues
const dropdownKey = ref(props.initialValues.driver_type);
// Watch for changes in the selected driver type and update the key
watch(() => props.initialValues.driver_type, () => {
  dropdownKey.value += 1; // Increment key to force re-render

});
function handleDropdownChange(selectedValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly
  console.log('Selected value:', selectedValue.name);

  // Update dropdownKey with the selected value's name
  dropdownKey.value = selectedValue.name;

  // Log dropdownKey to see if it updates
  console.log('dropdownKey inside', dropdownKey.value);
}
console.log('dropdownKey', dropdownKey.value)
const customBase64Uploader = async (event) => {
  const file = event.files[0];
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;
  };
}
const customUploadHandler = async (event) => {
  console.log('called')
  codeOfConductFileNameClearFile()
}

</script>

<template>
  <div id="app">

    <Form :initial-values="props.initialValues" :validation-schema="schema" @submit="onSubmit"
      v-slot="{ values, handleSubmit }">
      <div class="grid ml-0 mr-0 mt-0">
        <div class="col-12">
          <div class="p-fluid formgrid grid">

            <div class="field col-12 md:col-6">

              <label for="name">Name</label>
              <Field id="name" name="name" as="InputText" :class="['p-inputtext', 'w-full']" />
              <ErrorMessage name="name" class="p-error" />
            </div>


            <div class="field col-12 md:col-6">
              <label for="phone_number">Phone Number</label>
              <Field id="phone_number" name="phone_number" as="InputText" :class="['p-inputtext', 'w-full']" />
              <ErrorMessage name="phone_number" class="p-error" />
            </div>

            <div class="field col-12 md:col-6">
              <label for="driver_type">Driver Type</label>

              <Field id="driver_type" name="driver_type">
                <template #default="{ field, meta }">
                  <Dropdown v-model="field.value" @change="handleDropdownChange(field.value)" :key="dropdownKey.value"
                    :options="driverTypes" optionLabel="label" placeholder="Select" class="w-full"
                    :class="{ 'p-invalid': meta.touched && meta.error }" :style="{ borderRadius: '8px' }" />
                  <ErrorMessage name="driver_type" class="p-error mt-1" />
                </template>
              </Field>
            </div>

            <div class="field col-12 md:col-6">
              <label for="vehicle">Vehicle</label>
              <!-- <Field id="vehicle" name="vehicle" as="InputText" :class="['p-inputtext', 'w-full']" /> -->
              <Field id="vehicle" name="vehicle">
                <template #default="{ field, meta }">
                  <Dropdown v-model="field.value" @change="handleDropdownChange(field.value)" :key="dropdownKey.value"
                    :loading="loading" :options="vechicles_options" optionLabel="label" placeholder="Select"
                    class="w-full" :class="{ 'p-invalid': meta.touched && meta.error }"
                    :style="{ borderRadius: '8px' }" />
                  <ErrorMessage name="vehicle" class="p-error mt-1" />
                </template>
              </Field>
              <ErrorMessage name="vehicle" class="p-error" />
            </div>
            <!-- <h6>Code Of Conduct</h6>
            <div></div> -->



          </div>
          <h6 for="code_of_conduct">Code of Conduct</h6>

          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="code_of_conduct_expiration_date">Expiration Date</label>
              <Field id="code_of_conduct_expiration_date" name="code_of_conduct_expiration_date">
                <template #default="{ field, meta }">
                  <Calendar v-bind="field" v-model="field.value" :class="['w-full', { 'p-invalid': meta.error }]"
                    dateFormat="yy-mm-dd" showIcon />
                </template>
              </Field>
              <ErrorMessage name="code_of_conduct_expiration_date" class="p-error" />
            </div>
            <div class="field col-12 md:col-6 pt-4">
              <Toast />
              <Field name="code_of_conduct">
                <template #default="{ field }">
                  <div class=" flex w-full justify-content-start gap-3 max-w-md">
                    <FileUpload name="code_of_conduct" ref="code_of_conduct_file_upload" mode="basic"
                      @select="handleFileChangeCodeOfConduct" :multiple="true" accept="image/*,application/pdf"
                      :maxFileSize="1000000" @upload="onUpload">
                    </FileUpload>

                    <Button v-if="code_of_conduct_file_name" icon="pi pi-times" class="p-button p-button-sm"
                      @click="codeOfConductFileNameClearFile" aria-label="Clear" />
                    <!-- Display the file name or link -->
                    <!-- <div v-if="code_of_conduct_file_name" class="file-display">
                      <a :href="code_of_conduct_file_data" target="_blank">{{ code_of_conduct_file_name }}</a>
                    </div> -->
                  </div>
                </template>
              </Field>

              <ErrorMessage name="code_of_conduct" class="p-error" />
            </div>
          </div>
          <h6 for="code_of_conduct">Drivers License</h6>

          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="drivers_license_expiration_date">Expiration Date</label>
              <Field id="drivers_license_expiration_date" name="drivers_license_expiration_date">
                <template #default="{ field, meta }">
                  <Calendar v-bind="field" v-model="field.value" :class="['w-full', { 'p-invalid': meta.error }]"
                    dateFormat="yy-mm-dd" showIcon />
                </template>
              </Field>
              <ErrorMessage name="drivers_license_expiration_date" class="p-error" />
            </div>
            <div class="field col-12 md:col-6 pt-4">
              <Field name="drivers_license">
                <template #default="{ field }">
                  <div class=" flex w-full justify-content-start gap-3 max-w-md">
                    <FileUpload name="drivers_license" ref="drivers_license_file_upload" mode="basic"
                      @select="handleFileChangeDriversLicense" :multiple="false" accept="image/*,application/pdf"
                      :maxFileSize="1000000" customUpload v-slot:content="{ chooseButton }">
                      <Button class="w-full p-component p-button p-button-outlined p-button-info" @click="chooseButton"
                        icon="pi pi-upload" label="Upload Drivers license" />
                    </FileUpload>


                    <Button v-if="drivers_license_file_name" icon="pi pi-times" class=" p-button p-button p-button-sm"
                      @click="clearFileDriversLicense" aria-label="Clear" />
                  </div>

                </template>
              </Field>

              <ErrorMessage name="drivers_license" class="p-error" />
            </div>
          </div>
          <h6 for="code_of_conduct">Food Handling Certificate</h6>

          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="food_handling_certificate_expiration_date">Expiration Date</label>
              <Field id="food_handling_certificate_expiration_date" name="food_handling_certificate_expiration_date">
                <template #default="{ field, meta }">
                  <Calendar v-bind="field" v-model="field.value" :class="['w-full', { 'p-invalid': meta.error }]"
                    dateFormat="yy-mm-dd" showIcon />
                </template>
              </Field>
              <ErrorMessage name="food_handling_certificate_expiration_date" class="p-error" />
            </div>
            <div class="field col-12 md:col-6 pt-4">
              <Field name="food_handling_certificate">
                <template #default="{ field }">
                  <div class=" flex w-full justify-content-start gap-3 max-w-md">
                    <FileUpload name="food_handling_certificate" ref="food_handling_certificate_file_upload"
                      mode="basic" @select="handleFileChange" :multiple="false" @uploader="onUpload"
                      accept="image/*,application/pdf" :maxFileSize="1000000" customUpload
                      v-slot:content="{ chooseButton }">
                      <Button class="w-full p-component p-button p-button-outlined p-button-info" @click="chooseButton"
                        icon="pi pi-upload" label="Upload Code of Conduct" />
                    </FileUpload>

                    <Button v-if="food_handling_certificate_file_name" icon="pi pi-times"
                      class=" p-button p-button p-button-sm" @click="clearFile" aria-label="Clear" />
                  </div>

                </template>
              </Field>

              <ErrorMessage name="food_handling_certificate" class="p-error" />
            </div>
          </div>


        </div>
      </div>
      <!-- Sticky footer for buttons -->
      <div class="form-footer">
        <div class="flex gap-3 justify-content-end">
          <Button label="Cancel" @click="props.close" icon="pi pi-times" class="p-button-outlined" />
          <Button label="Add Driver" @click="handleSubmit(onSubmit)" icon="pi pi-plus" type="submit" />
        </div>
      </div>


    </Form>

  </div>
</template>

<style scoped>
.grid {
  flex-grow: 1;
  /* Ensure the grid takes up all available space */
  padding-bottom: 10px;
  /* Reserve space for the footer */
}

.form-footer {
  background: white;
  z-index: 99;
  width: 100%;
  padding: 15px;
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.p-error {
  color: #ff4d4d;
  font-size: 14px;
  margin-top: 5px;
}

.mt-4 {
  margin-top: 20px;
}
</style>
