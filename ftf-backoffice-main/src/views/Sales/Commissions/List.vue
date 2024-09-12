<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { CompanyService } from '@/service/CompanyService';
import { useStore } from 'vuex';
const store = useStore();
const statuses = ref([
    { label: 'paid', value: 'Paid' },
    { label: 'pending', value: 'Pending' },
    { label: 'unpaid', value: 'Unpaid' }
]);
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
const nestedRouteItems = ref([
    { label: 'Overview', key: 'overview' },
    { label: 'Payments', key: 'payments' },
]);
const filters = ref({});
const status = ref(null)
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
const calenderRange=ref(null);
const activeTab = ref('overview');
const selectedItem = computed(() => store.getters['customers/getSelectedItem']);
// const customerProfile = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const productService = new ProductService();
const paymentsList = ref([
    
        { id: 1, month: 'January', totalOrders: 15, totalOrderAmount: '$7500.00', totalIncentiveEarned: '$750.00', payment: 'Completed' },
        { id: 2, month: 'February', totalOrders: 10, totalOrderAmount: '$5000.00', totalIncentiveEarned: '$500.00', payment: 'Pending' },
        { id: 3, month: 'March', totalOrders: 12, totalOrderAmount: '$6000.00', totalIncentiveEarned: '$600.00', payment: 'Completed' },
        { id: 4, month: 'April', totalOrders: 18, totalOrderAmount: '$9000.00', totalIncentiveEarned: '$900.00', payment: 'Pending' },
        { id: 5, month: 'May', totalOrders: 22, totalOrderAmount: '$11000.00', totalIncentiveEarned: '$1100.00', payment: 'Completed' },
        { id: 6, month: 'June', totalOrders: 9, totalOrderAmount: '$4500.00', totalIncentiveEarned: '$450.00', payment: 'Pending' },
        { id: 7, month: 'July', totalOrders: 14, totalOrderAmount: '$7000.00', totalIncentiveEarned: '$700.00', payment: 'Completed' },
        { id: 8, month: 'August', totalOrders: 20, totalOrderAmount: '$10000.00', totalIncentiveEarned: '$1000.00', payment: 'Completed' },
        { id: 9, month: 'September', totalOrders: 11, totalOrderAmount: '$5500.00', totalIncentiveEarned: '$550.00', payment: 'Pending' },
        { id: 10, month: 'October', totalOrders: 13, totalOrderAmount: '$6500.00', totalIncentiveEarned: '$650.00', payment: 'Completed' },
        { id: 11, month: 'November', totalOrders: 17, totalOrderAmount: '$8500.00', totalIncentiveEarned: '$850.00', payment: 'Completed' },
        { id: 12, month: 'December', totalOrders: 16, totalOrderAmount: '$8000.00', totalIncentiveEarned: '$800.00', payment: 'Pending' },
        { id: 13, month: 'January', totalOrders: 8, totalOrderAmount: '$4000.00', totalIncentiveEarned: '$400.00', payment: 'Completed' },
        { id: 14, month: 'February', totalOrders: 7, totalOrderAmount: '$3500.00', totalIncentiveEarned: '$350.00', payment: 'Pending' },
        { id: 15, month: 'March', totalOrders: 19, totalOrderAmount: '$9500.00', totalIncentiveEarned: '$950.00', payment: 'Completed' },
        { id: 16, month: 'April', totalOrders: 21, totalOrderAmount: '$10500.00', totalIncentiveEarned: '$1050.00', payment: 'Pending' },
        { id: 17, month: 'May', totalOrders: 10, totalOrderAmount: '$5000.00', totalIncentiveEarned: '$500.00', payment: 'Completed' },
        { id: 18, month: 'June', totalOrders: 24, totalOrderAmount: '$12000.00', totalIncentiveEarned: '$1200.00', payment: 'Pending' },
        { id: 19, month: 'July', totalOrders: 13, totalOrderAmount: '$6500.00', totalIncentiveEarned: '$650.00', payment: 'Completed' },
        { id: 20, month: 'August', totalOrders: 25, totalOrderAmount: '$12500.00', totalIncentiveEarned: '$1250.00', payment: 'Completed' },
      
])
const dataList=ref([
        { id: 1, code: 'ORD-001', orderDate: '2024-01-15', customer: 'Acme Corporation', orderAmount: '$500.00', incentiveEarned: '$50.00', datePaid: '2024-01-20', payment: 'Completed' },
        { id: 2, code: 'ORD-002', orderDate: '2024-02-01', customer: 'Globex Inc.', orderAmount: '$1200.00', incentiveEarned: '$120.00', datePaid: '2024-02-05', payment: 'Pending' },
        { id: 3, code: 'ORD-003', orderDate: '2024-03-10', customer: 'Soylent Corp.', orderAmount: '$750.00', incentiveEarned: '$75.00', datePaid: '2024-03-15', payment: 'Completed' },
        { id: 4, code: 'ORD-004', orderDate: '2024-04-05', customer: 'Initech', orderAmount: '$300.00', incentiveEarned: '$30.00', datePaid: '2024-04-10', payment: 'Completed' },
        { id: 5, code: 'ORD-005', orderDate: '2024-05-20', customer: 'Umbrella Corp.', orderAmount: '$450.00', incentiveEarned: '$45.00', datePaid: '2024-05-25', payment: 'Pending' },
        { id: 6, code: 'ORD-006', orderDate: '2024-06-10', customer: 'Cyberdyne Systems', orderAmount: '$1000.00', incentiveEarned: '$100.00', datePaid: '2024-06-15', payment: 'Completed' },
        { id: 7, code: 'ORD-007', orderDate: '2024-07-15', customer: 'Wayne Enterprises', orderAmount: '$650.00', incentiveEarned: '$65.00', datePaid: '2024-07-20', payment: 'Pending' },
        { id: 8, code: 'ORD-008', orderDate: '2024-08-05', customer: 'Stark Industries', orderAmount: '$2500.00', incentiveEarned: '$250.00', datePaid: '2024-08-10', payment: 'Completed' },
        { id: 9, code: 'ORD-009', orderDate: '2024-09-01', customer: 'LexCorp', orderAmount: '$800.00', incentiveEarned: '$80.00', datePaid: '2024-09-05', payment: 'Completed' },
        { id: 10, code: 'ORD-010', orderDate: '2024-10-10', customer: 'Oscorp', orderAmount: '$400.00', incentiveEarned: '$40.00', datePaid: '2024-10-15', payment: 'Pending' },
        { id: 11, code: 'ORD-011', orderDate: '2024-11-20', customer: 'Hooli', orderAmount: '$350.00', incentiveEarned: '$35.00', datePaid: '2024-11-25', payment: 'Completed' },
        { id: 12, code: 'ORD-012', orderDate: '2024-12-01', customer: 'Pied Piper', orderAmount: '$900.00', incentiveEarned: '$90.00', datePaid: '2024-12-05', payment: 'Completed' },
        { id: 13, code: 'ORD-013', orderDate: '2024-01-05', customer: 'Vehement Capital Partners', orderAmount: '$1800.00', incentiveEarned: '$180.00', datePaid: '2024-01-10', payment: 'Pending' },
        { id: 14, code: 'ORD-014', orderDate: '2024-02-14', customer: 'Massive Dynamic', orderAmount: '$1400.00', incentiveEarned: '$140.00', datePaid: '2024-02-18', payment: 'Completed' },
        { id: 15, code: 'ORD-015', orderDate: '2024-03-30', customer: 'Wonka Industries', orderAmount: '$600.00', incentiveEarned: '$60.00', datePaid: '2024-04-03', payment: 'Pending' },
        { id: 16, code: 'ORD-016', orderDate: '2024-04-12', customer: 'Duff Beer', orderAmount: '$320.00', incentiveEarned: '$32.00', datePaid: '2024-04-16', payment: 'Completed' },
        { id: 17, code: 'ORD-017', orderDate: '2024-05-08', customer: 'Dunder Mifflin', orderAmount: '$950.00', incentiveEarned: '$95.00', datePaid: '2024-05-12', payment: 'Pending' },
        { id: 18, code: 'ORD-018', orderDate: '2024-06-20', customer: 'Cheers', orderAmount: '$275.00', incentiveEarned: '$27.50', datePaid: '2024-06-25', payment: 'Completed' },
        { id: 19, code: 'ORD-019', orderDate: '2024-07-11', customer: 'Nakatomi Trading Corp.', orderAmount: '$670.00', incentiveEarned: '$67.00', datePaid: '2024-07-15', payment: 'Pending' },
        { id: 20, code: 'ORD-020', orderDate: '2024-08-29', customer: 'Bluth Company', orderAmount: '$540.00', incentiveEarned: '$54.00', datePaid: '2024-09-02', payment: 'Completed' },
      ]) ;

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    // console.log("Printing selected company ", selectedItem.value.status);
    // selectedBusinessName.value = selectedItem.value.name;
    // selectedBusinessCategory.value = selectedItem.value.category;
    // selectedEmail.value = selectedItem.value.email;
    // selectedPhone.value = selectedItem.value.phone;
    // selectedPersonName.value = selectedItem.value.contact_person_name;
    // contactPersonEmail.value = selectedItem.value.contact_person_email;
    // contactPersonPhone.value = selectedItem.value.contact_person_phone;
    // designation.value = selectedItem.value.contact_person_designation;
    // const billingDetails = JSON.parse(selectedItem.value.billing_details);

    // billingAddress.value = billingDetails.address;
    // billingCity.value = billingDetails.city;
    // billingPostalCode.value = billingDetails.postal_code;
    // kraPin.value = selectedItem.value.kra_pin;


});

