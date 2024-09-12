<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import { OrdersService } from '@/service/OrdersService';
import { ProductService } from '@/service/ProductService';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
// Services
const ordersService = new OrdersService();
const productService = new ProductService();
const store = useStore();
const deleteFeedback = ref(false);
// Toast and Router
const toast = useToast();
const router = useRouter();

// Reactive References
const orders = ref([]);
let selectedItem = ref(null);

const selectedOrders = ref(null);
const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const filterDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const editFeedback = ref(false);
const showFeedbackDetails = ref(false);
const statuses = ref([
    { label: 'pending', value: 'Pending' },
    { label: 'ongoing', value: 'Ongoing' },
    { label: 'closed', value: 'Closed' }
]);
const types = ref([
    { label: 'complaint', value: 'Complaint' },
    { label: 'preference', value: 'Preference' },
]);
const sources = ref([
    { label: 'whatsapp', value: 'Whatsapp' },
    { label: 'ecommerce', value: 'Ecommerce' },
    { label: 'customercare', value: 'Customer Care' },
])
const addNewFeedback = ref(false);
const status = ref(null);
let calenderValue = ref(null);
let calendarRange = ref(null);
const feedbackList = ref([
    { id: 1, date: '2024-08-01', order_number: 'ORD001', company: 'Acme Corp', comment: 'Great service', type: 'Product', status: 'Pending', amount: 120.50, contact_person: 'John Doe', receiver: 'Jane Smith' },
    { id: 2, date: '2024-08-02', order_number: 'ORD002', company: 'Beta Ltd', comment: 'Delayed delivery', type: 'Service', status: 'Completed', amount: 250.00, contact_person: 'Alice Johnson', receiver: 'Bob Brown' },
    { id: 3, date: '2024-08-03', order_number: 'ORD003', company: 'Gamma Inc', comment: 'Excellent quality', type: 'Product', status: 'Cancelled', amount: 89.99, contact_person: 'Chris Lee', receiver: 'Diana Green' },
    { id: 4, date: '2024-08-04', order_number: 'ORD004', company: 'Delta Co', comment: 'Quick response', type: 'Product', status: 'Pending', amount: 320.75, contact_person: 'Eva Martinez', receiver: 'Frank White' },
    { id: 5, date: '2024-08-05', order_number: 'ORD005', company: 'Epsilon Enterprises', comment: 'Good value', type: 'Service', status: 'Completed', amount: 45.00, contact_person: 'George Wilson', receiver: 'Helen Clark' },
    { id: 6, date: '2024-08-06', order_number: 'ORD006', company: 'Zeta Solutions', comment: 'Needs improvement', type: 'Product', status: 'Cancelled', amount: 150.50, contact_person: 'Ivy Lewis', receiver: 'Jack Hall' },
    { id: 7, date: '2024-08-07', order_number: 'ORD007', company: 'Eta Technologies', comment: 'Satisfied', type: 'Product', status: 'Pending', amount: 200.00, contact_person: 'Kathy Allen', receiver: 'Leo King' },
    { id: 8, date: '2024-08-08', order_number: 'ORD008', company: 'Theta Systems', comment: 'Excellent support', type: 'Service', status: 'Completed', amount: 175.00, contact_person: 'Mia Young', receiver: 'Nate Scott' },
    { id: 9, date: '2024-08-09', order_number: 'ORD009', company: 'Iota Industries', comment: 'Highly recommended', type: 'Product', status: 'Cancelled', amount: 80.00, contact_person: 'Oliver Adams', receiver: 'Paula Evans' },
    { id: 10, date: '2024-08-10', order_number: 'ORD010', company: 'Kappa Corp', comment: 'Timely delivery', type: 'Service', status: 'Pending', amount: 65.50, contact_person: 'Quincy Roberts', receiver: 'Rachel Carter' },
    { id: 11, date: '2024-08-11', order_number: 'ORD011', company: 'Lambda Ltd', comment: 'Very responsive', type: 'Product', status: 'Completed', amount: 290.25, contact_person: 'Steve Turner', receiver: 'Tina Murphy' },
    { id: 12, date: '2024-08-12', order_number: 'ORD012', company: 'Mu Enterprises', comment: 'Fast shipping', type: 'Service', status: 'Cancelled', amount: 55.75, contact_person: 'Ursula Cooper', receiver: 'Victor Ward' },
    { id: 13, date: '2024-08-13', order_number: 'ORD013', company: 'Nu Co', comment: 'Excellent value', type: 'Product', status: 'Pending', amount: 310.00, contact_person: 'Wendy Rivera', receiver: 'Xander Phillips' },
    { id: 14, date: '2024-08-14', order_number: 'ORD014', company: 'Xi Inc', comment: 'High quality', type: 'Service', status: 'Completed', amount: 120.00, contact_person: 'Yvonne Mitchell', receiver: 'Zachary Adams' },
    { id: 15, date: '2024-08-15', order_number: 'ORD015', company: 'Omicron Corp', comment: 'Reliable', type: 'Product', status: 'Cancelled', amount: 145.00, contact_person: 'Andrew Harris', receiver: 'Betty Baker' },
    { id: 16, date: '2024-08-16', order_number: 'ORD016', company: 'Pi Ltd', comment: 'Needs more options', type: 'Service', status: 'Pending', amount: 75.00, contact_person: 'Catherine Nelson', receiver: 'Derek Mitchell' },
    { id: 17, date: '2024-08-17', order_number: 'ORD017', company: 'Rho Technologies', comment: 'Great experience', type: 'Product', status: 'Completed', amount: 200.00, contact_person: 'Elaine Rogers', receiver: 'Franklin Bennett' },
    { id: 18, date: '2024-08-18', order_number: 'ORD018', company: 'Sigma Systems', comment: 'Good service', type: 'Service', status: 'Cancelled', amount: 60.00, contact_person: 'Fred Stevens', receiver: 'Grace Hayes' },
    { id: 19, date: '2024-08-19', order_number: 'ORD019', company: 'Tau Co', comment: 'Excellent delivery', type: 'Product', status: 'Pending', amount: 90.00, contact_person: 'Hannah Moore', receiver: 'Ian Young' },
    { id: 20, date: '2024-08-20', order_number: 'ORD020', company: 'Upsilon Enterprises', comment: 'Overall satisfaction', type: 'Service', status: 'Completed', amount: 130.00, contact_person: 'Jackie Collins', receiver: 'Kevin Lee' }
])
// Functions
const fetchAllOrders = async () => {
    try {
        const data = await ordersService.fetchAllOrders();
        orders.value = data;
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
};

const getItems = (rowData) => {
    return [
        {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            command: () => handleMenuAction('View', rowData)
        },
        {
            label: 'Edit',
            icon: 'pi pi-fw pi-plus',
            command: () => handleMenuAction('Edit', rowData)
        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
            command: () => handleMenuAction('Delete', rowData)
        }
    ];
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const getBadgeSeverity = (inventoryStatus) => {
    switch (inventoryStatus.toLowerCase()) {
        case 'instock':
            return 'success';
        case 'lowstock':
            return 'warning';
        case 'outofstock':
            return 'danger';
        default:
            return 'info';
    }
};

const handleMenuAction = (action, item) => {
    if(item){
        selectedItem.value = item;

    }
    if (action === 'Edit') {
        editFeedback.value = true
    } else if (action === 'Delete') {
        deleteFeedback.value = true;
    }
    else if (action === 'View') {
        // store.commit('customers/setSelectedItem', selectedItem);
        showFeedbackDetails.value = true;
    }
};


const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    deleteFeedback.value = false;
    submitted.value = false;
};

const openFilter = () => {
    product.value = {};
    submitted.value = false;
    filterDialog.value = true;
};

const clearFilter = () => {
    calenderRange.value = '';
    status.value = '';
    filters.value['global'].value = '';
};

const saveProduct = () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.price) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    return products.value.findIndex(product => product.id === id);
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const newOrder = () => {
    router.push({ path: '/sales/new-orders' });
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

function formatDate(dateStr) {
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');
    return `${day}/${month}/${year}`;
}

// const showOrderDetails = (orderData) => {
//     store.dispatch('orders/setOrderDetailsArray', orders)
//     router.push({
//         path: '/sales/order-details',
//         // state: { orderData }
//     });
// }

const filteredOrders = computed(() => {
    let filtered = [...orders.value];

    // Global search filter
    if (filters.value['global']?.value) {
        filtered = filtered.filter(order =>
            Object.values(order).some(val =>
                val.toString().toLowerCase().includes(filters.value['global'].value.toLowerCase())
            )
        );
    }

    // Status filter
    if (status.value) {
        filtered = filtered.filter(order => order.status === status.value);
    }

    // Calendar filter
    if (calendarRange.value && calendarRange.value.length === 2) {
        const [startDate, endDate] = calendarRange.value;
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.order_date);
            return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
    }

    return filtered;
});

