<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { CompanyService } from '@/service/CompanyService';
import { useStore } from 'vuex';
const store = useStore();

const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);
const businessCategories = ref([
    { name: 'school', label: 'School/Feeding Program' },
    { name: 'hotel', label: 'Hotel/Restaurant' },
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
const selectedItem = computed(() => store.getters['customers/getSelectedItem']);
// const customerProfile = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    selectedBusinessName.value = selectedItem.value.name;
    selectedBusinessCategory.value = selectedItem.value.category;
    selectedEmail.value = selectedItem.value.email;
    selectedPhone.value = selectedItem.value.phone;
    selectedPersonName.value = selectedItem.value.contact_person_name;
    contactPersonEmail.value = selectedItem.value.contact_person_email;
    contactPersonPhone.value = selectedItem.value.contact_person_phone;
    designation.value = selectedItem.value.contact_person_designation;
    const billingDetails = JSON.parse(selectedItem.value.billing_details);

    billingAddress.value = billingDetails.address;
    billingCity.value = billingDetails.city;
    billingPostalCode.value = billingDetails.postal_code;
    kraPin.value = selectedItem.value.kra_pin;

    console.log("selectedBusinessCategory ", selectedItem.value.billing_details.a)
});

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const getDropdownValue = () => {
    console.log('Printing selected customer ', selectedCustomer.value.label);
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
    product.value = [];
    submitted.value = false;
    addNewUserDialog.value = true;
};

const addLineItem = () => {
    console.log('selectedProducts ', selectedProducts);
    productDialog.value = false;
};

const addDeliveryAddress = () => {
    console.log(" addDeliveryAddress called ")
    // product.value = [];
    // submitted.value = false;
    deliveryAddrDialog.value = true;
}
const exportCSV = () => {
    dt.value.exportCSV();
};

const editCompany = async () => {
    try {
        const payload = {
            "name": selectedBusinessName.value,
            "category": selectedBusinessCategory.value.label,
            "email": selectedEmail.value,
            "phone": selectedPhone.value,
            "lead_owner": 1,
            "contact_person_name": selectedPersonName.value,
            "contact_person_email": contactPersonEmail.value,
            "contact_person_phone": contactPersonPhone.value,
            "contact_person_designation": designation.value,
            "kra_pin": kraPin.value,
            "billing_details": {
                "address": billingAddress.value,
                "postal_code": billingPostalCode.value,
                "city": billingCity.value
            }
        }
        console.log("Pyaload ", payload);
        const data = await companyService.editCompany(payload,selectedItem.value.id);
        console.log("data ", data);
        if (data) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Customer saved successfully!', life: 3000 });
            // Reset form fields
            resetFormFields();
        }



    } catch (e) {
        console.log("Error ", e);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save customer.', life: 3000 });

    }
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
</script>

