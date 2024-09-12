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
    { label: 'Orders', key: 'orders' },
    { label: 'Invoices', key: 'invoices' },
    { label: 'Coupons', key: 'coupons' },
    { label: 'Delivery Addresses', key: 'delivery-addresses' },
    { label: 'Users', key: 'users' },
    { label: 'Feedback', key: 'feedback' },
    { label: 'Activity', key: 'activity' }
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
const activeTab = ref('orders');
const ordersList = ref([
    {
    id: 1,
    code: 'ORD001',
    name: '2024-08-01',
    inventoryStatus: 'Shipped',
    items: 5,
    amount: 150.00,
    delivery: 'Courier',
    deliveryDate: '2024-08-05',
    deliveryWindow: '9:00 AM - 12:00 PM',
    payment: 'Credit Card'
  },
  {
    id: 2,
    code: 'ORD002',
    name: '2024-08-03',
    inventoryStatus: 'Pending',
    items: 2,
    amount: 75.00,
    delivery: 'Pickup',
    deliveryDate: '2024-08-07',
    deliveryWindow: '1:00 PM - 3:00 PM',
    payment: 'PayPal'
  },
  {
    id: 3,
    code: 'ORD003',
    name: '2024-08-10',
    inventoryStatus: 'Delivered',
    items: 8,
    amount: 200.00,
    delivery: 'Courier',
    deliveryDate: '2024-08-12',
    deliveryWindow: '10:00 AM - 2:00 PM',
    payment: 'Bank Transfer'
  },
  {
    id: 4,
    code: 'ORD004',
    name: '2024-08-15',
    inventoryStatus: 'Cancelled',
    items: 3,
    amount: 90.00,
    delivery: 'Courier',
    deliveryDate: '2024-08-20',
    deliveryWindow: '2:00 PM - 5:00 PM',
    payment: 'Debit Card'
  }
])
const selectedItem = computed(() => store.getters['customers/getSelectedItem']);
const invoicesList = ref([
    {
    id: 1,
    code: '2024-08-01',
    name: 'INV001',
    orderNo: 'ORD001',
    amount: 150.00,
    paymentType: 'Credit Card',
    dueDate: '2024-08-15',
    paid: 'Yes'
  },
  {
    id: 2,
    code: '2024-08-03',
    name: 'INV002',
    orderNo: 'ORD002',
    amount: 75.00,
    paymentType: 'PayPal',
    dueDate: '2024-08-17',
    paid: 'No'
  },
  {
    id: 3,
    code: '2024-08-10',
    name: 'INV003',
    orderNo: 'ORD003',
    amount: 200.00,
    paymentType: 'Bank Transfer',
    dueDate: '2024-08-20',
    paid: 'Yes'
  },
  {
    id: 4,
    code: '2024-08-12',
    name: 'INV004',
    orderNo: 'ORD004',
    amount: 90.00,
    paymentType: 'Debit Card',
    dueDate: '2024-08-22',
    paid: 'No'
  }
])
// const customerProfile = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const productService = new ProductService();
const couponsList= ref([
    {
    id: 1,
    code: 'ABC123',
    amount: 150.00,
    usage: 'Office Supplies',
    startDate: '2024-08-01',
    endDate: '2024-08-31',
    status: 'Active'
  },
  {
    id: 2,
    code: 'DEF456',
    amount: 75.00,
    usage: 'Travel Expenses',
    startDate: '2024-08-05',
    endDate: '2024-08-20',
    status: 'Inactive'
  },
  {
    id: 3,
    code: 'GHI789',
    amount: 200.00,
    usage: 'Equipment Purchase',
    startDate: '2024-08-10',
    endDate: '2024-09-10',
    status: 'Active'
  },
  {
    id: 4,
    code: 'JKL012',
    amount: 90.00,
    usage: 'Client Meals',
    startDate: '2024-08-12',
    endDate: '2024-08-25',
    status: 'Pending'
  },
  {
    id: 5,
    code: 'MNO345',
    amount: 120.00,
    usage: 'Software License',
    startDate: '2024-08-15',
    endDate: '2024-09-15',
    status: 'Active'
  },
  {
    id: 6,
    code: 'PQR678',
    amount: 80.00,
    usage: 'Office Rent',
    startDate: '2024-08-20',
    endDate: '2024-09-20',
    status: 'Inactive'
  }
]);
const deliveryAddressList = ref([{
    id: 1,
    name: 'Acme Corp',
    location: 'New York',
    contactPerson: 'John Doe',
    phoneNo: '+1 234 567 8901'
  },
  {
    id: 2,
    name: 'Beta Inc',
    location: 'San Francisco',
    contactPerson: 'Jane Smith',
    phoneNo: '+1 987 654 3210'
  },
  {
    id: 3,
    name: 'Gamma LLC',
    location: 'Los Angeles',
    contactPerson: 'Alice Johnson',
    phoneNo: '+1 555 123 4567'
  },
  {
    id: 4,
    name: 'Delta Co',
    location: 'Chicago',
    contactPerson: 'Bob Brown',
    phoneNo: '+1 666 234 5678'
  },
  {
    id: 5,
    name: 'Epsilon Ltd',
    location: 'Houston',
    contactPerson: 'Carol White',
    phoneNo: '+1 777 345 6789'
  },
  {
    id: 6,
    name: 'Zeta Group',
    location: 'Seattle',
    contactPerson: 'Dave Wilson',
    phoneNo: '+1 888 456 7890'
  }]);