const showOrderDetails = (orderData) => {
    const { id: orderId, order_number } = orderData;
    router.push({
        path: `/sales/order-details/${orderId}/${order_number}`,
    });
}

const newFeedback = () => {
    addNewFeedback.value = true
}
// Lifecycle Hooks
onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    fetchAllOrders();
});
</script>


<template>
    <div class="grid" :style="{ 'margin-left': '-50px', 'margin-top': '-30px' }">

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

        <div class="col-12">
            <div class="card">
                <DataTable ref="dt" :value="feedbackList" v-model:selection="selectedOrders" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h6 class="m-0 text-color-secondary	">Feedback</h6>
                        </div>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-15px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                                <div>
                                    <Calendar v-model="calendarRange" selectionMode="range" :manualInput="false"
                                        placeholder="Select Date Range" @change="filterByDate"></Calendar>
                                </div>
                                <div>
                                    <!-- <label for="state">Status</label> -->
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value"
                                        placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-fill" label="Filter" outlined
                                        @click="openFilter()" />
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()" />
                                </div>
                            </div>

                            <div class="flex gap-2" :style="{ 'margin-right': '-22px' }">
                                <Button type="button" label="Export" icon="pi pi-file-export"
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                    @click="exportCSV($event)"></Button>
                                <Button type="button" label="New Feedback" icon="pi pi-plus"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="newFeedback()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="date" header="Date" :sortable="true" headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            {{ slotProps.data.date }}
                    
                        </template>
                    </Column>
                    <Column field="name" header="Customer" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Customer</span>
                            {{ slotProps.data.company }}
                        </template>
                    </Column>
                    <Column field="comment" header="Comment" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Comment</span>
                            {{ slotProps.data.comment }}
                        </template>
                    </Column>
                    <Column field="type" header="Type" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Type</span>
                            {{slotProps.data.type }} </template>
                    </Column>
                    <Column field="status" header="Status" headerStyle="width:14%; min-width:7rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.status)">{{ slotProps.data.status }}</Tag>
                        </template>
                    </Column>
                    <Column field="orderNo" header="Order No." headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order No.</span>
                            {{ slotProps.data.order_number }}
                            <!-- {{ formatCurrency(slotProps.data.price) }} -->
                        </template>
                    </Column>
                    <Column field="source" header="Source" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Amount</span>
                            {{ formatCurrency(slotProps.data.amount || 0) }}
                        </template>
                    </Column>
                    <Column field="contactPerson" header="Contact Person" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Contact Person</span>
                            {{ slotProps.data.contact_person }}
                            <!-- <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" /> -->
                        </template>
                    </Column>
                    <Column field="receiver" header="Receiver" headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Receiver</span>
                            {{ slotProps.data.receiver }}
                        </template>
                    </Column>

                    <Column headerStyle="min-width:2rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                                @click="$refs[`menu-${slotProps.data.id}`].toggle($event)">
                            </Button>
                            <Menu :ref="`menu-${slotProps.data.id}`" :popup="true" :model="getItems(slotProps.data)">
                            </Menu>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="addNewFeedback" :style="{ width: '450px' }" header="Product Details"
                    :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Add
                                Feedback</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>
                    <div class="field">
                        <label for="name">Status</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" optionValue="label"
                            placeholder="Select Status"></Dropdown>
                    </div>
                    <div class="field">
                        <label for="description">Customer</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="name" optionValue="id"
                            placeholder="Select Customer"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Order No.</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="name" optionValue="id"
                            placeholder="Select Order"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Date</label>
                        <Calendar v-model="selectedStartDate" :style="{ borderRadius: '8px' }" showIcon
                                :manualInput="false" placeholder="DD/MM/YYYY"></Calendar>
                    </div>

                    <div class="field">
                        <label for="description">Type</label>
                        <Dropdown id="state" v-model="status" :options="types" optionLabel="value" optionValue="id"
                            placeholder="Select Type"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Source</label>
                        <Dropdown id="state" v-model="status" :options="sources" optionLabel="value" optionValue="id"
                            placeholder="Select Source"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Receiver</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="name" optionValue="id"
                            placeholder="Select Receiver"></Dropdown>
                    </div>

                    <div>
                        <label for="description"
                            :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Customer Comment</label>
                            <Textarea id="orderNotes" v-model="customerProfile" rows="4" class="mt-1"
                                placeholder="Type customer comment here..." :style="{ width: '100%' }"></Textarea>
                    </div>

                    <div class="mt-2">
                        <label for="description"
                            :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Internal Comment</label>
                            <Textarea id="orderNotes" v-model="customerProfile" rows="4" class="mt-1"
                            placeholder="Type customer comment here..." :style="{ width: '100%' }"></Textarea>                    </div>
               
                    <template #footer>
                        <Button type="button" label="Cancel" icon="pi pi-times"
                                    :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF','color':'#122C20 ' }"
                                    @click="hideDialog()"></Button>
                                    <Button type="button" label="Add Feedback" icon="pi pi-plus"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="saveProduct()"></Button>  
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteFeedback" :style="{ width: '450px' }" :closable="false"
                :modal="true">
                <template #header>
                    <div>
                        <h5 :style="{ 'font-weight': '700' }">Are you absolutely sure?</h5>
                        <div class="mt-1">
                            <span :style="{ color: gray }">This action cannot be undone. This will permanently
                                remove the coupon.</span>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <Button type="button" label="Cancel" icon="pi pi-times"
                        :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF', color: '#122C20' }"
                        @click="hideDialog()"></Button>
                    <Button type="button" label="Yes, Do it" icon="pi pi-check"
                        :style="{ 'background-color': '#C80000', border: '#C80000', color: '#FFFFFF' }"
                        @click="hideDialog()"></Button>
                </template>
            </Dialog>

                <Dialog v-model:visible="editFeedback" :style="{ width: '450px' }" header="Product Details"
                    :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Edit
                                Feedback</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>
                    <div class="field">
                        <label for="name">Status</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" optionValue="label"
                            placeholder="Select Status"></Dropdown>
                    </div>
                    <div class="field">
                        <label for="description">Customer</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="name" optionValue="id"
                            placeholder="Select Customer"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Order No.</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="name" optionValue="id"
                            placeholder="Select Order"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Date</label>
                        <Calendar v-model="selectedStartDate" :style="{ borderRadius: '8px' }" showIcon
                                :manualInput="false" placeholder="DD/MM/YYYY"></Calendar>
                    </div>

                    <div class="field">
                        <label for="description">Type</label>
                        <Dropdown id="state" v-model="status" :options="types" optionLabel="value" optionValue="id"
                            placeholder="Select Type"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Source</label>
                        <Dropdown id="state" v-model="status" :options="sources" optionLabel="value" optionValue="id"
                            placeholder="Select Source"></Dropdown>
                    </div>

                    <div class="field">
                        <label for="description">Receiver</label>
                        <Dropdown id="state" v-model="status" :options="statuses" optionLabel="name" optionValue="id"
                            placeholder="Select Receiver"></Dropdown>
                    </div>

                    <div>
                        <label for="description"
                            :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Customer Comment</label>
                            <Textarea id="orderNotes" v-model="customerProfile" rows="4" class="mt-1"
                                placeholder="Type customer comment here..." :style="{ width: '100%' }"></Textarea>
                    </div>

                    <div class="mt-2">
                        <label for="description"
                            :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Internal Comment</label>
                            <Textarea id="orderNotes" v-model="customerProfile" rows="4" class="mt-1"
                            placeholder="Type customer comment here..." :style="{ width: '100%' }"></Textarea>                    </div>
               
                    <template #footer>
                        <Button type="button" label="Cancel" icon="pi pi-times"
                                    :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF','color':'#122C20 ' }"
                                    @click="hideDialog()"></Button>
                                    <Button type="button" label="Add Feedback" icon="pi pi-plus"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="saveProduct()"></Button>  
                    </template>
                </Dialog>

                <Dialog v-model:visible="filterDialog" :style="{ width: '350px' }" :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-filter p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6" style="color: darkgreen; font-weight: 700; font-size: larger"> More
                                Filters</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>

                    <div class="field">
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses"
                            optionLabel="value" placeholder="Select Payment Status">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{
                                        slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{
                                        slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="field">
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses"
                            optionLabel="value" placeholder="Select Customer">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{
                                        slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{
                                        slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="field">
                        <Calendar v-model="calenderValue" selectionMode="range" :manualInput="false"
                            placeholder="Select Delivery Date">
                        </Calendar>
                    </div>
                    <div class="field">
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses"
                            optionLabel="value" placeholder="Select Delivery Window">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{
                                        slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{
                                        slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>
                    <template #footer>
                        <Button type="button" label="Cancel" icon="pi pi-times"
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9' }" @click="hideDialog" />
                        <Button type="button" label="Save" icon="pi pi-check"
                            :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="saveProduct" />
                    </template>
                </Dialog>
            </div>
        </div>

    </div>
    <Sidebar v-model:visible="showFeedbackDetails" :baseZIndex="1000" position="right" :style="{ width: '400px' }">
        <template #header>
            <h5 class="flex" style="font-weight: 700;color:#122C20">{{selectedItem.company}}</h5>

        </template>
        <div :style="{ 'margin-top': '-5px' }">
            <h5 style="font-weight: 700;color:#122C20">Feedback Details</h5>
            <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Date</div>
                    <div>{{selectedItem.date}}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Business Name</div>
                    <div>{{selectedItem.company}}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Order No. </div>
                    <div>{{selectedItem.order_number}}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Type</div>
                    <div>{{selectedItem.type}}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Receiver</div>
                    <div>{{selectedItem.receiver}}</div>
                </div>
            </div>
            <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>

            <h5 style="font-weight: 700;color:#122C20">Contact Details</h5>
            <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                    <div>{{selectedItem.contact_person}}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Email</div>
                    <div>{{selectedItem.email}}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                    <div>{{selectedItem.order_number}}</div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5 style="font-weight: 700;color:#122C20">Comment</h5>
                <div>{{selectedItem.comment}}</div>

                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                <h5 style="font-weight: 700;color:#122C20">Internal Comment</h5>
                <div>{{selectedItem.internal_comment || '-'}}</div>
            </div>
        </div>
    </Sidebar>
</template>
