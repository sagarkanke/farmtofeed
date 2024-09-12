<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import {useRouter} from 'vue-router';
import { CompanyService } from '@/service/CompanyService';
import { v4 as uuidV4 } from 'uuid';
import * as yup from 'yup';
const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);
const center = ref({
    lat: 51.093048,  // Example latitude
    lng: 6.842120  // Example longitude
})
const router = new useRouter();
const zoom = ref(10); // Zoom level
const markerPosition = ref({ lat: 40.7128, lng: -74.0060 }); // Marker position
const selectedLocation = ref({ name: '' }); // To store location details
const businessCategories = ref([
    { name: 'school', label: 'School/Feeding Program' },
    { name: 'hotel', label: 'Hotel/Restautant' },
    { name: 'caterer', label: 'Caterer' },
    { name: 'foodProcessor', label: 'Food Processor' },
    { name: 'retail', label: 'Retail' },
    { name: 'ftff', label: 'FTFF' },
    { name: 'ftf', label: 'Farm To Feed' },
    { name: 'other', label: 'Other' }
]);
const toast = useToast();
const customerList = ref([
    { name: 'Alice Johnson', label: 'Alice Johnson' },
    { name: 'Bob Smith', label: 'Bob Smith' },
    { name: 'Catherine Brown', label: 'Catherine Brown' },
    { name: 'David Wilson', label: 'David Wilson' },
    { name: 'Ella Garcia', label: 'Ella Garcia' },
    { name: 'Frank White', label: 'Frank White' },
    { name: 'Grace Taylor', label: 'Grace Taylor' },
    { name: 'Henry Martinez', label: 'Henry Martinez' },
    { name: 'Ivy Anderson', label: 'Ivy Anderson' },
    { name: 'Jack Thomas', label: 'Jack Thomas' }
]);
const paymentTypes = ref([
    { name: 'cash', label: 'Cash' },
    { name: 'credit', label: 'Credit' }
]);
const deliveryLocations = ref([
    { name: 'headquarter1', label: 'Headquarters 1' },
    { name: 'headquarter2', label: 'Headquarters 2' },
    { name: 'headquarter3', label: 'Headquarters 3' }
]);
const deliveryMethods = ref([
    { name: 'pickUpFromWarehouse', label: 'Pick up from warehouse' },
    { name: 'regularDelivery', label: 'Regular delivery' }
]);
const deliveryWindows = ref([
    { name: '1', label: '6am - 9am' },
    { name: '2', label: '9am - 12 pm' },
    { name: '3', label: '1pm - 4 pm' }
]);
const gradeFilters = ref([
    { name: '1', label: 'Grade 1' },
    { name: '2', label: 'Grade Rescue' }
]);
const filters = ref({});
const dropdownItem = ref(null);
const selectedCustomer = ref(null);
const today = new Date();
const companyService = new CompanyService();
const calenderValue = ref(today);
const selectedPaymentType = ref(null);
const selectedDeliveryLocation = ref(null);
const selectedDeliveryMethod = ref(null);
const selectedDeliveryWindow = ref(null);
const deliveryDate = ref(null);
const productDialog = ref(false);
const deliveryAddrDialog = ref(false);
const products = ref(null);
const product = ref({});
const submitted = ref(false);
const selectedGradeFilter = ref(null);
const selectedProducts = ref(null);
const orderNotes = ref(null);
const selectedItemsArray = ref([]);
const radioValue = ref(null);
const checkboxValue = ref([]);
const addNewUserDialog = ref(false);
const selectedBusinessName = ref(null);
const selectedBusinessCategory = ref(null);
const selectedEmail = ref(null);
const selectedPhone = ref(null);
const selectedOwner = ref(null);
const selectedPersonName = ref(null);
const selectedLastName = ref(null);
const contactPersonEmail = ref(null);
const contactPersonPhone = ref(null);
const designation = ref(null);
const billingAddress = ref(null);
const billingPostalCode = ref(null);
const billingCity = ref(null);
const kraPin = ref(null);
const deliveryDetails = ref([]);
const userDetails = ref([]);
const customerProfile = ref(null);
const tableData = ref([
    { sku: 1, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 2, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 3, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 4, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 5, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 6, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 }
    // Add more static data as needed
]);
const productService = new ProductService();
const leadList = ref([]);
const dropdownKey = ref(0);
const userList = ref([]);
const selectedLead = ref(null);
const userFirstName = ref();
const userLastName = ref();
const userEmail = ref();
const userMobile = ref();
const userDesignation = ref();
const selectedUsers = ref([]);
const dropdownLeadKey = ref(0);
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {

});


