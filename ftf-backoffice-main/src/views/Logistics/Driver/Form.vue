<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import { LogisticsService } from '../../../service/LogisticsService';

const props = defineProps({
  close: {
    type: Function,
    required: true,
  },
  validationSchema: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  initialValues: {
    type: Object,
    required: true,
  },
  handleSubmit: {
    type: Function,
    required: true
  }
});
const vechicles_options = ref([]);
const loading = ref(true);

const food_handling_certificate_file_upload = ref();
const food_handling_certificate_file_data = ref(null);
const food_handling_certificate_file_name = ref('');


const drivers_license_file_upload = ref();
const drivers_license_file_data = ref(null);
const drivers_license_file_name = ref('');

const code_of_conduct_file_upload = ref();
const code_of_conduct_file_data = ref(null);

// Define validation schema using yup
onMounted(async () => {
  try {
    // Food Handling Certificate
    if (props.initialValues.food_handling_certificate) {
      food_handling_certificate_file_name.value = props.initialValues.food_handling_certificate.name;
      food_handling_certificate_file_data.value = [];

      const response = await fetch(props.initialValues.food_handling_certificate);
      const blob = await response.blob();
      const fileName = props.initialValues.food_handling_certificate.split('/').pop();
      const file = new File([blob], fileName, { type: blob.type });

      food_handling_certificate_file_name.value = fileName;
      food_handling_certificate_file_data.value = [file];

      // Check if FileUpload component supports setting files
      if (food_handling_certificate_file_upload.value && typeof food_handling_certificate_file_upload.value.$emit === 'function') {
        food_handling_certificate_file_upload.value.files = [file];
        food_handling_certificate_file_upload.value.$emit('input', [file]);
      }
    }

    // Drivers License
    if (props.initialValues.drivers_license) {
      drivers_license_file_name.value = props.initialValues.drivers_license.name;
      drivers_license_file_data.value = [];

      const response = await fetch(props.initialValues.drivers_license);
      const blob = await response.blob();
      const fileName = props.initialValues.drivers_license.split('/').pop();
      const file = new File([blob], fileName, { type: blob.type });

      drivers_license_file_name.value = fileName;
      drivers_license_file_data.value = [file];

      if (drivers_license_file_upload.value && typeof drivers_license_file_upload.value.$emit === 'function') {
        drivers_license_file_upload.value.files = [file];
        drivers_license_file_upload.value.$emit('input', [file]);
      }
    }

    // Code of Conduct
    if (props.initialValues.code_of_conduct) {
      code_of_conduct_file_data.value = [];

      const response = await fetch(props.initialValues.code_of_conduct);
      const blob = await response.blob();
      const fileName = props.initialValues.code_of_conduct.split('/').pop();
      const file = new File([blob], fileName, { type: blob.type });

      code_of_conduct_file_name.value = fileName;
      code_of_conduct_file_data.value = [file];

      if (code_of_conduct_file_upload.value && typeof code_of_conduct_file_upload.value.$emit === 'function') {
        code_of_conduct_file_upload.value.files = [file];
        code_of_conduct_file_upload.value.$emit('input', [file]);
      }
    }

    // Fetch Vehicles List
    try {
      const response = await new LogisticsService().fetchAllVehiclesList();
      vechicles_options.value = response.map(optn => ({
        name: optn.id,
        label: optn.registration_number
      }));
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  } catch (error) {
    console.error('Error handling file uploads:', error);
  } finally {
    loading.value = false;
  }
});


function formatDate(dateString) {
  // Parse the date string into a Date object
  const date = new Date(dateString);

  // Extract the last two digits of the year
  const year = date.getFullYear().toString().substring(2);

  // Extract the month (getMonth() returns 0-11, so we add 1)
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  // Extract the day of the month
  const day = date.getDate().toString().padStart(2, '0');

  // Return the formatted date as 'YY-MM-DD'
  return `${year}-${month}-${day}`;
}


function onSubmit(values) {
  // Create FormData and append form values
  console.log(' values ', values, typeof values.food_handling_certificate_expiration_date)
  try {
    const formattedDate = formatDate(values.food_handling_certificate_expiration_date);
    console.log(formattedDate); // Outputs:
  } catch (error) {
    console.log('error', error); // Outputs:

  }
  // Example usage

  const formData = new FormData();
  if (values.phone_number) formData.append('phone', values.phone_number);
  if (values.name) formData.append('name', values.name);
  formData.append('username', values.name);
  formData.append('address', 'abc xyz');

  // if(values.email) formData.append('name', values.email);
  formData.append('type', values.driver_type.name);
  formData.append('vehicle_id', values.vehicle.name);
  formData.append('payment_details[bank_name]', 'abc')
  formData.append('payment_details[account_number]', 'abc')
  formData.append('payment_method', 'bank_transfer')
  formData.append('food_handling_expiry', formatDate(values.food_handling_certificate_expiration_date))
  formData.append('drivers_license_expiry', formatDate(values.drivers_license_expiration_date))
  formData.append('code_of_conduct_expiry', formatDate(values.code_of_conduct_expiration_date))

  // Append file if available
  if (food_handling_certificate_file_data?.value && food_handling_certificate_file_data?.value instanceof File) {
    formData.append('food_handling_file', food_handling_certificate_file_data.value);
  }
  if (code_of_conduct_file_data?.value && code_of_conduct_file_data?.value instanceof File) {
    formData.append('code_of_conduct_file', code_of_conduct_file_data.value);
  }
  if (drivers_license_file_data.value && drivers_license_file_data.value instanceof File) {
    formData.append('drivers_license_file', drivers_license_file_data.value);
  }

  props.handleSubmit(formData)
}
const toast = useToast();

let code_of_conduct_file_name = ref('');

function handleFileChange(event,setFieldValue) {
  // event.files contains the selected files array
  if (event && event.files && event.files.length > 0) {
    const file = event.files[0];
    setFieldValue('food_handling_certificate' , URL.createObjectURL(file) )

    // Update reactive references with the selected file and its name
    food_handling_certificate_file_data.value = file;
    food_handling_certificate_file_name.value = file.name;
  } else {
    // No file selected, clear the references
    food_handling_certificate_file_data.value = null;
    food_handling_certificate_file_name.value = '';
  }

}

function handleFileChangeDriversLicense(event, setFieldValue) {
  // event.files contains the selected files array
  if (event && event.files && event.files.length > 0) {
    const file = event.files[0];
    setFieldValue('drivers_license' , URL.createObjectURL(file) )
    // Update reactive references with the selected file and its name
    drivers_license_file_data.value = file;
    drivers_license_file_name.value = file.name;
  } else {
    // No file selected, clear the references
    drivers_license_file_data.value = null;
    drivers_license_file_name.value = '';
  }
}
function handleFileChangeCodeOfConduct(event , setFieldValue) {
  if (event && event.files && event.files.length > 0) {
    const file = event.files[0];
    setFieldValue('code_of_conduct' , URL.createObjectURL(file) )
    code_of_conduct_file_data.value = file;
    code_of_conduct_file_name.value = file.name;
  } else {
    code_of_conduct_file_data.value = null;
    code_of_conduct_file_name.value = '';
  }


}

function clearFileDriversLicense(setFieldValue) {
  // Clear the reactive references
  drivers_license_file_data.value = null;
  drivers_license_file_name.value = '';
  setFieldValue('drivers_license','')

  // Reset the FileUpload component's internal state
  if (drivers_license_file_upload.value) {
    drivers_license_file_upload.value.clear(); // This clears the selected file(s) in the FileUpload component
  }
}
function clearFile(setFieldValue) {
  // Clear the reactive references
  food_handling_certificate_file_data.value = null;
  food_handling_certificate_file_name.value = '';
  setFieldValue('food_handling_certificate','')

  // Reset the FileUpload component's internal state
  if (food_handling_certificate_file_upload.value) {
    food_handling_certificate_file_upload.value.clear(); // This clears the selected file(s) in the FileUpload component
  }
}
function codeOfConductFileNameClearFile(setFieldValue) {
  // Clear the reactive references
  code_of_conduct_file_data.value = null;
  code_of_conduct_file_name.value = '';
  setFieldValue('code_of_conduct', '')

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
  { name: 'own', label: 'Own' },
  { name: 'lease', label: 'Lease' },
  { name: 'truck_owner', label: 'Truck owner' }
]);
const selectedPaymentType = ref(null);
// Define a reactive key based on the initialValues
const dropdownKey = ref(0);
const dropdownKeyVehicle = ref(0);
// Watch for changes in the selected driver type and update the key
watch(() => props.initialValues.driver_type, () => {
  dropdownKey.value += 1; // Increment key to force re-render

});

