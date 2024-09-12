<script setup>
import { ref, onMounted, onBeforeMount,computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import { OrdersService } from '@/service/OrdersService';
import { ProductService } from '@/service/ProductService';
import { useStore } from 'vuex';
import { SupplierService } from '@/service/SupplierService';
// Services
const ordersService = new OrdersService();
const productService = new ProductService();
const supplierService = new SupplierService();
const store = useStore();

// Toast and Router
const toast = useToast();
const router = useRouter();

// Reactive References
const orders = ref([]);
const editingRows = ref([]);
const isLoading = ref(true);
const selectedOrders = ref(null);
const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const filterDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
let selectedItem = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'validated', value: 'Validated' },
    { label: 'received', value: 'Received' },
    { label: 'paid', value: 'Paid' },

]);
const status = ref(null);
let calenderValue = ref(null);
let calendarRange = ref(null);
const sourcingMethods = ref([
    { label: 'pickup', value: 'Pickup' },
    { label: 'delivery', value: 'Delivery' },
])
const selectedSourcingMethod = ref(null);
const sourcingTimes = ref([
    { label: 'before5Am', value: 'Before 5:00 am' },
    { label: 'before12Pm', value: 'Before 12:00 pm' },
    { label: 'before5Pm', value: 'Before 5:00 pm' },
])
const selectedSourcingTime = ref(null);
let supplierList = ref([])
const viewBillingDetails = ref(false);
const nestedRouteItems = ref([
    { label: 'Order Items', key: 'orderItems' },
    { label: 'Received', key: 'received' },
]);
const activeTab = ref('orderItems');
const billsList = ref([
    {
        id: 1,
        sourcingDate: "2024-09-01",
        foNo: "FO-001",
        supplier: "ABC Suppliers",
        items: 10,
        rejectedItems: 1,
        total: 5000,
        dateReceived: "2024-09-02",
        txnCode: "TXN-001",
        txnCost: 4500,
        txnDate: "2024-09-03",
        status: "validated",
        order_line_items: [
            {
                id: 1,
                sku: "SKU-001",
                product: "Product 1",
                grade: "Grade A",
                quantity: 100,
                unit: "kg",
                buying_price: 50,
                overridden_bp: 48,
                transport: true
            },
            {
                id: 2,
                sku: "SKU-002",
                product: "Product 2",
                grade: "Grade B",
                quantity: 150,
                unit: "kg",
                buying_price: 55,
                overridden_bp: 52,
                transport: false
            },
            {
                id: 3,
                sku: "SKU-003",
                product: "Product 3",
                grade: "Grade C",
                quantity: 200,
                unit: "kg",
                buying_price: 45,
                overridden_bp: 43,
                transport: true
            }
        ]
    },
    {
        id: 2,
        sourcingDate: "2024-09-02",
        foNo: "FO-002",
        supplier: "XYZ Suppliers",
        items: 20,
        rejectedItems: 2,
        total: 10000,
        dateReceived: "2024-09-04",
        txnCode: "TXN-002",
        txnCost: 9000,
        txnDate: "2024-09-05",
        status: "received",
        order_line_items: [
            {
                id: 1,
                sku: "SKU-004",
                product: "Product 4",
                grade: "Grade D",
                quantity: 250,
                unit: "liters",
                buying_price: 40,
                overridden_bp: 38,
                transport: true
            },
            {
                id: 2,
                sku: "SKU-005",
                product: "Product 5",
                grade: "Grade E",
                quantity: 300,
                unit: "liters",
                buying_price: 35,
                overridden_bp: 33,
                transport: false
            },
            {
                id: 3,
                sku: "SKU-006",
                product: "Product 6",
                grade: "Grade F",
                quantity: 350,
                unit: "liters",
                buying_price: 30,
                overridden_bp: 28,
                transport: true
            }
        ]
    },
    {
        id: 3,
        sourcingDate: "2024-09-03",
        foNo: "FO-003",
        supplier: "LMN Suppliers",
        items: 15,
        rejectedItems: 0,
        total: 7500,
        dateReceived: "2024-09-04",
        txnCode: "TXN-003",
        txnCost: 7000,
        txnDate: "2024-09-06",
        status: "paid",
        order_line_items: [
            {
                id: 1,
                sku: "SKU-007",
                product: "Product 7",
                grade: "Grade G",
                quantity: 75,
                unit: "packs",
                buying_price: 80,
                overridden_bp: 78,
                transport: true
            },
            {
                id: 2,
                sku: "SKU-008",
                product: "Product 8",
                grade: "Grade H",
                quantity: 100,
                unit: "packs",
                buying_price: 70,
                overridden_bp: 68,
                transport: false
            },
            {
                id: 3,
                sku: "SKU-009",
                product: "Product 9",
                grade: "Grade I",
                quantity: 125,
                unit: "packs",
                buying_price: 60,
                overridden_bp: 58,
                transport: true
            }
        ]
    },
    {
        id: 4,
        sourcingDate: "2024-09-04",
        foNo: "FO-004",
        supplier: "OPQ Suppliers",
        items: 30,
        rejectedItems: 5,
        total: 15000,
        dateReceived: "2024-09-07",
        txnCode: "TXN-004",
        txnCost: 13500,
        txnDate: "2024-09-08",
        status: "validated",
        order_line_items: [
            {
                id: 1,
                sku: "SKU-010",
                product: "Product 10",
                grade: "Grade J",
                quantity: 200,
                unit: "pieces",
                buying_price: 120,
                overridden_bp: 115,
                transport: false
            },
            {
                id: 2,
                sku: "SKU-011",
                product: "Product 11",
                grade: "Grade K",
                quantity: 250,
                unit: "pieces",
                buying_price: 110,
                overridden_bp: 105,
                transport: true
            },
            {
                id: 3,
                sku: "SKU-012",
                product: "Product 12",
                grade: "Grade L",
                quantity: 300,
                unit: "pieces",
                buying_price: 100,
                overridden_bp: 95,
                transport: false
            }
        ]
    },
    {
        id: 5,
        sourcingDate: "2024-09-05",
        foNo: "FO-005",
        supplier: "RST Suppliers",
        items: 25,
        rejectedItems: 3,
        total: 12500,
        dateReceived: "2024-09-09",
        txnCode: "TXN-005",
        txnCost: 12000,
        txnDate: "2024-09-10",
        status: "received",
        order_line_items: [
            {
                id: 1,
                sku: "SKU-013",
                product: "Product 13",
                grade: "Grade M",
                quantity: 175,
                unit: "units",
                buying_price: 75,
                overridden_bp: 72,
                transport: true
            },
            {
                id: 2,
                sku: "SKU-014",
                product: "Product 14",
                grade: "Grade N",
                quantity: 200,
                unit: "units",
                buying_price: 70,
                overridden_bp: 68,
                transport: false
            },
            {
                id: 3,
                sku: "SKU-015",
                product: "Product 15",
                grade: "Grade O",
                quantity: 225,
                unit: "units",
                buying_price: 65,
                overridden_bp: 63,
                transport: true
            }
        ]
    }
]);