const handleTabChange = ({ index }) => {
    console.log("Index ", index);
    activeTab.value = nestedRouteItems.value[index].key;
    console.log("activeTab ", activeTab.value);
};
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

const getBadgeSeverity = (status) => {
    switch (status.toLowerCase()) {
        case 'active':
            return {
                backgroundColor: '#DFEDDF', // light green background
                border: '1px solid #DFEDDF',
                color: '#122C20' // dark green text
            };
        case 'inactive':
            return {
                backgroundColor: '#FFF3CD', // light yellow background
                border: '1px solid #FFE69C',
                color: '#856404' // dark yellow text
            };
        case 'expired':
            return {
                backgroundColor: '#F8D7DA', // light red background
                border: '1px solid #F5C6CB',
                color: '#721C24' // dark red text
            };
        default:
            return {
                backgroundColor: '#D1ECF1', // light blue background
                border: '1px solid #BEE5EB',
                color: '#0C5460' // dark blue text
            };
    }
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
        const data = await companyService.editCompany(payload, selectedItem.value.id);
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
   
    <div class="flex" :style="{ 'margin-left': '-3rem' }">
        <div class="col-12 lg:col-3 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Total Orders</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="danger" class="ml-2 mt--2"> <i class="pi pi-arrow-down"
                        :style="{ 'font-size': 'smaller' }"></i> 12.89%</Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">All Orders</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="success" class="ml-2 mt--2"> <i class="pi pi-arrow-down"
                        :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Customers</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="info" class="ml-2 mt--2"><i class="pi pi-arrow-down"
                        :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Comments</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="warning" class="ml-2 mt--2"><i class="pi pi-arrow-down"
                        :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>
    </div>


    <div class="grid" :style="{ 'margin-left': '-2rem' }">
        <div class="w-full">
            <div class="mt-4">
                <div class="custom-tabmenu-wrapper">
                  <TabMenu
                    :model="nestedRouteItems"
                    :activeIndex="nestedRouteItems.findIndex(item => item.key === activeTab)"
                    @tab-change="handleTabChange"
                  />
                </div>
              </div>

            <div class="card mt-4" v-if="activeTab === 'overview'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Commissions</h5>
                <DataTable ref="dt" :value="dataList" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    :style="{ 'margin-left': '-10px' }">
                    <template #header>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-10px' }">
                            <div class="flex gap-1">
                                <div >
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                                <div >
                                    <Calendar v-model="calendarRange" selectionMode="range" showIcon :manualInput="false" placeholder="Select Date Range"></Calendar>
                                </div>
                                <div>
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status"></Dropdown>
                                </div>
                     
                                <div class="ml-3">
                                    <Button type="button" label="Export" icon="pi pi-file-export" 
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                    @click="exportCSV($event)"></Button>
                                </div>
                            </div>
                            
                        </div>
                    </template>

                    <Column field="orderNo" header="Order No."
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order No.</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="orderDate" header="Order Date"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order Date</span>
                            {{ slotProps.data.orderDate }}
                        </template>
                    </Column>
                    <Column field="customer" header="Customer"
                    headerStyle="width:14%; min-width:10rem;">
                    <template #body="slotProps">
                        <span class="p-column-title">Customer</span>
                        {{ slotProps.data.customer }}
                    </template>
                </Column>
                <Column field="orderAmount" header="Order Amount"
                headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <span class="p-column-title">Order Amount</span>
                    {{ slotProps.data.orderAmount }}
                </template>
            </Column>
            <Column field="incentiveEarned" header="Incentive Earned"
            headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <span class="p-column-title">Incentive Earned</span>
                {{ slotProps.data.incentiveEarned }}
            </template>
        </Column>
        <Column field="datePaid" header="Date Paid"
        headerStyle="width:14%; min-width:10rem;">
        <template #body="slotProps">
            <span class="p-column-title">Date Paid</span>
            {{ slotProps.data.datePaid }}
        </template>
    </Column>
                    <Column field="payment" header="Payment" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Payment</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.payment)">{{
                                slotProps.data.payment }}</Tag>
                        </template>
                    </Column>

                </DataTable>
            </div>

            <div class="card mt-4" v-if="activeTab === 'payments'"> 
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Payments</h5>
               
                <DataTable ref="dt" :value="paymentsList" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    :style="{ 'margin-left': '-10px' }">
                    <template #header>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-10px' }">
                            <div class="flex gap-1">
                                <div >
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                                
                                <div>
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status"></Dropdown>
                                </div>
                                <div class="ml-3">
                                    <Button type="button" label="Export" icon="pi pi-file-export" 
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                    @click="exportCSV($event)"></Button>
                                </div>
                            </div>
                            
                        </div>
                    </template>
                    <Column field="month" header="Month"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Month</span>
                            {{ slotProps.data.month }}
                        </template>
                    </Column>
                    <Column field="totalOrders" header="Total Orders"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Total Orders</span>
                            {{ slotProps.data.totalOrders }}
                        </template>
                    </Column>
                    <Column field="totalOrderAmount" header="Total Order Amount"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Total Order Amount</span>
                            {{ slotProps.data.totalOrderAmount }}
                        </template>
                    </Column>
                    <Column field="totalIncentiveEarned" header="Total Incentive Earned"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Total Incentive Earned</span>
                            {{ slotProps.data.totalIncentiveEarned }}
                        </template>
                    </Column>
                    <Column field="payment" header="Payment" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Payment</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.payment)">{{
                                slotProps.data.payment }}</Tag>
                        </template>
                    </Column>
    
                </DataTable>
            </div>

        </div>


    </div>
</template>
<style scoped>
.custom-tabmenu-wrapper {
    background: transparent;
    padding: 0;
    margin: 0;
  }
  
  /* Remove border from the .p-tabmenu-nav element */
  .custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav {
    border: none !important; /* Remove border */
    box-shadow: none !important; /* Remove any shadow that might look like a border */
    background-color: transparent !important;
  }
  
  /* Ensure the tab menu items have a transparent background */
  .custom-tabmenu-wrapper ::v-deep .p-menuitem-link {
    background-color: transparent !important; /* Make background transparent */
    color: inherit; /* Inherit text color from parent */
    position: relative; /* Ensure position for the underline effect */
    text-decoration: none; /* Remove default underline if present */
  }
  
  /* Ensure only the active tab has the orange underline */
  .custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight > .p-menuitem-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px; /* Adjust height as needed */
    background-color: orange; /* Orange underline */
  }
  
  /* Remove any additional pseudo-element used as underline */
  .custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav::after {
    display: none; /* Hide any additional pseudo-element used as underline */
  }
</style>
