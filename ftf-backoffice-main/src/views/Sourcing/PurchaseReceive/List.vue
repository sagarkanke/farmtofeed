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
let selectedItemToDelete = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'pending', value: 'Pending' },
    { label: 'received', value: 'Received' },
    
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
const purchaseReceiveList = ref([
  {
    id: 1,
    orderNo: "ORD-001",
    sourcingDate: "2024-09-01",
    supplier: "ABC Suppliers",
    receivedDate: "2024-09-02",
    items: 10,
    received: 5000,
    rejected: 1,
    sourcingType: "Type A",
    status: "pending",
    lineItems: [
      {
        sku: 'SKU001',
        name: 'Item A',
        grade: { name: 'Grade 1' },
        unit: { name: 'Box' },
        ordered: 10,
        dispatched: 5,
        delivered: 10,
        rejected: 1,
        reason: 'N/A',
        weight_per_unit: 5.5,
        inv_eq: 4,
        processing: 'Processed',
        specifications: 'N/A',
        unit_cost: 20.00
      },
      {
        sku: 'SKU002',
        name: 'Item B',
        grade: { name: 'Grade 2' },
        unit: { name: 'Bag' },
        ordered: 5,
        dispatched: 3,
        delivered: 5,
        rejected: 0,
        reason: 'N/A',
        weight_per_unit: 3.0,
        inv_eq: 2,
        processing: 'Raw',
        specifications: 'N/A',
        unit_cost: 10.00
      }
    ],
    received: [
      {
        id: 1,
        sku: 'SKU001',
        name: 'Item A',
        grade: { name: 'Grade 1' },
        unit: { name: 'Box' },
        ordered: 10,
        dispatched: 5,
        delivered: 10,
        rejected: 1,
        reason: 'N/A'
      },
      {
        id: 2,
        sku: 'SKU002',
        name: 'Item B',
        grade: { name: 'Grade 2' },
        unit: { name: 'Bag' },
        ordered: 5,
        dispatched: 3,
        delivered: 5,
        rejected: 0,
        reason: 'N/A'
      }
    ],
    paid: false,
    createdBy: 'User1',
    created: '2024-09-01T10:00:00Z',
    updated: '2024-09-02T10:00:00Z'
  },
  {
    id: 2,
    orderNo: "ORD-002",
    sourcingDate: "2024-09-02",
    supplier: "XYZ Suppliers",
    receivedDate: "2024-09-04",
    items: 20,
    received: 10000,
    rejected: 2,
    sourcingType: "Type B",
    status: "received",
    lineItems: [
      {
        sku: 'SKU003',
        name: 'Item C',
        grade: { name: 'Grade 3' },
        unit: { name: 'Pallet' },
        ordered: 20,
        dispatched: 10,
        delivered: 20,
        rejected: 2,
        reason: 'N/A',
        weight_per_unit: 8.0,
        inv_eq: 8,
        processing: 'Processed',
        specifications: 'N/A',
        unit_cost: 25.00
      }
    ],
    received: [
      {
        id: 1,
        sku: 'SKU003',
        name: 'Item C',
        grade: { name: 'Grade 3' },
        unit: { name: 'Pallet' },
        ordered: 20,
        dispatched: 10,
        delivered: 20,
        rejected: 2,
        reason: 'N/A'
      }
    ],
    paid: true,
    createdBy: 'User2',
    created: '2024-09-02T09:00:00Z',
    updated: '2024-09-04T09:00:00Z'
  },
  {
    id: 3,
    orderNo: "ORD-003",
    sourcingDate: "2024-09-03",
    supplier: "LMN Suppliers",
    receivedDate: "2024-09-04",
    items: 15,
    received: 7500,
    rejected: 0,
    sourcingType: "Type C",
    status: "pending",
    lineItems: [
      {
        sku: 'SKU001',
        name: 'Item A',
        grade: { name: 'Grade 1' },
        unit: { name: 'Box' },
        ordered: 15,
        dispatched: 10,
        delivered: 15,
        rejected: 0,
        reason: 'N/A',
        weight_per_unit: 5.5,
        inv_eq: 8,
        processing: 'Processed',
        specifications: 'N/A',
        unit_cost: 20.00
      }
    ],
    received: [
      {
        id: 1,
        sku: 'SKU001',
        name: 'Item A',
        grade: { name: 'Grade 1' },
        unit: { name: 'Box' },
        ordered: 15,
        dispatched: 10,
        delivered: 15,
        rejected: 0,
        reason: 'N/A'
      }
    ],
    paid: false,
    createdBy: 'User3',
    created: '2024-09-03T11:00:00Z',
    updated: '2024-09-04T11:00:00Z'
  },
  {
    id: 4,
    orderNo: "ORD-004",
    sourcingDate: "2024-09-04",
    supplier: "OPQ Suppliers",
    receivedDate: "2024-09-07",
    items: 30,
    received: 15000,
    rejected: 5,
    sourcingType: "Type D",
    status: "received",
    lineItems: [
      {
        sku: 'SKU002',
        name: 'Item B',
        grade: { name: 'Grade 2' },
        unit: { name: 'Bag' },
        ordered: 30,
        dispatched: 20,
        delivered: 30,
        rejected: 5,
        reason: 'N/A',
        weight_per_unit: 3.0,
        inv_eq: 15,
        processing: 'Raw',
        specifications: 'N/A',
        unit_cost: 10.00
      }
    ],
    received: [
      {
        id: 1,
        sku: 'SKU002',
        name: 'Item B',
        grade: { name: 'Grade 2' },
        unit: { name: 'Bag' },
        ordered: 30,
        dispatched: 20,
        delivered: 30,
        rejected: 5,
        reason: 'N/A'
      }
    ],
    paid: true,
    createdBy: 'User4',
    created: '2024-09-04T12:00:00Z',
    updated: '2024-09-07T12:00:00Z'
  },
  {
    id: 5,
    orderNo: "ORD-005",
    sourcingDate: "2024-09-05",
    supplier: "RST Suppliers",
    receivedDate: "2024-09-09",
    items: 25,
    received: 12500,
    rejected: 3,
    sourcingType: "Type E",
    status: "pending",
    lineItems: [
      {
        sku: 'SKU003',
        name: 'Item C',
        grade: { name: 'Grade 3' },
        unit: { name: 'Pallet' },
        ordered: 25,
        dispatched: 15,
        delivered: 25,
        rejected: 3,
        reason: 'N/A',
        weight_per_unit: 8.0,
        inv_eq: 10,
        processing: 'Processed',
        specifications: 'N/A',
        unit_cost: 25.00
      }
    ],
    received: [
      {
        id: 1,
        sku: 'SKU003',
        name: 'Item C',
        grade: { name: 'Grade 3' },
        unit: { name: 'Pallet' },
        ordered: 25,
        dispatched: 15,
        delivered: 25,
        rejected: 3,
        reason: 'N/A'
      }
    ],
    paid: false,
    createdBy: 'User5',
    created: '2024-09-05T13:00:00Z',
    updated: '2024-09-09T13:00:00Z'
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
        case 'pending':
            return 'secondary';
        case 'received':
            return 'success';
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

const handleMenuAction = (event, item) => {
    if (item) {
        selectedItemToDelete.value = item;
        if (selectedItemToDelete.value) {
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
    store.commit('purchaseReceive/setSelectedItem', orderData);

    router.push('/sourcing/receive-details')
}

const openNewPurchaseReceive = (data)=>{
    store.commit('purchaseReceive/setSelectedItem', data);
    router.push('/sourcing/new-receive')
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
                    :value="purchaseReceiveList"
                    v-model:selection="selectedOrders"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center" :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0 text-color-secondary">Purchase Receive</h5>
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
                    <Column field="orderNo" header="Order No."  headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order No.</span>
                            <button @click="showOrderDetails(slotProps.data)" class="p-button p-component p-button-text p-button-plain">
                                {{ slotProps.data.orderNo   }}
                                </button>
                        </template>
                    </Column>
                    <Column field="sourcingDate" header="Sourcing Date"  headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Sourcing Date</span>
                            {{ slotProps.data.sourcingDate   }}
                        </template>
                    </Column>
                    <Column field="supplier" header="Supplier"  headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Supplier</span>
                            {{ slotProps.data.supplier }}
                        </template>
                    </Column>
                    <Column field="received" header="Received Date" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order Date</span>
                            {{ slotProps.data.receivedDate }}                        </template>
                    </Column>
                    <Column field="items" header="Items" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Items</span>
                            {{ slotProps.data.items }}                        </template>
                    </Column>
                    <Column field="received" header="Received" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">amount</span>
                            {{ slotProps.data.received?.length }}                        </template>
                    </Column>
                    <Column field="rejected" header="Rejected" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Sourcing Type</span>
                            {{ slotProps.data.sourcingType }}                        </template>
                    </Column>
  
                    <Column field="status" header="Status"  headerStyle="width:14%; min-width:7rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.status)">{{ slotProps.data.status }}</Tag>
                        </template>
                    </Column>
                
                    <Column headerStyle="width:10%; min-width:14rem;">
                        <template #body="slotProps">
                            <Button type="button" label="Receive Order" icon="pi-file " class="text-base	" @click="openNewPurchaseReceive(slotProps.data)"
                                :style="{ 'background-color': '#F7E6D4', border: '#F7E6D4', 'color': '#814E18' }">
                            </Button>
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
    <Sidebar v-model:visible="viewBillingDetails" :baseZIndex="1000" position="right" :style="{ width: '400px' }">
        <template #header>
            <div class="p-d-flex p-flex-column p-ai-start">
                <h5 class="p-mb-2" style="font-weight: 700; color: #122C20;">
                    {{ selectedItem?.product }} ({{ selectedItem?.grade }})
                </h5>
                <Badge :value="selectedItem?.status"
                    :class="['p-mt-2 p-border-round', getBadgeSeverity('active')]" :style="{
                        'background-color': '#DFEDDF',
                        'border': '#DFEDDF',
                        'color': '#122C20'
                    }">
                </Badge>
            </div>
        </template>
        <div :style="{ 'margin-top': '-2px' }">
            <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Grade</div>
                    <div>{{ selectedItem?.grade }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Category</div>
                    <div>{{ selectedItem?.category }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Default Unit </div>
                    <div>{{ selectedItem?.unit }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Ripeness </div>
                    <div>{{ selectedItem?.ripeness || '-' }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Shelf Life </div>
                    <div>{{ selectedItem?.shelfLife || '-' }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Units</div>
                    <div>{{ selectedItem?.units || '-' }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Processing</div>
                    <div>{{ selectedItem?.processing || '-' }}</div>
                </div>

            </div>

            <Accordion :activeIndex="0" :style="{ 'color': '#122C20', 'margin-left': '2px' }">
                <AccordionTab header="E-commerce Description">
                    <p class="line-height-3 m-0">
                        {{ selectedItem?.description || '-' }}
                    </p>
                </AccordionTab>
            </Accordion>
            <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
            <Accordion :activeIndex="0" :style="{ 'color': '#122C20', 'margin-left': '2px' }">
                <AccordionTab header="Mobile App Description">
                    <p class="line-height-3 m-0">
                        {{ selectedItem?.description || '-' }}
                    </p>
                </AccordionTab>
            </Accordion>
            <h5 :style="{ 'color': '#5F6D7E', 'font-weight': 'bold' }">Product Images</h5>
            <Galleria :value="images" :responsiveOptions="galleriaResponsiveOptions" :numVisible="7" :circular="true"
                containerStyle="max-width: 800px; margin: auto">
                <template #item="slotProps">
                    <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                        style="width: 100%; display: block" />
                </template>
                <template #thumbnail="slotProps">
                    <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt"
                        tyle="width: 100%; display: block;" />
                </template>
            </Galleria>
        </div>
    </Sidebar>
</template>