const validationSchema = yup.object({
    selectedBusinessName: yup.string().required('Business Name is required'),
    selectedPersonName: yup.string().required('Contact Person Name is required'),
    selectedLastName: yup.string().required('Contact Person Name is required'),
    contactPersonEmail: yup.string().email('Email must be a valid email').required('Email is required'),
    designation: yup.string().required('Designation is required'),
    billingAddress: yup.string().required('Address is required'),
    billingPostalCode: yup.number().required('Postal is required'),
    billingCity: yup.string().required('City is required'),
    kraPin: yup.string().required('KRA Pin is required'),
    contactPersonPhone: yup
        .string()
        .matches(/^[0-9]+$/, 'Phone number must be only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
    selectedPhone: yup
        .string()
        .matches(/^[0-9]+$/, 'Phone number must be only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
    businessCategories: yup.object().required('Business Category is required'),
    leadList: yup.object(),
    selectedEmail: yup.string().email('Email must be a valid email').required('Email is required'),
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const getDropdownValue = () => {
    console.log('Printing selected customer ', selectedCustomer.value.label);
};

const getBadgeSeverity = (inventoryStatus) => {
    console.log(inventoryStatus)
    switch (inventoryStatus.toLowerCase()) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'warning';
        default:
            return 'info';
    }
};

const formattedDate = computed(() => {
    if (!calenderValue.value) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return calenderValue.value.toLocaleDateString(undefined, options);
});

const addNewLineItem = () => {
    product.value = [];
    submitted.value = false;
    productDialog.value = true;
};

const addNewUser = () => {
    console.log("addNewUser called")
    addNewUserDialog.value = true;
};

const addUser = () => {
    console.log('selectedProducts ', selectedProducts);
    userList.value.push({
        id: uuidV4(),
        name: userFirstName.value + ' ' + userLastName.value,
        email: userEmail.value,
        phone: userMobile.value,
        designation: userDesignation.value,
        status: "active",
        lastSignedIn: ""
    });

    console.log("userList", userList.value)

    hideUserDialog()
    userFirstName.value = null,
        userLastName.value = null,
        userMobile.value = null,
        userEmail.value = null,
        userDesignation.value = null
};

const addNewDeliveryAddress = () => {

}
const addDeliveryAddress = () => {
    console.log(" addDeliveryAddress called ")
    // product.value = [];
    // submitted.value = false;
    deliveryAddrDialog.value = true;
}
const exportCSV = () => {
    dt.value.exportCSV();
};

const createNewCompany = async (values) => {
    console.log("values ", values);
    try {
        console.log(" selectedBusinessCategory.value, ",  selectedBusinessCategory.value,)
        const payload = {
            "name": selectedBusinessName.value,
            "category": selectedBusinessCategory.value?.name || 'Hotel/Restaurant',
            "email": selectedEmail.value,
            "phone": selectedPhone.value,
            "lead_owner": 1,
            "contact_person_name": selectedPersonName.value,
            "contact_person_email": contactPersonEmail.value,
            "contact_person_phone": contactPersonPhone.value,
            "contact_person_designation": designation.value,
            "kra_pin": kraPin.value,
            user: userList.value,
            "billing_details": {
                "address": billingAddress.value,
                "postal_code": billingPostalCode.value,
                "city": billingCity.value
            }
        }
        console.log("Pyaload ", payload);
        const data = await companyService.createCompany(payload);
        console.log("data ", data);
        if (data) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Customer created successfully!', life: 3000 });
            // Reset form fields
              router.push('/sales/customers')
            resetFormFields();
          
        }



    } catch (e) {
        console.log("Error ", e);
        toast.add({ severity: 'error', summary: 'Error', detail: e, life: 3000 });

    }
}

const hideUserDialog = () => {
    addNewUserDialog.value = false;
}

function resetFormFields() {
    selectedBusinessName.value = null;
    selectedBusinessCategory.value = null;
    selectedEmail.value = null;
    selectedPhone.value = null;
    selectedPersonName.value = null;
    contactPersonEmail.value = null;
    contactPersonPhone.value = null;
    designation.value = null;
    billingAddress.value = null;
    billingCity.value = null;
    billingPostalCode.value = null;
    kraPin.value = null;
}

const deleteUser = () => {
    console.log("Selected users", selectedUsers.value);
    const idsToRemove = new Set(selectedUsers.value.map(item => item.id));
    console.log("idsToRemove ", idsToRemove);

    userList.value = userList.value.filter(user => !idsToRemove.has(user.id));
    console.log("updatedUserList ", updatedUserList);

}
const onMapClick = async (event) => {
    const latLng = event.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();

    // Update the map center and marker position
    center.value = { lat, lng };
    markerPosition.value = { lat, lng };

    // Get the place name and update selectedLocation
    const placeName = await getPlaceName(lat, lng);
    selectedLocation.value = { lat, lng, name: placeName };
    console.log("selectedLocation.value ", selectedLocation.value)
}

const getPlaceName = async (lat, lng) => {
    const apiKey = import.meta.env.VITE_APP_GOOGLE_API_KEY; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("data ", data);
        if (data.results.length > 0) {
            return data.results[0].formatted_address; // Return the formatted address
        } else {
            return 'No address found';
        }
    } catch (error) {
        console.error('Error fetching place name:', error);
        return 'Error fetching address';
    }
}


const searchPlaces = () => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request = {
        location: new google.maps.LatLng(center.value.lat, center.value.lng),
        radius: 5000, // Search within 5 km
        query: searchQuery.value, // User input for searching places
    };

    // Perform the search
    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            places.value = results; // Store the results
        } else {
            console.error('Place Search failed:', status);
        }
    });
};