<template>
    <div class="flex justify-content-between">
        <router-link :to="{ path: '/sales/customers' }" class="back-arrow" :style="{'margin-left': '-2rem'}">
            <i class="pi pi-arrow-left" :style="{ 'color': '#122C20' }"></i>
        </router-link><Span :style="{ 'font-size': 'large', 'font-weight': 'bold','margin-left': '-42rem' ,'color': '#122C20'}"> Edit Customer :: {{ selectedItem.name }}</span>
        <div :style="{ 'margin-left': '30px' }">
            <Button type="button" label="Save Customer" icon="pi pi-save" @click="editCompany()"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"></Button>
        </div>

    </div>

    <div class="grid" :style="{ 'margin-left': '-2rem' }">
        <div :style="{ width: '64%', 'margin-top': '14px' }">
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Business Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Business
                                Name</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="selectedBusinessName" aria-describedby="username-help" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Business
                                Category</label>
                            <Dropdown id="paymentType" :style="{ borderRadius: '8px' }"
                                v-model="selectedBusinessCategory" :options="businessCategories" optionLabel="label"
                                optionValue="label" placeholder="Select" />
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Email</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                v-model="selectedEmail" class="p-error mt-1" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone
                                Number</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                v-model="selectedPhone" class="p-error mt-1" aria-describedby="username-help" />
                        </div>
                    </div>

                    <!-- Third Row -->
                    <div>
                        <div class="field flex-1 flex flex-column col-6" :style="{ 'margin-top': '-10px' }">
                            <label for="orderNotes" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Lead
                                Owner</label>
                            <Dropdown id="paymentType" :style="{ borderRadius: '8px' }" v-model="selectedPaymentType"
                                :options="paymentTypes" optionLabel="label" placeholder="Select" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div :style="{ width: '36%' }" class="md:col-6">
            <div class="card p-fluid" :style="{}">
                <h5>Status</h5>
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option1" name="option" value="activa" v-model="radioValue" />
                            <label for="option1">Active</label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4" :style="{ 'margin-left': '-45px' }">
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
                        <div>{{ selectedBusinessName || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Contact Person</div>
                        <div>{{ selectedPersonName || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Email</div>
                        <div>{{ selectedEmail || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Phone</div>
                        <div>{{ selectedPhone || '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5 :style="{ 'color': '#122C20' }">Billing Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Customer</div>
                        <div>{{ selectedBusinessName || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{ selectedPersonName || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Address</div>
                        <div>{{ billingAddress || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">City</div>
                        <div>{{ billingCity || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                        <div>{{ kraPin || '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5>Default Shipping Address</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Delivery Address</div>
                        <div>Mama Ngina St, LSG Building 4th floor</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{ selectedPersonName || '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{ contactPersonPhone || '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5>Customer Profile</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <span :style="{ 'color': '#808080' }"> {{customerProfile || '-'}} </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative" :style="{ width: '64%', 'margin-top': '-37rem' }">
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Contact Person</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">

                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">First
                                Name</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="selectedPersonName" aria-describedby="username-help" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }"> Last Name
                            </label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="selectedLastName" aria-describedby="username-help" />
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Email</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                v-model="contactPersonEmail" class="p-error mt-1" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone
                                Number</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                v-model="contactPersonPhone" class="p-error mt-1" aria-describedby="username-help" />
                        </div>
                    </div>

                    <!-- Third Row -->
                    <div>
                        <div class="field flex-1 flex flex-column col-6" :style="{ 'margin-top': '-10px' }">
                            <label for="orderNotes"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Designation</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                v-model="designation" class="p-error mt-1" aria-describedby="username-help"
                                aria-placeholder="e.g Procurement Manager" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative" :style="{ width: '64%', 'margin-top': '-12rem'}">
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Billing Details</h5>
                <div :style="{ 'margin-left': '-22px' }">

                    <div class="flex flex-column col-12">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Business
                                Name</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="selectedBusinessName" aria-describedby="username-help"
                                aria-placeholder="Business Name" />
                        </div>
                    </div>
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Address (P.O
                                Box)</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="billingAddress" aria-describedby="username-help"
                                aria-placeholder="e.g 123456" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Postal
                                Code</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="billingPostalCode" aria-describedby="username-help"
                                aria-placeholder="e.g 000000" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">City</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="billingCity" aria-describedby="username-help" aria-placeholder="e.g Nairobi" />
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex flex-column" :style="{ 'width': '60%' }">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">KRA
                                Pin</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" v-model="kraPin"
                                class="p-error mt-1" aria-describedby="username-help" aria-placeholder="KRA Pin" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column" :style="{ 'align-self': 'end' }">
                            <Button type="button" label="Upload KRA CERTIFICATE" icon="pi pi-upload"
                                :style="{ 'background-color': '#DFEDDF', border: '1px solid #DFEDDF', 'color': '#333333', 'border-radius': '8px' }"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div :style="{ width: '64%', 'margin-top': '20px' }">
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
                                <InputText class="w-full" v-model="filters['global'].value"
                                    placeholder="Pin Location" />
                            </IconField>
                        </div>
                    </div>

                    <div class="card mt-2">
                        <GMapMap :center="center" :zoom="10" style="width: 100%; height: 100%;">
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
                            @click="addLineItem()"></Button>
                    </div>
                </Dialog>

            </div>
        </div>

        <div :style="{ width: '64%', 'margin-top': '20px' }">
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Users</h5>
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
                                <Button type="button" label="Add User" icon="pi pi-plus"
                                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35', 'color': 'white' }"
                                    @click="addNewUser()"></Button>
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
                    <Column field="email" header="Email" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Customer</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="phoneNumber" header="Phone Number" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order Date</span>
                            <img :src="'/demo/images/product/' + slotProps.data.image" :alt="slotProps.data.image"
                                class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="designation" header="Designation" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{
                                slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="true" headerStyle="width:14%; min-width:8rem;">/
                        <InputSwitch v-model="switchValue" />

                        <!-- <template #body="slotProps">
                            <span class="p-column-title">Items</span>
                            {{ formatCurrency(slotProps.data.price) }}
                        </template> -->
                    </Column>
                    <Column field="lastSignedIn" header="Last Signed In" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{
                                slotProps.data.inventoryStatus }}</Tag>
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
                                        class="p-error" aria-describedby="username-help" placeholer="Name" />
                                </div>
                                <div class="field flex-1 flex flex-column">
                                    <label for="paymentType"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Last
                                        Name</label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        class="p-error" aria-describedby="username-help" placeholer="Name" />
                                </div>
                            </div>

                            <!-- Second Row -->
                            <div class="flex gap-2 ml-3">
                                <div class="field flex-1 flex flex-column">
                                    <label for="deliveryMethod"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Email</label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        class="p-error mt-1" aria-describedby="username-help" placeholer="Name" />
                                    <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                                </div>
                                <div class="field flex-1 flex flex-column">
                                    <label for="deliveryMethod"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone
                                        Number</label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        class="p-error mt-1" aria-describedby="username-help" />
                                </div>
                            </div>

                            <!-- Third Row -->
                            <div>
                                <div class="field flex-1 flex flex-column col-12" :style="{ 'margin-top': '-10px' }">
                                    <label for="orderNotes"
                                        :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Designation
                                    </label>
                                    <InputText id="username2" :style="{ borderRadius: '8px' }" type="username"
                                        class="p-error mt-1" aria-describedby="username-help"
                                        placeholder="e.g Procurement Manager" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-content-end gap-2 ml-5">
                        <Button type="button" label="Cancel" icon="pi pi-times"
                            :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF', width: '100px', 'color': '#122C20' }"
                            @click="exportCSV($event)"></Button>
                        <Button type="button" label="Send Invitation" icon="pi pi-plus"
                            :style="{ 'background-color': '#1E4A35', border: '#1E4A35', width: '170px' }"
                            @click="addLineItem()"></Button>
                    </div>

                </Dialog>

            </div>
        </div>

        <div :style="{ width: '64%', 'margin-top': '14px' }">
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
</style>