const farmerOrders  = ref([
    {
        id: 1,
        orderNo: 'ORD1234',
        sourcingDate: '2024-08-01',
        supplier: 'Supplier A',
        orderDate: '2024-07-31',
        items: 'Avocado',
        amount: 100,
        sourcingType: 'Direct',
        sourcingTime: 'Morning',
        status: 'Active'
    },
    {
        id: 2,
        orderNo: 'ORD5678',
        sourcingDate: '2024-08-02',
        supplier: 'Supplier B',
        orderDate: '2024-08-01',
        items: 'Tomato',
        amount: 80,
        sourcingType: 'Indirect',
        sourcingTime: 'Afternoon',
        status: 'Inactive'
    },
    {
        id: 3,
        orderNo: 'ORD9101',
        sourcingDate: '2024-08-03',
        supplier: 'Supplier C',
        orderDate: '2024-08-02',
        items: 'Potato',
        amount: 90,
        sourcingType: 'Direct',
        sourcingTime: 'Evening',
        status: 'Active'
    },
    {
        id: 4,
        orderNo: 'ORD1121',
        sourcingDate: '2024-08-04',
        supplier: 'Supplier D',
        orderDate: '2024-08-03',
        items: 'Onion',
        amount: 70,
        sourcingType: 'Indirect',
        sourcingTime: 'Morning',
        status: 'Inactive'
    },
    {
        id: 5,
        orderNo: 'ORD3141',
        sourcingDate: '2024-08-05',
        supplier: 'Supplier E',
        orderDate: '2024-08-04',
        items: 'Garlic',
        amount: 60,
        sourcingType: 'Direct',
        sourcingTime: 'Afternoon',
        status: 'Active'
    },
    {
        id: 6,
        orderNo: 'ORD5161',
        sourcingDate: '2024-08-06',
        supplier: 'Supplier F',
        orderDate: '2024-08-05',
        items: 'Cucumber',
        amount: 110,
        sourcingType: 'Indirect',
        sourcingTime: 'Evening',
        status: 'Inactive'
    }
])
// Functions
const fetchAllOrders = async () => {
    try {
        const data = await ordersService.fetchAllOrders();
        orders.value = data;
    } catch (error) {
        console.error("Error fetching orders:", error);
    }finally {
        isLoading.value = false;
      }
};
const getSupplierList = async () => {
    supplierService.getSupplierList()
        .then(companies => {
          
            supplierList.value = companies;
            console.log("supplierList.value ", supplierList.value);
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
}
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const getBadgeSeverity = (inventoryStatus) => {
    switch (inventoryStatus.toLowerCase()) {
        case 'received':
            return 'secondary';
        case 'validated':
            return 'danger';
        case 'paid':
            return 'success';
        default:
            return 'info';
    }
};



const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const openFilter = () => {
    console.log("Open filter called ")
    product.value = {};
    submitted.value = false;
    filterDialog.value = true;
    console.log(" filterDialog ", filterDialog.value);
};

const getItems = (rowData) => {
    return [
        {
            label: 'View',
            icon: 'pi pi-fw pi-eye',
            command: () => handleMenuAction('View', rowData)
        },
    ];
};

const handleMenuAction = (event, item) => {
    if (item) {
        selectedItem.value = item;
        if (selectedItem.value) {
            // couponCode.value = selectedItemToDelete.value.code;
            // const type = selectedItemToDelete.value.type;
            // const normalizedType = type ? type.toLowerCase() : '';

            // const couponType = couponTypes.value.find(type => type.name.toLowerCase() === normalizedType);
            // selectedCouponType.value = couponType ? couponType.id : null;

            // const discountType = selectedItemToDelete.value.discount_type;
            // const normalizedDiscountType = discountType ? discountType.toLowerCase() : '';
            // const discountTypeItem = discountTypes.value.find(type => type.label.toLowerCase() === normalizedDiscountType);
            // selectedDiscountType.value = discountTypeItem ? discountTypeItem.label : null;

            // selectedStartDate.value = selectedItemToDelete.value.start_date ? new Date(selectedItemToDelete.value.start_date) : null;
            // selectedEndDate.value = selectedItemToDelete.value.end_date ? new Date(selectedItemToDelete.value.end_date) : null;
            // couponAmount.value = selectedItemToDelete.value.discount_value;
            // selectedCustomer.value = selectedItemToDelete.value.customer || '';
            // userLimit.value = selectedItemToDelete.value.total_usage_limit;
        }
    }


    if (event === 'Edit') {
        editDeductions.value = true;
    } else if (event === 'Delete') {
        deleteProductDialog.value = true;
    }else if(event === 'View'){
        viewBillingDetails.value = true;
    }

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
    router.push({ path: '/sourcing/new-farmer-orders' });
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

const onRowEditSave = (event) => {
    let { newData, index } = event;

    billsList.value[index] = newData;
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
                        <span class="block text-500 font-medium mb-1">New</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="danger" class="ml-2 mt--2"> <i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89%</Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Accepted</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="success" class="ml-2 mt--2"> <i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Received</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="info" class="ml-2 mt--2"><i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Paid</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="warning" class="ml-2 mt--2"><i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                
                <DataTable
                    ref="dt"
                    :value="billsList"
                    v-model:selection="selectedOrders"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    editMode="row"
                    v-model:editingRows="editingRows"
                    :filters="filters"
                    @row-edit-save="onRowEditSave"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                    :pt="{
                        table: { style: 'min-width: 50rem' },
                        column: {
                            bodycell: ({ state }) => ({
                                style:  state['d_editing']&&'padding-top: 0.75rem; padding-bottom: 0.75rem'
                            })
                        }
                    }"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center" :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0 text-color-secondary">Bills</h5>
                        </div>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-15px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                                    </IconField>
                                </div>
                                <div>
                                    <Calendar v-model="calendarRange" selectionMode="range" :manualInput="false" placeholder="Select Date Range" @change="filterByDate"></Calendar>
                                </div>
                                <div>
                                    <!-- <label for="state">Status</label> -->
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                
                                <div>
                                    <Button type="button" icon="pi pi-filter" label="Filter" outlined
                                        @click="openFilter()"
                                        :style="{'background-color':'#DFEDDF','border':'#DFEDDF','color': '#122C20'}" />
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()"
                                        :style="{'background-color':'#DFEDDF','border':'#DFEDDF','color': '#122C20'}" />
                                </div>
                            </div>

                            <div class="flex gap-2" :style="{ 'margin-right': '-22px' }">
                                <Button type="button" label="Export" icon="pi pi-file-export" :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color': '#122C20' }" @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="sourcingDate" header="Sourcing Date"  headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.sourcingDate   }}

                        </template>
                    </Column>
                    <Column field="foNo" header="FO No."  headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span :style="{'color': '#747C50'}">{{ slotProps.data.foNo }}</span>
                        
                        </template>
                    </Column>
                    
                    <Column field="supplier" header="Supplier"  headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.supplier }}
                        </template>
                    </Column>
                    <Column field="items" header="Items" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Items</span>
                            {{ slotProps.data.items }}                        </template>
                    </Column>
                    <Column field="rejectedItems" header="Rejected Items" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.rejectedItems }}   
                                             </template>
                    </Column>
                    <Column field="total" header="Total" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.total }}   
                                             </template>
                    </Column>
                    <Column field="dateReceived" header="Date Received" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.dateReceived }}   
                                             </template>
                    </Column>
                    <Column field="txnCode" header="TXN Code" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data, field }">
                            {{ data[field] || 0 }}
                        </template>
                        <template #editor="{ data, field }">
                            <InputText v-model="data[field]" fluid />
                        </template>
                    </Column>
                    <Column field="txnCost" header="TXN Cost" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data, field }">
                            {{data[field] }}
                        </template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" fluid />
                        </template>
                    </Column>
                    <Column field="txnDate" header="TXN Date" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data, field }">
                            {{data[field] }}
                        </template>
                        <template #editor="{ data, field }">
                            <Calendar v-model="data[field]" fluid />
                        </template>
                    </Column>
                    <Column field="status" header="Status"  headerStyle="width:14%; min-width:7rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.status)">{{ slotProps.data.status }}</Tag>
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:8rem;">
                        <template #body="slotProps">
                            <Button type="button" label="Validate" icon="pi pi-receipt
                            " class="text-base	"
                                :style="{ 'background-color': '#F7E6D4', border: '#F7E6D4', 'color': '#814E18' }">
                            </Button>
                        </template>
                    </Column>
                    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
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

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
                    <img :src="'/demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="value" placeholder="Select a Status">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="field">
                        <label class="mb-3">Category</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Price</label>
                            <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" :invalid="submitted && !product.price" :required="true" />
                            <small class="p-invalid" v-if="submitted && !product.price">Price is required.</small>
                        </div>
                        <div class="field col">
                            <label for="quantity">Quantity</label>
                            <InputNumber id="quantity" v-model="product.quantity" integeronly />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" text="" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
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
                        <Dropdown id="inventoryStatus" v-model="product.supplierId" :options="supplierList"
                            optionLabel="value" placeholder="Select Supplier">
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
                            placeholder="Select Order Date">
                        </Calendar>
                    </div>
                    <div class="field">
                        <Dropdown id="inventoryStatus" v-model="product.sourcingType" :options="sourcingTypes"
                            optionLabel="value" placeholder="Select Sourcing Type">
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
                        <Dropdown id="inventoryStatus" v-model="product.sourcingTime" :options="sourcingTimes"
                            optionLabel="value" placeholder="Select Sourcing Time">
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
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }" @click="hideDialog" />
                        <Button type="button" label="Save" icon="pi pi-check"
                            :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="saveProduct" />
                    </template>
                </Dialog>
            </div>
        </div>

    </div>
    <Sidebar v-model:visible="viewBillingDetails" :baseZIndex="1000" position="right" :style="{ width: '600px' }">
        <template #header>
            <div class="p-d-flex p-flex-column p-ai-start">
                <h5 class="p-mb-2" style="font-weight: 700; color: #122C20;">
                    {{ selectedItem?.foNo }}
                </h5>
                <span class="text-base font-bold	            " :style="{ 'color': '#122C20' }">Bill Details</span>

            </div>
        </template>
        <div :style="{ 'margin-top': '-3px' }">
            <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Delivery Date</div>
                    <div>{{ selectedItem?.sourcingDate }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Sourcing Date</div>
                    <div>{{ selectedItem?.sourcingDate }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Supplier</div>
                    <div>{{ selectedItem?.supplier }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Farmer Order No. </div>
                    <div>{{ selectedItem?.foNo }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Receiver</div>
                    <div>{{ selectedItem?.receiver || '-' }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Bill Total</div>
                    <div>{{ selectedItem?.total || '-' }}</div>
                </div>

            </div>

            <div class="mt-4">
                <div class="custom-tabmenu-wrapper">
                  <TabMenu
                    :model="nestedRouteItems"
                    :activeIndex="nestedRouteItems.findIndex(item => item.key === activeTab)"
                    @tab-change="handleTabChange"
                  />
                </div>
              </div>

            <div class="ml-3 mt-4" v-if="activeTab === 'orderItems'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Line Items</h5>
                <DataTable ref="dt" :value="selectedItem?.order_line_items" v-model:selection="selectedProducts"
                    dataKey="id" :paginator="true" :rows="10" :filters="filters" showGridLines
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    :style="{ 'margin-left': '-10px' }">


                    <Column field="sku" header="SKU" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">

                            {{ slotProps.data?.sku }}
                        </template>
                    </Column>
                    <Column field="product" header="Product" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">

                            {{ slotProps.data?.product }}
                        </template>
                    </Column>
                    <Column field="grade" header="Grade" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.grade }}
                        </template>
                    </Column>
                    <Column field="quantity" header="Quantity" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.quantity }}
                        </template>
                    </Column>
                    <Column field="unit" header="Unit" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.unit }}
                        </template>
                    </Column>
                    <Column field="buyingPrice" header="Buying Price" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.buying_price }}
                        </template>
                    </Column>
                    <Column field="overriddenBp" header="Overriden BP." headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.overridden_bp }}
                        </template>
                    </Column>
                    <Column field="transport" header="Transport" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">

                            <i :class="slotProps.data.transport ? 'pi pi-check-circle' : 'pi pi-times-circle'" />

                        </template>
                    </Column>
                    <Column field="total" header="Total" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.buying_price }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div class="ml-3 mt-4" v-if="activeTab === 'received'">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Received</h5>

                <DataTable ref="dt" :value="selectedItem?.received_items" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    :style="{ 'margin-left': '-10px' }">
                    
                    <Column field="sku" header="SKU" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.sku || '-' }}
                        </template>
                    </Column>
                    <Column field="name" header="Name" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.name || '-' }}
                        </template>
                    </Column>
                    <Column field="grade" header="Grade"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.grade || '-'}}
                        </template>
                    </Column>
                    <Column field="unit" header="Unit"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.unit || '-' }}
                        </template>
                    </Column>
                    <Column field="weightPerUnit" header="Weight/Unit" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.weightPerUnit || '-' }}
                        </template>
                    </Column>
                    <Column field="ordered" header="Ordered" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.ordered || '-' }}
                        </template>
                    </Column>
                    <Column field="received" header="Received" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.received || '-' }}
                        </template>
                    </Column>
                    <Column field="inventoryEq" header="Inventory EQ" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.inventoryEq || '-' }}
                        </template>
                    </Column>

                </DataTable>
            </div>

        </div>
    </Sidebar>
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