function handleDropdownChange(selectedValue, setFieldValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly

  // Update dropdownKey with the selected value's name
  dropdownKey.value += 1;
  selectedBusinessCategory.value = selectedValue.name;
//   setFieldValue('selectedBusinessCategory', selectedValue);

  console.log("selectedValue ", selectedValue.name);
console.log("selectedBusinessCategory ", selectedBusinessCategory.value);
  // Log dropdownKey to see if it updates
}

function handleDropdownForLeadList(selectedValue, setFieldValue) {
  // Log the selected value's 'name' to ensure it's being passed correctly

  // Update dropdownKey with the selected value's name
  dropdownLeadKey.value += 1;;
  setFieldValue('selectedLead', selectedValue);


  // Log dropdownKey to see if it updates
}


</script>

<template>
    <div class="flex justify-content-between">
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem' }">New Customer</h5>
        <div :style="{ 'margin-left': '30px' }">
            <Button type="button" label="Save Customer" icon="pi pi-save" @click="createNewCompany()"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"></Button>
        </div>

    </div>

    <div class="grid" :style="{ 'margin-left': '-2rem' }">
        <div class="col-12 md:col-8">
            <Form :validationSchema="validationSchema" :handleSubmit="createNewCompany" v-slot="{ values, createNewCompany, setFieldValue, errors }">
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Business Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Business
                                Name</label>
                                <Field id="selectedBusinessName" name="selectedBusinessName" as="InputText" :invalid="!!errors.selectedBusinessName" :class="['p-inputtext', 'w-full']"  v-model="selectedBusinessName"/>
                            <ErrorMessage name="selectedBusinessName" class="p-error" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Business
                                Category</label>
                                <Field id="businessCategories" name="businessCategories">
                                    <template #default="{ field, meta }">
                                      <Dropdown v-model="field.value" :invalid="!!errors.businessCategories"
                                        @change="handleDropdownChange(field.value, setFieldValue)" :key="dropdownKey.value"
                                        :options="businessCategories" optionLabel="label" placeholder="Select" class="w-full"
                                        :class="{ 'p-invalid': meta.touched && meta.error }" :style="{ borderRadius: '8px' }" />
                                      <ErrorMessage name="businessCategories" class="p-error mt-1" />
                                    </template>
                                  </Field>
                            <!-- <Dropdown id="paymentType" :style="{ borderRadius: '8px' }"
                                v-model="selectedBusinessCategory" :options="businessCategories" optionLabel="label"
                                required placeholder="Select" /> -->
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Email</label>
                                <Field id="selectedEmail" name="selectedEmail" as="InputText" :invalid="!!errors.selectedEmail" :class="['p-inputtext', 'w-full']"  v-model="selectedEmail"/>
                                <ErrorMessage name="selectedEmail" class="p-error" />
    
                            <!-- <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" required
                                v-model="selectedEmail" class="p-error mt-1" aria-describedby="username-help" /> -->
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone
                                Number</label>
                                <Field id="selectedPhone" name="selectedPhone" as="InputText" :invalid="!!errors.selectedPhone" :class="['p-inputtext', 'w-full']"  v-model="selectedPhone"/>
                                <ErrorMessage name="selectedPhone" class="p-error" />