function handleDropdownChange(selectedValue, setFieldValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly

  // Update dropdownKey with the selected value's name
  dropdownKey.value += 1;;
  setFieldValue('driver_type', selectedValue);


  // Log dropdownKey to see if it updates
}

function handleVehicleChange(selectedValue, setFieldValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly
  console.log('Selected vehicle value:', selectedValue.name);

  // Update the field value
  setFieldValue('vehicle', selectedValue);
  dropdownKeyVehicle.value += 1;

  // Log dropdownKey to see if it updates
}
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
  codeOfConductFileNameClearFile()
  
}
const buttonLabel = computed(() => {
  // Change the label based on the value of `buttonLabelCondition`
  if (props.type === 'add') {
    return 'Add Driver';
  } else if (props.type === 'edit') {
    return 'Edit Driver';
  }
});
const fileDialogVisible = ref(false); // To control dialog visibility
const fileContent = ref(''); // To store file content for preview
const isPdf = ref(false); // To differentiate between file types
const pdfViewerContainer = ref<HTMLDivElement | null>(null);
const handleFilePreview = async (fileUrl: string) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      const content = reader.result as string;
      fileContent.value = content;
      console.log('blob.type', blob.type)

      // Check file type to determine if it's a PDF
      if (blob.type === 'application/pdf') {
        isPdf.value = true;
        // renderPdf(content);
        window.open(fileUrl, '_blank');
      } else {
        isPdf.value = false;
        fileDialogVisible.value = true;

      }

    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error fetching file:', error);
  }
};

