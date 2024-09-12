<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import { LogisticsService } from '../../../service/LogisticsService';
import { useRouter } from 'vue-router';
// import { InputText } from 'primevue/inputtext';
// import { Button } from 'primevue/button';
// import { Row, Column } from 'primevue/row';

// Define props to accept the close function
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
// Define validation schema using yup

onMounted(async () => {

  console.log('initialValues', props.initialValues)
  try {
    const response = await new LogisticsService().fetchVehicleOwnerList();
    console.log('started')
    // Assuming response.data is an array of options
    vechicles_options.value = response.map((optn) => ({
      name: optn.id,
      label: optn.name
    }));
  } catch (error) {
    console.error('Error fetching options:', error);
  } finally {
    loading.value = false; // Set loading to false after data is fetched
  }
});
function onSubmit(values) {
  // Create FormData and append form values
  const formData = new FormData();
  Object.keys(values).forEach(key => {
    formData.append(key, values[key]);
  });
  // Append file if available
  if (food_handling_certificate_file_data.value) {
    values.food_handling_certificate = food_handling_certificate_file_data.value;
  }
  if (code_of_conduct_file_data.value) {
    formData.code_of_conduct = code_of_conduct_file_data.value;
  }
  if (drivers_license_file_data.value) {
    formData.drivers_license = drivers_license_file_data.value;
  }



  props.handleSubmit(values)
}
const toast = useToast();