`                        </div>
                    </div>

                    <!-- Third Row -->
                    <div>
                        <div class="field flex-1 flex flex-column col-6" :style="{ 'margin-top': '-10px' }">
                            <label for="orderNotes" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Lead
                                Owner</label>
                                <Field id="businessCategories" name="businessCategories">
                                    <template #default="{ field, meta }">
                                      <Dropdown v-model="field.value" :invalid="!!errors.leadList"
                                        @change="handleDropdownForLeadList(field.value, setFieldValue)" :key="dropdownLeadKey.value"
                                        :options="leadList" optionLabel="label" placeholder="Select" class="w-full"
                                        :class="{ 'p-invalid': meta.touched && meta.error }" :style="{ borderRadius: '8px' }" />
                                      <ErrorMessage name="leadList" class="p-error mt-1" />
                                    </template>
                                  </Field>
                           
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Contact Person</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">

                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">First
                                Name</label>
                                <Field id="selectedPersonName" name="selectedPersonName" as="InputText" :invalid="!!errors.selectedPersonName" :class="['p-inputtext', 'w-full']"  v-model="selectedPersonName"/>
                                <ErrorMessage name="selectedPersonName" class="p-error" />
                            
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }"> Last Name
                            </label>
                            <Field id="selectedLastName" name="selectedLastName" as="InputText" :invalid="!!errors.selectedLastName" :class="['p-inputtext', 'w-full']"  v-model="selectedLastName"/>
                            <ErrorMessage name="selectedLastName" class="p-error" />
                            
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Email</label>
                                <Field id="contactPersonEmail" name="contactPersonEmail" as="InputText" :invalid="!!errors.contactPersonEmail" :class="['p-inputtext', 'w-full']"  v-model="contactPersonEmail"/>
                                <ErrorMessage name="contactPersonEmail" class="p-error" /> 
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone
                                Number</label>
                                <Field id="contactPersonPhone" name="contactPersonPhone" as="InputText" :invalid="!!errors.contactPersonPhone" :class="['p-inputtext', 'w-full']"  v-model="contactPersonPhone"/>
                                <ErrorMessage name="contactPersonPhone" class="p-error" /> 
                           
                        </div>
                    </div>

                    <!-- Third Row -->
                    <div>
                        <div class="field flex-1 flex flex-column col-6" :style="{ 'margin-top': '-10px' }">
                            <label for="orderNotes"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Designation</label>
                                <Field id="designation" name="designation" as="InputText" :invalid="!!errors.designation" :class="['p-inputtext', 'w-full']"  v-model="designation" aria-placeholder="e.g Procurement Manager"/>
                                <ErrorMessage name="designation" class="p-error" /> 
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Billing Details</h5>
                <div :style="{ 'margin-left': '-22px' }">

                    <div class="flex flex-column col-12">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Business
                                Name</label>
                                <Field id="selectedBusinessName" name="selectedBusinessName" as="InputText" :invalid="!!errors.selectedBusinessName" :class="['p-inputtext', 'w-full']"  v-model="selectedBusinessName" />
                                <ErrorMessage name="selectedBusinessName" class="p-error" /> 
                        
                        </div>
                    </div>
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Address (P.O
                                Box)</label>
                                <Field id="billingAddress" name="billingAddress" as="InputText" :invalid="!!errors.billingAddress" :class="['p-inputtext', 'w-full']"  v-model="billingAddress"  aria-placeholder="e.g 123456"  />
                                <ErrorMessage name="billingAddress" class="p-error" /> 

                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Postal
                                Code</label>
                                <Field id="billingPostalCode" name="billingPostalCode" as="InputText" :invalid="!!errors.billingPostalCode" :class="['p-inputtext', 'w-full']"  v-model="billingPostalCode"  />
                                <ErrorMessage name="billingPostalCode" class="p-error" /> 

                 
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">City</label>
                                <Field id="billingCity" name="billingCity" as="InputText" :invalid="!!errors.billingCity" :class="['p-inputtext', 'w-full']"  v-model="billingCity"  aria-placeholder="e.g Nairobi" />
                                <ErrorMessage name="billingPostbillingCityalCode" class="p-error" /> 

                           
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex flex-column" :style="{ 'width': '60%' }">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">KRA
                                Pin</label>
                                <Field id="kraPin" name="kraPin" as="InputText" :invalid="!!errors.kraPin" :class="['p-inputtext', 'w-full']"  v-model="kraPin"  />
                                <ErrorMessage name="kraPin" class="p-error" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column" :style="{ 'align-self': 'end' }">
                            <Button type="button" label="Upload KRA CERTIFICATE" icon="pi pi-upload"
                                :style="{ 'background-color': '#DFEDDF', border: '1px solid #DFEDDF', 'color': '#333333', 'border-radius': '8px' }"></Button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Delivery Addresses</h5>
                <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    :style="{ 'margin-left': '-10px' }">
                    <template #header>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-10px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <Button type="button" label="Delete" icon="pi pi-trash"
                                    :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', 'color': '#C80000' }"
                                    @click="exportCSV($event)"></Button>
                                <Button type="button" label="Add Delivery Address" icon="pi pi-plus"
                                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35', 'color': 'white' }"
                                    @click="addDeliveryAddress()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order No.</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="location" header="Location" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Customer</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="contactPerson" header="Contact Person" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order Date</span>
                            <img :src="'/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image"
                                class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="phoneNumber" header="Phone Number" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{
                                slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column>
                    <Column field="default" header="Default" :sortable="true" headerStyle="width:14%; min-width:8rem;">/
                        <InputSwitch v-model="switchValue" />
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body>
                            <Button icon="pi pi-trash" type="button" class="p-button-text"
                                :style="{ 'color': 'red' }"></Button>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deliveryAddrDialog" :style="{ width: '650px', height: '430px' }" :modal="true"
                    class="p-fluid">
                    <template #header>
                        <div class="dialog-header">
                            <i class="pi pi-plus" :style="{ 'margin-right': '8px', color: '#122C20' }"></i>
                            <span :style="{ color: '#122C20', 'font-size': '18px', 'font-weight': '700' }">Add Delivery
                                Address</span>
                        </div>
                    </template>
                    <div :style="{ 'margin-top': '-1px' }">
                        <span :style="{ color: '#122C20', 'font-size': '14px', 'font-weight': '700' }">Location</span>
                    </div>
                    <div :style="{ 'margin-top': '10px', 'margin-left': '-2px' }">
                        <div>
                            <IconField iconPosition="left" class="block mt-1 md:mt-0 w-full">
                                <InputIcon class="pi pi-search w-full" />
                                <InputText class="w-full" v-model="filters['global'].value" id="autocomplete-input"
                                    placeholder="Pin Location" />
                            </IconField>
                        </div>
                    </div>

                    <div class="card mt-2" :style="{ height: '200px', paddingLeft: '0', paddingRight: '0' }">
                        
                        <GMapMap :center="center" :zoom="10"       map-type-id="terrain"
                        style="height: 100%;" @click="onMapClick">
                            <GMapMarker :position="center" />
                        </GMapMap>
                    </div>
                    <div class="grid" :style="{ 'margin-left': '0px' }">
                        <div class="flex justify-content-between gap-2">
                            <div>
                                <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Contact
                                    Person</label>
                                <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                    class="p-error mt-1" placeholder="Name" aria-describedby="username-help" />
                            </div>
                            <div>
                                <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone
                                    Number</label>
                                <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                    class="p-error mt-1" placeholder="Phone" aria-describedby="username-help" />
                            </div>
                        </div>
                    </div>

                    <div class="grid mt-3" :style="{ 'margin-left': '15px' }">
                        <div>
                            <div class="field-checkbox mb-0">
                                <Checkbox id="checkOption1" name="option" value="Set as default address"
                                    v-model="checkboxValue" />
                                <label for="checkOption1">Set as default address</label>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-content-end gap-2 ml-5">
                        <Button type="button" label="Cancel" icon="pi pi-times"
                            :style="{ 'background-color': '#DFEDDF', border: ' 1px solid #DFEDDF', width: '120px', 'color': '#122C20', 'border-radius': '8px' }"
                            @click="exportCSV($event)"></Button>
                        <Button type="button" label="Add Delivery Address" icon="pi pi-plus"
                            :style="{ 'background-color': '#1E4A35', border: '#1E4A35', width: '200px', 'border-radius': '8px' }"
                            @click="addNewDeliveryAddress()"></Button>
                    </div>
                </Dialog>

            </div>

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Users</h5>
                <DataTable :value="userList" v-model:selection="selectedUsers" dataKey="id" :paginator="true" :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    :style="{ 'margin-left': '-10px' }">
                    <template #header>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-10px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <Button type="button" label="Delete" icon="pi pi-trash"
                                    :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', 'color': '#C80000' }"
                                    @click="deleteUser($event)"></Button>
                                <Button type="button" label="Add User" icon="pi pi-plus"
                                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35', 'color': 'white' }"
                                    @click="addNewUser()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <Column field="name" header="Name" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="email" header="Email" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column field="phoneNumber" header="Phone Number" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.phone }}
                        </template>
                    </Column>
                    <Column field="designation" header="Designation" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.designation }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" headerStyle="width:14%; min-width:8rem;">/

                        {{ slotProps.data.status }}


                    </Column>
                    <Column field="lastSignedIn" header="Last Signed In" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.lastSignedIn }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body>
                            <Button icon="pi pi-trash" type="button" class="p-button-text"
                                :style="{ 'color': 'red' }"></Button>
                        </template>
                    </Column>
                </DataTable>


                <Dialog v-model:visible="addNewUserDialog" :style="{ width: '650px', height: '380px' }" :modal="true"
                    class="p-fluid">
                    <template #header>
                        <div class="dialog-header">
                            <i class="pi pi-plus" :style="{ 'margin-right': '8px', color: '#122C20' }"></i>
                            <span :style="{ color: '#122C20', 'font-size': '18px', 'font-weight': '700' }">Add
                                User</span>
                        </div>
                    </template>
                    <div class="mt-4">
                        <div :style="{ 'margin-left': '-22px' }">
                            <!-- First Row -->
                            <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                                <div class="field flex-1 flex flex-column">
                                    <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">First
                                        Name</label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        v-model="userFirstName" class="p-error" aria-describedby="username-help"
                                        placeholer="Name" />
                                </div>
                                <div class="field flex-1 flex flex-column">
                                    <label for="paymentType"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Last
                                        Name</label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        v-model="userLastName" class="p-error" aria-describedby="username-help"
                                        placeholer="Name" />
                                </div>
                            </div>

                            <!-- Second Row -->
                            <div class="flex gap-2 ml-3">
                                <div class="field flex-1 flex flex-column">
                                    <label for="deliveryMethod"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Email</label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        v-model="userEmail" class="p-error mt-1" aria-describedby="username-help"
                                        placeholer="Name" />
                                    <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                                </div>
                                <div class="field flex-1 flex flex-column">
                                    <label for="deliveryMethod"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone
                                        Number</label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        v-model="userMobile" class="p-error mt-1" aria-describedby="username-help" />
                                </div>
                            </div>

                            <!-- Third Row -->
                            <div>
                                <div class="field flex-1 flex flex-column col-12" :style="{ 'margin-top': '-10px' }">
                                    <label for="orderNotes"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Designation
                                    </label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        class="p-error mt-1" aria-describedby="username-help" v-model="userDesignation"
                                        placeholder="e.g Procurement Manager" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-content-end gap-2 ml-5">
                        <Button type="button" label="Cancel" icon="pi pi-times"
                            :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF', width: '100px', 'color': '#122C20' }"
                            @click="hideUserDialog()"></Button>
                        <Button type="button" label="Send Invitation" icon="pi pi-plus"
                            :style="{ 'background-color': '#1E4A35', border: '#1E4A35', width: '170px' }"
                            @click="addUser()"></Button>
                    </div>

                </Dialog>

            </div>

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Customer Profile</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div>
                        <div class="field col-12" :style="{ 'margin-top': '-17px' }">
                            <label for="orderNotes" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Write
                                customer
                                profile</label>
                        </div>
                        <div :style="{ 'margin-top': '-30px', 'margin-left': '15px' }">
                            <Textarea id="orderNotes" v-model="customerProfile" rows="4"
                                placeholder="Type your profile here..." :style="{ width: '100%' }"></Textarea>
                        </div>
                    </div>
                    <div class="flex justify-content-end mt-4">
                        <Button type="button" label="Save Customer Profile" icon="pi pi-save"
                            :style="{ 'background-color': '#DFEDDF', border: '#1E4A35', width: '200px', 'color': '#122C20' }"
                            @click="addLineItem()"></Button>
                    </div>
                </div>
            </div>
        </Form>
        </div>


        <div class="col-12 md:col-4">
            <div class="card p-fluid" :style="{}">
                <h5>Status</h5>
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option1" name="option" value="activa" v-model="radioValue" />
                            <label for="option1">Active</label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option2" name="option" value="inactive" v-model="radioValue" />
                            <label for="option2">Inactive</label>
                        </div>
                    </div>
                </div>
            </div>


            <div class="card" :style="{ 'margin-top': '-14px' }">
                <h5 :style="{ 'color': '#122C20' }">Customer Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Customer</div>
                        <div>{{ selectedBusinessName ? selectedBusinessName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Contact Person</div>
                        <div>{{ selectedPersonName ? selectedPersonName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Email</div>
                        <div>{{ selectedEmail ? selectedEmail : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Phone</div>
                        <div>{{ selectedPhone ? selectedPhone : '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5 :style="{ 'color': '#122C20' }">Billing Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Customer</div>
                        <div>{{ selectedBusinessName ? selectedBusinessName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{ selectedPersonName ? selectedPersonName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Address</div>
                        <div>{{ billingAddress ? billingAddress : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">City</div>
                        <div>{{ billingCity ? billingCity : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                        <div>{{ kraPin ? kraPin : '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5>Default Shipping Address</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Delivery Address</div>
                        <div>{{ '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{ selectedPersonName ? selectedPersonName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{ contactPersonPhone ? contactPersonPhone : '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5>Customer Profile</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <span :style="{ 'color': '#808080' }"> {{ customerProfile ? customerProfile : '-' }} </span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<style scoped>
/* Scoped styles to target the placeholder text in the dropdown */
.custom-dropdown .p-dropdown-label.p-placeholder {
    font-size: 12px !important;
    /* Adjust the font size as needed */
    color: #e21818 !important;
    /* Adjust the color if needed */
}

:deep(.rounded-dropdown .p-dropdown) {
    border-radius: 8px !important;
}

.vue-map-container {
    height: 130%;
    /* or any other height value you need */
    width: 100%;
    margin-top: -4%;
    /* Ensure it takes the full width of its parent */
}
</style>