const usersList = ref([
    {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phoneNo: '+1 555 123 4567',
    designation: 'Manager',
    status: 'Active',
    lastSignedIn: '2024-08-20'
  },
  {
    id: 2,
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    phoneNo: '+1 666 234 5678',
    designation: 'Developer',
    status: 'Inactive',
    lastSignedIn: '2024-08-19'
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol.white@example.com',
    phoneNo: '+1 777 345 6789',
    designation: 'Designer',
    status: 'Active',
    lastSignedIn: '2024-08-18'
  },
  {
    id: 4,
    name: 'Dave Wilson',
    email: 'dave.wilson@example.com',
    phoneNo: '+1 888 456 7890',
    designation: 'Analyst',
    status: 'Active',
    lastSignedIn: '2024-08-17'
  },
  {
    id: 5,
    name: 'Eva Green',
    email: 'eva.green@example.com',
    phoneNo: '+1 999 567 8901',
    designation: 'Consultant',
    status: 'Inactive',
    lastSignedIn: '2024-08-16'
  },
  {
    id: 6,
    name: 'Frank Martin',
    email: 'frank.martin@example.com',
    phoneNo: '+1 000 678 9012',
    designation: 'Support',
    status: 'Active',
    lastSignedIn: '2024-08-15'
  }
]);
const feedbackList = ref();
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    console.log("Printing selected company ", selectedItem.value.status);
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


});

