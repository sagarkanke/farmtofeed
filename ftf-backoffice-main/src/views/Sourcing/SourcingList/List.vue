<script setup>
import { ref, onMounted, onBeforeMount,computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import { OrdersService } from '@/service/OrdersService';
import { ProductService } from '@/service/ProductService';
import { useStore } from 'vuex';
// Services
const ordersService = new OrdersService();
const productService = new ProductService();
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
    { label: 'raised', value: 'Raised' },
    { label: 'pending', value: 'Pending' }
]);
const status = ref(null);
let calenderValue = ref(null);
let calendarRange = ref(null);
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
    product.value = {};
    submitted.value = false;
    filterDialog.value = true;
};

const getItems = (rowData) => {
    return [
        {
            label: 'Edit Order ',
            icon: 'pi pi-fw pi-pencil',
            command: () => handleMenuAction('Edit', rowData)
        },
        {
            label: 'Delete Order',
            icon: 'pi pi-fw pi-trash',
            command: () => handleMenuAction('Delete', rowData)
        }
    ];
};

const handleMenuAction = (event, item) => {
    if (item) {
        selectedItemToDelete.value = item;
        if (selectedItemToDelete.value) {
            couponCode.value = selectedItemToDelete.value.code;
            const type = selectedItemToDelete.value.type;
            const normalizedType = type ? type.toLowerCase() : '';

            const couponType = couponTypes.value.find(type => type.name.toLowerCase() === normalizedType);
            selectedCouponType.value = couponType ? couponType.id : null;

            const discountType = selectedItemToDelete.value.discount_type;
            const normalizedDiscountType = discountType ? discountType.toLowerCase() : '';
            const discountTypeItem = discountTypes.value.find(type => type.label.toLowerCase() === normalizedDiscountType);
            selectedDiscountType.value = discountTypeItem ? discountTypeItem.label : null;

            selectedStartDate.value = selectedItemToDelete.value.start_date ? new Date(selectedItemToDelete.value.start_date) : null;
            selectedEndDate.value = selectedItemToDelete.value.end_date ? new Date(selectedItemToDelete.value.end_date) : null;
            couponAmount.value = selectedItemToDelete.value.discount_value;
            selectedCustomer.value = selectedItemToDelete.value.customer || '';
            userLimit.value = selectedItemToDelete.value.total_usage_limit;
        }
    }


    if (event === 'Edit') {
        editDeductions.value = true;
    } else if (event === 'Delete') {
        deleteProductDialog.value = true;
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
                        <span class="block text-500 font-medium mb-1">Total Farmers</span>
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
                        <span class="block text-500 font-medium mb-1">Active</span>
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
                        <span class="block text-500 font-medium mb-1">Inactive</span>
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
                        <span class="block text-500 font-medium mb-1">Cancelled</span>
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
                    :value="filteredOrders"
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
                            <h5 class="m-0 text-color-secondary">Sourcing List</h5>
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
                                    <!-- <label for="state">Status</label> -->
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                <div>
                                    <Calendar v-model="calendarRange" selectionMode="range" :manualInput="false" placeholder="Select Date Range" @change="filterByDate"></Calendar>
                                </div>
                            </div>

                            <div class="flex gap-2" :style="{ 'margin-right': '-22px' }">
                                <Button type="button" label="Export" icon="pi pi-file-export" :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color': '#122C20' }" @click="exportCSV($event)"></Button>
                                <Button type="button" label="Create P.O" icon="pi pi-plus" :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="newOrder()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="date" header="Date"  headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            <button @click="showOrderDetails(slotProps.data)" class="p-button p-component p-button-text p-button-plain">
                                {{ slotProps.data.date   }}
                                </button>

                        </template>
                    </Column>
                    <Column field="sku" header="SKU"  headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">SKU</span>
                            {{ slotProps.data.company.sku }}
                        </template>
                    </Column>
                    <Column field="product" header="Product" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Product</span>
                            {{ slotProps.data.product }}                        </template>
                    </Column>
                    <Column field="grade" header="Grade" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Grade</span>
                            {{ slotProps.data.grade }}                        </template>
                    </Column>
                    <Column field="kgToday" header="KGs Today" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">KGs Today</span>
                            {{ slotProps.data.kgToday }}                        </template>
                    </Column>
                    <Column field="kgTomorrow" header="KGs Tomorrow" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">KGs Tomorrow</span>
                            {{ slotProps.data.kgTomorrow }}                        </template>
                    </Column>
                    <Column field="kgDayAfter" header="KGs Day After" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">KGs Day After</span>
                            {{ slotProps.data.kgDayAfter }}                        </template>
                    </Column>
                    <Column field="status" header="Status"  headerStyle="width:14%; min-width:7rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.status)">{{ slotProps.data.status }}</Tag>
                        </template>
                    </Column>
                    <Column field="orderNo" header="Order No."  headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Order No.</span>
                            <span :style="{'color': '#747C50'}">{{ slotProps.data.items_count }}    </span>
                            <!-- {{ formatCurrency(slotProps.data.price) }} -->
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:8rem;">
                        <template #body="slotProps">
                            <Button type="button" label="Raise LPO" icon="pi pi-receipt
                            " class="text-base	"
                                :style="{ 'background-color': '#F7E6D4', border: '#F7E6D4', 'color': '#814E18' }">
                            </Button>
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
                            <span class="p-ml-n6" style="color: darkgreen; font-weight: 700; font-size: larger"> More Filters</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>

                    <div class="field">
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="value" placeholder="Select Payment Status">
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
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="value" placeholder="Select Customer">
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
                        <Calendar v-model="calenderValue" selectionMode="range" :manualInput="false" placeholder="Select Delivery Date"></Calendar>
                    </div>
                    <div class="field">
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="value" placeholder="Select Delivery Window">
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
                    <template #footer>
                        <Button type="button" label="Cancel" icon="pi pi-times" :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9' }" @click="hideDialog" />
                        <Button type="button" label="Save" icon="pi pi-check" :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="saveProduct" />
                    </template>
                </Dialog>
            </div>
        </div>

    </div>
</template>
