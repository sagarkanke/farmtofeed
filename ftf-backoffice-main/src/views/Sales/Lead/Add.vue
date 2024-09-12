<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { CompanyService } from '@/service/CompanyService';

const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);
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
const selectedDealOpporunity = ref();

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
const selectedLead = ref(null);
const sources = ref([
    { name: '1', label: 'Cold Call' },
    { name: '2', label: 'Referral' },
    { name: '3', label: 'Network' },
    { name: '3', label: 'Other' },
]);
const selectedSource = ref(null);
const dealOpportunities = ref([
    { name: '1', label: 'Small' },
    { name: '2', label: 'Medium' },
    { name: '3', label: 'Large' },
])
const dealStages = ref([
    { name: '1', label: 'Lead Generation' },
    { name: '2', label: 'Introduction' },
    { name: '3', label: 'Proposal & Negotiation' },
    { name: '4', label: 'Vetting' },
    { name: '5', label: 'Closed - Won' },
    { name: '6', label: 'Closed - Lost' },
    { name: '7', label: 'Abandoned' },
    { name: '8', label: 'On Hold' },
]);
const selectedDealStage = ref(null);
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    //  productService.getProducts().then((data) => (products.value = data));
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

const createNewCompany = async () => {
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
        const data = await companyService.createCompany(payload);
        console.log("data ", data);
        if (data) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Customer created successfully!', life: 3000 });
            // Reset form fields
            // resetFormFields();
        }



    } catch (e) {
        console.log("Error ", e);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save customer.', life: 3000 });

    }
}
</script>

<template>
    <div class="flex justify-content-between">
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem' }">New Lead</h5>
        <div class="flex gap-2 mb-3" :style="{ 'margin-left': '30px' }">
            <Button type="button" label="Delete Lead" icon="pi pi-trash" @click="createNewCompany()"
                :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', 'color': '#C80000', 'border-radius': '8px' }"></Button>
            <Button type="button" label="Save Lead" icon="pi pi-save" @click="createNewCompany()"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"></Button>
        </div>

    </div>

    <div class="grid" :style="{ 'margin-left': '-2rem' }">
        <div class="col-12 md:col-8">
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
                                placeholder="Select" />
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

                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Source
                                </label>
                                <Dropdown id="paymentType" :style="{ borderRadius: '8px' }"
                                v-model="selectedSource" :options="sources" optionLabel="label"
                                placeholder="Select" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Deal 
                                Opportunity</label>
                            <Dropdown id="paymentType" :style="{ borderRadius: '8px' }"
                                v-model="selectedDealOpporunity" :options="dealOpportunities" optionLabel="label"
                                placeholder="Select" />
                        </div>
                    </div>

                    <!-- Third Row -->
                    <div>
                        <div class="field flex-1 flex flex-column col-6" :style="{ 'margin-top': '-10px' }">
                            <label for="orderNotes" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Lead
                                Owner</label>
                            <Dropdown id="paymentType" :style="{ borderRadius: '8px' }" v-model="selectedLead"
                                :options="leadList" optionLabel="label" placeholder="Select" />
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

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Status Update</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <Fieldset>
                        <p class="line-height-3 m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                            officia deserunt mollit anim id est laborum.
                        </p>
                    </Fieldset>
                </div>
                <div :style="{ 'margin-left': '-10px' }">
                    <div class="mt-5">
                        <label for="orderNotes" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Write
                            Status
                            Update</label>
                    </div>
                    <div class="mt-2">
                        <Textarea id="orderNotes" v-model="customerProfile" rows="4"
                            placeholder="Type your note here..." :style="{ width: '100%' }"></Textarea>
                    </div>
                </div>
            </div>

        </div>

        <div class="col-12 md:col-4">
            <div class="card p-fluid" :style="{}">
                <div class="flex flex-column">
                    <div >
                        <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Deal Stage
                            </label>
                        <Dropdown id="paymentType" :style="{ borderRadius: '8px' }" v-model="selectedDealStage"
                            :options="dealStages" optionLabel="label" placeholder="Select" />
                    </div>
                    <div class="mt-3">
                        <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Contact Date
                        </label>
                        <Calendar v-model="calenderValue" selectionMode="range" :manualInput="false" showIcon
                                        placeholder="DD/MM/YYYY"></Calendar>
                    </div>
                    <div class="mt-3">
                        <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Last Contact Date
                        </label>
                        <Calendar v-model="calenderValue" selectionMode="range" :manualInput="false" showIcon
                                        placeholder="DD/MM/YYYY"></Calendar>
                    </div>
                </div>
                
            </div>



            <div class="card" :style="{ 'margin-top': '-14px' }">
                <h5 :style="{ 'color': '#122C20' }">Customer Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Customer</div>
                        <div>{{ selectedCustomer ? selectedCustomer.label : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Contact Person</div>
                        <div>John Kamau</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Email</div>
                        <div>jkamau@gmail.com</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Phone</div>
                        <div>+254 2341234123</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5 :style="{ 'color': '#122C20' }">Billing Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Customer</div>
                        <div>{{ selectedCustomer ? selectedCustomer.label : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>John Kamau</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Address</div>
                        <div>PO Box - 0252525 - 0020</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">City</div>
                        <div>Nairobi</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                        <div>KIOYU565645BYVN</div>
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
                        <div>Jon Kamau</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>+254 7789896543</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5>Customer Profile</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <span :style="{ 'color': '#808080' }"> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Quisque sit amet semper elit, sit amet varius odio. Nullam varius metus non orci tincidunt,
                            at vehicula sapien dictum. Vivamus placerat orci et neque vestibulum, ac fringilla elit
                            interdum. Curabitur eget tortor at urna dapibus fermentum. Pellentesque habitant morbi
                            tristique senectus et netus et malesuada fames ac turpis egestas. Sed sit amet lacus at urna
                            tincidunt egestas </span>
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