const handleTabChange = ({ index }) => {
    activeTab.value = nestedRouteItems.value[index].key;
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
    <div class="flex justify-content-between">
        <router-link :to="{ path: '/sales/customers' }" class="back-arrow" :style="{ 'margin-left': '-2rem' }">
            <i class="pi pi-arrow-left" :style="{ 'color': '#122C20' }"></i>
        </router-link>
        <span :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-48rem', 'color': '#122C20' }">{{
            selectedItem.name }}
            <Badge :value="selectedItem.status" class="border-round-3xl ml-3	"
                :style="getBadgeSeverity(selectedItem.status)"></Badge>
        </span>
        <div :style="{ 'margin-left': '30px' }">
            <Button :value="selectedItem.status" type="button" label="Save Customer" icon="pi pi-save"
                @click="editCompany()" :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"></Button>
        </div>

    </div>
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
        <div :style="{ width: '64%' }">
            <div class="mt-4">
                <div class="custom-tabmenu-wrapper">
                    <TabMenu :model="nestedRouteItems"
                        :activeIndex="nestedRouteItems.findIndex(item => item.key === activeTab)"
                        @tab-change="handleTabChange" />
                </div>
            </div>

            <div class="card mt-4" v-if="activeTab === 'orders'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Orders</h5>
                <DataTable ref="dt" :value="ordersList" v-model:selection="selectedProducts" dataKey="id"
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
                                    <Calendar v-model="calendarRange" selectionMode="range" showIcon :manualInput="false" placeholder="Select Date Range" @change="filterByDate"></Calendar>
                                </div>
                                <div>
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-fill" label="Filter" outlined @click="openFilter()" />
                                </div>
                                <div >
                                    <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()" />
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
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{
                                slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column>
                    <Column field="items" header="Items" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Items</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="amount" header="Amount" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">amount</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="delivery" header="Delivery" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Delivery</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="deliveryDate" header="Delivery Date" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Delivery Date</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="deliveryWindow" header="Delivery Window" headerStyle="width:18%; min-width:14rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Delivery Window</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="payment" header="Payment" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Payment</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div class="card mt-4" v-if="activeTab === 'invoices'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Invoices</h5>
                <DataTable ref="dt" :value="invoicesList" v-model:selection="selectedProducts" dataKey="id"
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
                                    <Calendar v-model="calendarRange" selectionMode="range" showIcon :manualInput="false" placeholder="Select Date Range" @change="filterByDate"></Calendar>
                                </div>
                                <div>
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-fill" label="Filter" outlined @click="openFilter()" />
                                </div>
                                <div >
                                    <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()" />
                                </div>
                                <div class="ml-3">
                                    <Button type="button" label="Export" icon="pi pi-file-export" 
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                    @click="exportCSV($event)"></Button>
                                </div>
                            </div>
                            
                        </div>
                    </template>
                    <Column field="issuDate" header="Issue Date"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Issue Date</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="invoiceNo" header="Invoice No"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Invoice No</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="orderNo" header="Order No"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Invoice No</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="amount" header="Amount"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Amount</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="paymentType" header="Payment Type"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Payment Type</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="dueDate" header="Due Date"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Due Date</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="paid" header="Paid" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Paid</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>

                </DataTable>
            </div>

            <div class="card mt-4" v-if="activeTab === 'coupons'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Coupons</h5>
                <DataTable ref="dt" :value="couponsList" v-model:selection="selectedProducts" dataKey="id"
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
                                <div>
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status"
                :style="{ 'border-radius': '8px' }"></Dropdown>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <Button type="button" label="Export" icon="pi pi-file-export" 
                                :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="code" header="Code"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Code</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="amount" header="Amount"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Amount</span>
                            {{ slotProps.data.amount }}
                        </template>
                    </Column>
                    <Column field="usage" header="Usage"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Usage</span>
                            {{ slotProps.data.usage }}
                        </template>
                    </Column>
                    <Column field="startDate" header="Start Date" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Start Date</span>
                            {{ slotProps.data.startDate }}
                        </template>
                    </Column>
                    <Column field="endDate" header="End Date" 
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">End Date</span>
                            {{ slotProps.data.endDate }}
                        </template>
                    </Column>
                    <Column field="status" header="Status" 
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            {{ slotProps.data.status }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div class="card mt-4" v-if="activeTab === 'delivery-addresses'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Deliver Addresses</h5>
                <DataTable ref="dt" :value="deliveryAddressList" v-model:selection="selectedProducts" dataKey="id"
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
                                <Button type="button" label="Export" icon="pi pi-file-export" 
                                :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="location" header="Location"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Locatio</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="contactPerson" header="Contact Person"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Contact Person</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="phoneNo" header="Phone Number" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Phone Number</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div class="card mt-4" v-if="activeTab === 'users'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Users</h5>
                <DataTable ref="dt" :value="usersList" v-model:selection="selectedProducts" dataKey="id"
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
                                <Button type="button" label="Export" icon="pi pi-file-export" 
                                :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name" 
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="email" header="Email"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Email</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column field="phoneNo" header="Phone Number"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Phone Number</span>
                            {{ slotProps.data.phone }}
                        </template>
                    </Column>
                    <Column field="designation" header="Designation" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Designation</span>
                            {{ slotProps.data.designation }}
                        </template>
                    </Column>
                    <Column field="status" header="Status"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">status</span>
                            {{ slotProps.data.status }}
                        </template>
                    </Column>
                    <Column field="lastSignedIn" header="Last Signed In"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Last Signed In</span>
                            {{ slotProps.data.lastSignedIn }}
                        </template>
                    </Column>
 
                </DataTable>
            </div>

            <div class="card mt-4" v-if="activeTab === 'feedback'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Feedback</h5>
                <DataTable ref="dt" :value="feedbackList" v-model:selection="selectedProducts" dataKey="id"
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
                                <Button type="button" label="Export" icon="pi pi-file-export" 
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                    @click="exportCSV($event)"></Button>
                            
                            </div>
                        </div>
                    </template>
                    <Column field="date" header="Date"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            {{ slotProps.data.code }}
                        </template>
                    </Column>
                    <Column field="type" header="Type" 
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Type</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="source" header="Source"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Invoice No</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="receiver" header="Receiver" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Receiver</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="contactPerson" header="Contact Person"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Contact Person</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="comment" header="Comment"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Comment</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>

                </DataTable>
            </div>

            <div class="card mt-4" v-if="activeTab === 'activity'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Activity</h5>
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
                                <Button type="button" label="Export" icon="pi pi-file-export" 
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }"
                                    @click="exportCSV($event)"></Button>
                                
                            </div>
                        </div>
                    </template>
                    <Column field="event" header="Event" headerStyle="width:50%;">
                        <template #body="slotProps">
                            <div :style="{
                                'display': 'flex',
                                'align-items': 'center',
                                'justify-content': 'flex-start'
                            }">
                                <span class="p-column-title">Event</span>
                                {{ slotProps.data.code }}
                            </div>
                        </template>
                    </Column>
                    <Column field="time" header="Time" headerStyle="width:50%;">
                        <template #body="slotProps">
                            <div :style="{
                                'display': 'flex',
                                'align-items': 'center',
                                'justify-content': 'flex-end !important',
                                'margin-left': '10rem'
                            }">
                                <span class="p-column-title">Time</span>
                                {{ slotProps.data.name }}
                            </div>

                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <div :style="{ width: '36%' }" class="md:col-6">
            <div class="card mt-3	">
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
                        <span :style="{ 'color': '#808080' }"> {{ customerProfile || '-' }} </span>
                    </div>
                </div>
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