const food_handling_certificate_file_upload = ref();
const food_handling_certificate_file_data = ref(null);
const food_handling_certificate_file_name = ref('');
const radioValue = ref(null);
const statusValue = ref(null);
const router = useRouter();


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
  { name: 'owned', label: 'Own' },
  { name: 'lease', label: 'Lease' },
  { name: 'truck_owner', label: 'Truck owner' }
]);
const vehicleTypes = ref([
  { name: 'boda_boda', label: 'Boda Boda' },
  { name: 'closed_box_truck', label: 'Close Box Truck' },
  { name: 'open_pickup_truck', label: 'Open Pickup Truck' },
  { name: 'closed_pickup_truck', label: 'Closed Pickup Truck' },
  { name: 'closed_van', label: 'Closed Van' }
]);
const leaseRates = ref([
  { name: 'per_day', label: 'Per Day' },
  { name: 'weekly', label: 'Weekly' },
  { name: 'monthly', label: 'Monthly' }
]);
const pickups = ref([
  { name: 'send_money', label: 'Send Money' },
  { name: 'paybill', label: 'Pay Bill' },
  { name: 'buy_goods', label: 'Buy Goods' }
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
  setFieldValue('ownership', selectedValue);


  // Log dropdownKey to see if it updates
}
function handleDropdownLeaseChange(selectedValue, setFieldValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly

  // Update dropdownKey with the selected value's name
  dropdownKey.value += 1;;
  setFieldValue('lease_rate', selectedValue);


  // Log dropdownKey to see if it updates
}
function handleDropdownMpesaPaybillChange(selectedValue, setFieldValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly

  // Update dropdownKey with the selected value's name
  dropdownKey.value += 1;;
  setFieldValue('mpesa_paybill', selectedValue);


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

function handleVehicleOwnerChange(selectedValue, setFieldValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly
  console.log('Selected vehicle value:', selectedValue.name);

  // Update the field value
  setFieldValue('owner', selectedValue);
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
  console.log('props.type', props.type)
  // Change the label based on the value of `buttonLabelCondition`
  if (props.type === 'add') {
    return 'Add Vehicle';
  } else if (props.type === 'edit') {
    return 'Edit Vehicle';
  }
});
const navigateBack = () => {
  // Change the label based on the value of `buttonLabelCondition`
  router.push('/logistics/vehicles')
};
</script>

<template>

  <div>
    <!-- <div v-if="loading" class="loading-container">
      <ProgressSpinner class='custom-spinner' />
    </div> -->
    <Form :loading="false" :initial-values="props.initialValues" :validation-schema="props.validationSchema"
      @submit="onSubmit" v-slot="{ values, handleSubmit, setFieldValue }">
      <div class="flex justify-content-between mb-2 "   >
        <h5>{{ buttonLabel }}</h5>
        <div class="flex gap-3 justify-content-end">
          <Button label="Cancel" @click="navigateBack" icon="pi pi-times" class="p-button-outlined" />
          <Button :label="buttonLabel" icon="pi pi-plus" type="submit" />
        </div>
      </div>


      <Fluid>
        <div class="grid">
          <div class="col-12 md:col-8">
            <div class="card p-fluid">
              <h5 :style="{ color: 'gray', 'font-size': 'medium' }">Primary Details</h5>
              <div class="formgrid grid">
                <div class="field col-12 md:col-6">

                  <label for="registration_number">Registration</label>
                  <Field id="registration_number" name="registration_number" as="InputText"
                    :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="registration_number" class="p-error" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="driver_type">Ownership </label>

                  <Field id="ownership" name="ownership">
                    <template #default="{ field, meta }">
                      <Dropdown v-model="field.value" @change="handleDropdownChange(field.value, setFieldValue)"
                        :key="dropdownKey.value" :options="driverTypes" optionLabel="label" placeholder="Select"
                        class="w-full" :class="{ 'p-invalid': meta.touched && meta.error }"
                        :style="{ borderRadius: '8px' }" />
                      <ErrorMessage name="ownership" class="p-error mt-1" />
                    </template>
                  </Field>
                </div>

              </div>
              <div class="formgrid grid">
                <div class="field col-12 md:col-6">
                  <label for="owner">Owner</label>
                  <!-- <Field id="vehicle" name="vehicle" as="InputText" :class="['p-inputtext', 'w-full']" /> -->
                  <Field id="owner" name="owner">
                    <template #default="{ field, meta }">
                      <Dropdown v-model="field.value" @change="handleVehicleOwnerChange(field.value, setFieldValue)"
                        :key="dropdownKeyVehicle.value" :loading="loading" :options="vechicles_options"
                        optionLabel="label" placeholder="Select" class="w-full"
                        :class="{ 'p-invalid': meta.touched && meta.error }" :style="{ borderRadius: '8px' }" />
                      <ErrorMessage name="owner" class="p-error mt-1" />
                    </template>
                  </Field>
                </div>
                <div class="field col-12 md:col-6">
                  <label for="phone_number">Contact Number</label>
                  <Field id="phone_number" name="phone_number" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="phone_number" class="p-error" />
                </div>

              </div>

            </div>

            <div class="card p-fluid">
              <h5>Vehicle Details </h5>
              <div class="formgrid grid">
                <div class="field col-12 md:col-6">
                  <label for="vehicle">Vehicle</label>
                  <!-- <Field id="vehicle" name="vehicle" as="InputText" :class="['p-inputtext', 'w-full']" /> -->
                  <Field id="vehicle" name="vehicle">
                    <template #default="{ field, meta }">
                      <Dropdown v-model="field.value" @change="handleVehicleChange(field.value, setFieldValue)"
                        :key="dropdownKeyVehicle.value" :options="vehicleTypes" optionLabel="label" placeholder="Select"
                        class="w-full" :class="{ 'p-invalid': meta.touched && meta.error }"
                        :style="{ borderRadius: '8px' }" />
                      <ErrorMessage name="vehicle" class="p-error mt-1" />
                    </template>
                  </Field>
                  <!-- <ErrorMessage name="vehicle" class="p-error" /> -->
                </div>
                <div class="field col-12 md:col-6">
                  <label for="load_capacity">Load Capacity </label>
                  <Field id="load_capacity" name="load_capacity" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="load_capacity" class="p-error" />
                </div>
                <div class="field col-12 md:col-12">
                  <label for="tank_capacity">Tank Capacity </label>
                  <Field id="tank_capacity" name="tank_capacity" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="tank_capacity" class="p-error" />
                </div>
              </div>
            </div>
            <div class="card p-fluid">
              <h5>On Demand Vehicle </h5>
              <div class="formgrid grid">

                <div class="field col-12 md:col-12">
                  <label for="ksh_km">Ksh/KM </label>
                  <Field id="ksh_km" name="ksh_km" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="ksh_km" class="p-error" />
                </div>

              </div>
            </div>
            <div class="card p-fluid">
              <h5>Lease Details </h5>
              <div class="formgrid grid">
                <div class="field col-12 md:col-6">
                  <label for="lease_rate">Rate </label>

                  <Field id="lease_rate" name="lease_rate">
                    <template #default="{ field, meta }">
                      <Dropdown v-model="field.value" @change="handleDropdownLeaseChange(field.value, setFieldValue)"
                        :key="dropdownKey.value" :options="leaseRates" optionLabel="label" placeholder="Select"
                        class="w-full" :class="{ 'p-invalid': meta.touched && meta.error }"
                        :style="{ borderRadius: '8px' }" />
                      <ErrorMessage name="lease_rate" class="p-error mt-1" />
                    </template>
                  </Field>
                </div>
                <!-- <div class="field col-12 md:col-6">
                  <label for="lease_rate">Rate </label>
                  <Field id="lease_rate" name="lease_rate" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="lease_rate" class="p-error" />
                </div> -->
                <div class="field col-12 md:col-6">
                  <label for="lease_cost">Lease cost </label>
                  <Field id="lease_cost" name="lease_cost" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="lease_cost" class="p-error" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="lease_expiration_date">Lease Expiration Date</label>
                  <Field id="lease_expiration_date" name="lease_expiration_date">
                    <template #default="{ field, meta }">
                      <Calendar v-bind="field" v-model="field.value" :class="['w-full', { 'p-invalid': meta.error }]"
                        dateFormat="yy-mm-dd" showIcon />
                    </template>
                  </Field>
                  <ErrorMessage name="lease_expiration_date" class="p-error" />
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
            </div>
            <div class="card p-fluid">
              <h5 :style="{ color: 'gray', 'font-size': 'medium' }">Payment Details</h5>
              <div class="grid pb-0">
                <div class="col-12 md:col-4">
                  <div class="field-radiobutton mb-0">
                    <RadioButton id="option1" name="option" value="activa" v-model="radioValue" />
                    <label for="option1">MPesa</label>
                  </div>
                </div>
                <div class="col-12 md:col-4">
                  <div class="field-radiobutton mb-0">
                    <RadioButton id="option2" name="option" value="inactive" v-model="radioValue" />
                    <label for="option2">Bank Transfer</label>
                  </div>
                </div>
              </div>

              <div class="formgrid grid">
                <!-- <div class="field col-12 md:col-6">
                  <label for="mpesa_paybill">Send Money/Paybill Number/Buy Goods</label>
                  <Field id="mpesa_paybill" name="mpesa_paybill" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="mpesa_paybill" class="p-error" />
                </div> -->
                <div class="field col-12 md:col-6">
                  <label for="mpesa_paybill">Send Money/Paybill Number/Buy Goods </label>

                  <Field id="mpesa_paybill" name="mpesa_paybill">
                    <template #default="{ field, meta }">
                      <Dropdown v-model="field.value"
                        @change="handleDropdownMpesaPaybillChange(field.value, setFieldValue)" :key="dropdownKey.value"
                        :options="pickups" optionLabel="label" placeholder="Select" class="w-full"
                        :class="{ 'p-invalid': meta.touched && meta.error }" :style="{ borderRadius: '8px' }" />
                      <ErrorMessage name="mpesa_paybill" class="p-error mt-1" />
                    </template>
                  </Field>
                </div>
                <div class="field col-12 md:col-6">
                  <label for="payment_details_phone_number">Phone Number</label>
                  <Field id="payment_details_phone_number" name="payment_details_phone_number" as="InputText"
                    :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="payment_details_phone_number" class="p-error" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="bank">Bank </label>
                  <Field id="bank" name="bank" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="bank" class="p-error" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="branch">Branch </label>
                  <Field id="branch" name="branch" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="branch" class="p-error" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="account_number">Account Number </label>
                  <Field id="account_number" name="account_number" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="account_number" class="p-error" />
                </div>
                <div class="field col-12 md:col-6">
                  <label for="account_name">Account Name </label>
                  <Field id="account_name" name="account_name" as="InputText" :class="['p-inputtext', 'w-full']" />
                  <ErrorMessage name="account_name" class="p-error" />
                </div>

              </div>

            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="card p-fluid" :style="{}">
              <h5 :style="{ color: 'gray', 'font-size': 'medium' }">Vehicle status</h5>
              <div class="grid pb-0">
                <div class="col-12 md:col-4">
                  <div class="field-radiobutton mb-0">
                    <RadioButton id="option1" name="option" value="activa" v-model="statusValue" />
                    <label for="option1">Active</label>
                  </div>
                </div>
                <div class="col-12 md:col-4">
                  <div class="field-radiobutton mb-0">
                    <RadioButton id="option2" name="option" value="inactive" v-model="statusValue" />
                    <label for="option2">Inactive</label>
                  </div>
                </div>
              </div>

            </div>
            {{ console.log('ownership', values) }}
            <div class="card" :style="{ 'margin-top': '-14px' }">
              <h5 :style="{ color: 'gray', 'font-size': 'medium' }">Vehicle </h5>
              <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#808080' }">Registration</div>
                  <div>{{ values ? values.registration_number : '' }}</div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#808080' }">Type</div>
                  <div>{{ values ? values.ownership?.label : '' }} </div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#808080' }">Owner</div>
                  <div>{{ values ? values?.owner?.label : '' }} </div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#808080' }">Contact Number</div>
                  <div> {{ values ? values?.phone_number : '' }}</div>
                </div>
              </div>
              <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
              <h5 :style="{ 'color': '#122C20' }">Vehicle Details</h5>
              <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Vehicle Type</div>
                  <div>{{ values ? values?.vehicle?.label : '' }}</div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Load Capacity</div>
                  <div>{{ values?.load_capacity ? values?.load_capacity + ' KG' : '' }}</div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Tanks Capacity</div>
                  <div>{{ values?.tank_capacity ? values?.tank_capacity + ' Liters' : '' }}</div>
                </div>

              </div>
              <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
              <h5 :style="{ 'color': '#122C20' }">On Demand Cost</h5>
              <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Ksh / KM</div>
                  <div>{{ values ? values.ksh_km : '' }}</div>
                </div>

              </div>
              <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
              <h5>Lease Details </h5>
              <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Lease Terms</div>
                  <div>{{ values ? values.lease_terms : '' }}</div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Rate</div>
                  <div>{{ values ? values.lease_rate : '' }}</div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Lease Cost</div>
                  <div>{{ values ? values.lease_cost : '' }}</div>
                </div>
              </div>
              <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
              <h5>Payment Details</h5>
              <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">MPesa/Paybill</div>
                  <div>{{ values ? values?.mpesa_paybill : '' }} </div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Paybill Account</div>
                  <div>01234846</div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Bank </div>
                  <div>{{ values ? values?.bank : '' }} </div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Branch </div>
                  <div>{{ values ? values?.branch : '' }}</div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Account Name </div>
                  <div>{{ values ? values?.account_name : '' }} </div>
                </div>
                <div class="flex justify-content-between">
                  <div :style="{ 'font-color': '#F6F6F6' }">Account Number </div>
                  <div>{{ values ? values?.account_number : '' }}</div>
                </div>
              </div>
            </div>

          </div>


        </div>
      </Fluid>

      <!-- Sticky footer for buttons -->
      <!-- <div class="form-footer">
        <div class="flex gap-3 justify-content-end">
          <Button label="Cancel" @click="props.close" icon="pi pi-times" class="p-button-outlined" />
          <Button :label="buttonLabel" icon="pi pi-plus" type="submit" />
        </div>
      </div> -->


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

.form-header {
  background: white;
  z-index: 99;
  width: 100%;
  padding: 15px;
  position: fixed;
  top: 1;
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
