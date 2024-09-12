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
    { label: 'sourced', value: 'Sourced' },
    { label: 'notSourced', value: 'Not Sourced' },
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
const list = ref([
    {
        id: 1,
        sourcing_date: '2024-09-01',
        product: 'Tomatoes',
        grade: 'A',
        unit: 'Kg',
        quantity: 100,
        buying_price: 50.00,
        supplier: 'Farmer John',
        status: 'Sourced'
    },
    {
        id: 2,
        sourcing_date: '2024-09-02',
        product: 'Potatoes',
        grade: 'B',
        unit: 'Kg',
        quantity: 200,
        buying_price: 30.00,
        supplier: 'Farmer Jane',
        status: 'Not Sourced'
    },
    {
        id: 3,
        sourcing_date: '2024-09-03',
        product: 'Carrots',
        grade: 'A',
        unit: 'Kg',
        quantity: 150,
        buying_price: 40.00,
        supplier: 'Farmer Bill',
        status: 'Sourced'
    },
    {
        id: 4,
        sourcing_date: '2024-09-04',
        product: 'Onions',
        grade: 'C',
        unit: 'Kg',
        quantity: 250,
        buying_price: 20.00,
        supplier: 'Farmer Alice',
        status: 'Not Sourced'
    },
    {
        id: 5,
        sourcing_date: '2024-09-05',
        product: 'Cabbages',
        grade: 'B',
        unit: 'Kg',
        quantity: 180,
        buying_price: 25.00,
        supplier: 'Farmer Bob',
        status: 'Not Sourced'
    },
    {
        id: 6,
        sourcing_date: '2024-09-06',
        product: 'Spinach',
        grade: 'A',
        unit: 'Kg',
        quantity: 120,
        buying_price: 35.00,
        supplier: 'Farmer Charlie',
        status: 'Not Sourced'
    },
    {
        id: 7,
        sourcing_date: '2024-09-07',
        product: 'Peppers',
        grade: 'A',
        unit: 'Kg',
        quantity: 140,
        buying_price: 45.00,
        supplier: 'Farmer Dave',
        status: 'Sourced'
    },
    {
        id: 8,
        sourcing_date: '2024-09-08',
        product: 'Lettuce',
        grade: 'B',
        unit: 'Kg',
        quantity: 160,
        buying_price: 28.00,
        supplier: 'Farmer Eve',
        status: 'Sourced'
    },
    {
        id: 9,
        sourcing_date: '2024-09-09',
        product: 'Cucumbers',
        grade: 'A',
        unit: 'Kg',
        quantity: 130,
        buying_price: 38.00,
        supplier: 'Farmer Frank',
        status: 'Not Sourced'
    },
    {
        id: 10,
        sourcing_date: '2024-09-10',
        product: 'Pumpkins',
        grade: 'C',
        unit: 'Kg',
        quantity: 170,
        buying_price: 22.00,
        supplier: 'Farmer George',
        status: 'Sourced'
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
        case 'sourced':
            return 'success';
        case 'not sourced':
            return 'secondary';
       
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
    const { id: orderId, order_number } = orderData;
    router.push({
        path: `/sales/order-details/${orderId}/${order_number}`,
    });
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
                    :value="list"
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
                            <h5 class="m-0 text-color-secondary">Market Place</h5>
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
  
                            </div>

                            <div class="flex gap-2" :style="{ 'margin-right': '-22px' }">
                                <Button type="button" label="Export" icon="pi pi-file-export" :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color': '#122C20' }" @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="sourcingDate" header="Sourcing Date"  headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.sourcing_date || '-' }}
                        </template>
                    </Column>
                    <Column field="sourcingDate" header="Sourcing Date"  headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Sourcing Date</span>
                            <button @click="showOrderDetails(slotProps.data)" class="p-button p-component p-button-text p-button-plain">
                                {{ slotProps.data?.sourcing_date   || '-'}}
                                </button>

                        </template>
                    </Column>
                    <Column field="product" header="Product"  headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.product || '-' }}
                        </template>
                    </Column>
                    <Column field="grade" header="Grade" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.grade || '-' }}                        </template>
                    </Column>
                    <Column field="unit" header="Unit" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.unit || '-' }}                        </template>
                    </Column>
                    <Column field="quantity" header="Quantity" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.quantity || 0}}                        </template>
                    </Column>
                    <Column field="buyingPrice" header="Buying Price" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.buying_price || 0 }}                        </template>
                    </Column>
                    <Column field="supplier" header="Supplier" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.supplier || '-' }}                        </template>
                    </Column>
                    <Column field="status" header="Status"  headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.status)">{{ slotProps.data.status }}</Tag>
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