</script>

<template>
  <div id="app">
    <Dialog v-model:visible="fileDialogVisible" header="File Preview" modal :style="{ width: '50vw' }" :closable="true">
      <img v-if="!isPdf.value" :src="fileContent" alt="File Preview" style="width: 100%; height: auto;" />
    </Dialog>
    <!-- <div v-if="loading" class="loading-container">
      <ProgressSpinner class='custom-spinner' />
    </div> -->
    <Form :loading="true" :initial-values="props.initialValues" :validation-schema="props.validationSchema"
      @submit="onSubmit" v-slot="{ values, handleSubmit, setFieldValue, errors }">
      <div class="grid ml-0 mr-0 mt-0">
        <div class="col-12">
          <div class="p-fluid formgrid grid">

            <div class="field col-12 md:col-6">

              <label for="name">Name</label>
              <Field id="name" name="name" as="InputText" :invalid="!!errors.name" :class="['p-inputtext', 'w-full']" />
              <ErrorMessage name="name" class="p-error" />
            </div>


            <div class="field col-12 md:col-6">
              <label for="phone_number">Phone Number</label>
              <Field id="phone_number" name="phone_number" as="InputText" :invalid="!!errors.phone_number"
                :class="['p-inputtext', 'w-full']" />
              <ErrorMessage name="phone_number" class="p-error" />
            </div>

            <div class="field col-12 md:col-6">
              <label for="driver_type">Driver Type</label>

              <Field id="driver_type" name="driver_type">
                <template #default="{ field, meta }">
                  <Dropdown v-model="field.value" :invalid="!!errors.driver_type"
                    @change="handleDropdownChange(field.value, setFieldValue)" :key="dropdownKey.value"
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
                  <Dropdown v-model="field.value" :invalid="!!errors.vehicle"
                    @change="handleVehicleChange(field.value, setFieldValue)" :key="dropdownKeyVehicle.value"
                    :loading="loading" :options="vechicles_options" optionLabel="label" placeholder="Select"
                    class="w-full" :class="{ 'p-invalid': meta.touched && meta.error }"
                    :style="{ borderRadius: '8px' }" />
                  <ErrorMessage name="vehicle" class="p-error mt-1" />
                </template>
              </Field>
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
                  <Calendar v-bind="field" :invalid="!!errors.code_of_conduct_expiration_date" v-model="field.value"
                    :class="['w-full', { 'p-invalid': meta.error }]" dateFormat="yy-mm-dd" showIcon />
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
                      @select="event=>handleFileChangeCodeOfConduct(event,setFieldValue)" :multiple="true" accept="image/*,application/pdf"
                      :maxFileSize="1000000" @upload="onUpload">
                    </FileUpload>
                    <Button icon="pi pi-eye" class="  p-button p-button p-button-sm"
                      @click="handleFilePreview(values.code_of_conduct)" />
                    <Button v-if="code_of_conduct_file_name" icon="pi pi-times" class="p-button p-button-sm"
                      @click="codeOfConductFileNameClearFile(setFieldValue)" aria-label="Clear" />
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
                  <Calendar v-bind="field" :invalid="!!errors.drivers_license_expiration_date" v-model="field.value"
                    :class="['w-full', { 'p-invalid': meta.error }]" dateFormat="yy-mm-dd" showIcon />
                </template>
              </Field>
              <ErrorMessage name="drivers_license_expiration_date" class="p-error" />
            </div>
            <div class="field col-12 md:col-6 pt-4">
              <Field name="drivers_license">
                <template #default="{ field }">
                  <div class=" flex w-full justify-content-start gap-3 max-w-md">
                    <FileUpload name="drivers_license" ref="drivers_license_file_upload" mode="basic"
                      @select="event=>handleFileChangeDriversLicense(event,setFieldValue)" :multiple="false" accept="image/*,application/pdf"
                      :maxFileSize="1000000" customUpload v-slot:content="{ chooseButton }">
                      <Button class="w-full p-component p-button p-button-outlined p-button-info" @click="chooseButton"
                        icon="pi pi-upload" label="Upload Drivers license" />
                    </FileUpload>
                    <Button icon="pi pi-eye" class="  p-button p-button p-button-sm"
                      @click="handleFilePreview(values.drivers_license)" />

                    <Button v-if="drivers_license_file_name" icon="pi pi-times" class=" p-button p-button p-button-sm"
                      @click="clearFileDriversLicense(setFieldValue)" aria-label="Clear" />
                  </div>
                  <ErrorMessage name="drivers_license" class="p-error" />
                </template>
              </Field>

             
            </div>
          </div>
          <h6 for="code_of_conduct">Food Handling Certificate</h6>

          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="food_handling_certificate_expiration_date">Expiration Date</label>
              <Field id="food_handling_certificate_expiration_date" name="food_handling_certificate_expiration_date">
                <template #default="{ field, meta }">
                  <Calendar v-bind="field" :invalid="!!errors.food_handling_certificate_expiration_date"
                    v-model="field.value" :class="['w-full', { 'p-invalid': meta.error }]" dateFormat="yy-mm-dd"
                    showIcon />
                </template>
              </Field>
              <ErrorMessage name="food_handling_certificate_expiration_date" class="p-error" />
            </div>
            <div class="field col-12 md:col-6 pt-4">
              <Field name="food_handling_certificate">
                <template #default="{ field }">
                  <div class=" flex w-full justify-content-start gap-3 max-w-md">
                    <FileUpload name="food_handling_certificate" ref="food_handling_certificate_file_upload"
                      mode="basic" @select="event => handleFileChange(event, setFieldValue)" :multiple="false" @uploader="onUpload"
                      accept="image/*,application/pdf" :maxFileSize="1000000" customUpload
                      v-slot:content="{ chooseButton }">
                      <Button class="w-full p-component p-button p-button-outlined p-button-info" @click="chooseButton"
                        icon="pi pi-upload" label="Upload Code of Conduct" />
                    </FileUpload>

                    <Button icon="pi pi-eye" class="  p-button p-button p-button-sm"
                      @click="handleFilePreview(values.food_handling_certificate)" />
                    <Button v-if="food_handling_certificate_file_name" icon="pi pi-times"
                      class=" p-button p-button p-button-sm" @click="clearFile(setFieldValue)" aria-label="Clear" />
                  </div>

                  <ErrorMessage name="food_handling_certificate" class="p-error" />
                </template>
              </Field>

              
            </div>
          </div>


        </div>
      </div>
      <!-- Sticky footer for buttons -->
      <div class="form-footer">
        <div class="flex gap-3 justify-content-end">
          <Button label="Cancel" @click="props.close" icon="pi pi-times" class="p-button-outlined" />
          <Button :label="buttonLabel" icon="pi pi-plus" type="submit" />
        </div>
      </div>


    </Form>

  </div>
</template>

<style scoped>
/* Center the ProgressSpinner spinner */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Adjust as needed */
}

.custom-spinner .p-progress-spinner {
  color: black !important;
  /* Set color to black */
  width: 50px;
  /* Set width to a smaller size */
  height: 50px;
  /* Set height to a smaller size */
}

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
