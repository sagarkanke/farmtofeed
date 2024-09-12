<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import { OrdersService } from '@/service/OrdersService';
import { ProductService } from '@/service/ProductService';
import { CompanyService } from '@/service/CompanyService';
import { useStore } from 'vuex';
import { PhotoService } from '@/service/PhotoService';
import { PricingService } from '@/service/PricingService';
// Services
const ordersService = new OrdersService();
const productService = new ProductService();
const pricingService = new PricingService();
const store = useStore();
const companyService = new CompanyService();
// Toast and Router
const toast = useToast();
const router = useRouter();

// Reactive References
const orders = ref([]);
const viewProductDetails = ref(false);
const categoryFilter = ref(null);
const gradeFilter = ref(null);
const isLoading = ref(true);
let selectedItem = ref(null);
const selectedOrders = ref(null);
let totalProducts = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const filterDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'active', value: 'Active' },
    { label: 'inactive', value: 'Inactive' },
    { label: 'backInStockSoon', value: 'Back in Stock Soon' }
]);
const grades = ref([
    { label: 'grade1', value: 'Grade 1' },

    { label: 'gradeRescue', value: 'Grade Rescue' },])
const categories = ref([
    { label: 'fruits', value: 'Fruits' },
    { label: 'vegetables', value: 'Vegetables' },
    { label: 'herbs', value: 'Herbs' },
    { label: 'leafyGreens', value: 'Leafy Greens' },
    { label: 'fruits', value: 'Fruits' },
    { label: 'rootsOrTubers', value: 'Roots or Tubers' },
    { label: 'eggs', value: 'Eggs' },
])
const status = ref(null);
let calenderValue = ref(null);
let calendarRange = ref(null);
const photoService = new PhotoService();
const images = ref([]);
const selectedCustomer = ref(null);
const products = ref(null);
const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '960px',
        numVisible: 4
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);
const carouselResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
]);
const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0
});
const paginatorTemplate = `
  FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown
`;

const currentPageReportTemplate = 'Showing {first} to {last} of {totalRecords} orders';
const addCustomerModal = ref(false);
let customerList = ref([]);
let pricingList = ref([]);
// Functions
const fetchAllProductsList = async () => {
    try {
        const data = await productService.fetchAllProducts();
        console.log("Api response ", data);
        products.value = data.data;
        pagination.value.currentPage = data.current_page;
        pagination.value.lastPage = data.last_page;
        pagination.value.perPage = data.per_page;
        pagination.value.total = data.total;
        products.value = data.data.flatMap(product =>
            product.variations.map(variation => ({
                id: product.id,
                sku: variation.sku,
                product: product.name,
                grade: variation.grade.name,
                category: product.category.name,
                units: variation.unit.name,
                semiProcessed: variation.semi_processed || '-',
                size: product.size || '-',
                ripeness: product.ripeness || '-',
                avgShelfLife: variation.average_shelf_life || '-',
                avgPrice: variation.selling_price,
                status: variation.status
            }))
        );;
        console.log("Product list ", products.value);
    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        isLoading.value = false;
    }
};

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const getBadgeSeverity = (inventoryStatus) => {

    switch (inventoryStatus.toLowerCase()) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'warning';
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

const hideDeleteProductDialog = () => {
    deleteProductDialog.value = false;
}

const openFilter = () => {
    product.value = {};
    submitted.value = false;
    filterDialog.value = true;
};

const clearFilter = () => {
    // calenderRange.value = '';
    status.value = '';
    filters.value['global'].value = '';
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

const handleMenuAction = (action, item) => {
    if (item) {
        selectedItem.value = item;
        console.log("Selected Item ", selectedItem.value);
    }
    if (action === 'Edit') {
        store.commit('customers/setSelectedItem', selectedItem);
        router.push('/sales/edit-customer');
    } else if (action === 'Delete') {
        deleteProductDialog.value = true;
    }
    else if (action === 'View') {
        console.log("View action triggered")
        viewProductDetails.value = true;
    }
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

const deleteProduct = async () => {
    try {
        console.log("selectedItem.value.id ", selectedItem.value.id);
        const data = await productService.deleteProduct(selectedItem.value.id);
        if (data) {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });

        }
        deleteProductDialog.value = false;
        fetchAllProductsList();
    } catch (e) {
        console.log("E", e);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });

    }
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

const newProduct = () => {
    router.push({ path: '/inventory/new-product' });
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



const filteredProducts = computed(() => {
    let filtered = [...products.value];

    // Global search filter
    if (filters.value['global']?.value) {
        filtered = filtered.filter(product =>
            Object.values(product).some(val =>
                val.toString().toLowerCase().includes(filters.value['global'].value.toLowerCase())
            )
        );
    }

    // Status filter
    if (status.value) {
        filtered = filtered.filter(product => product.status === status.value);
    }


    // Apply category filter
    if (categoryFilter.value) {
        filtered = filtered.filter(product => product.category === categoryFilter.value);
    }

    // Apply grade filter
    if (categoryFilter.value) {
        filtered = filtered.filter(product =>
            product.variations.some(variation => variation.grade === gradeFilter.value)
        );
    }

    return filtered;
});

const showOrderDetails = (orderData) => {
    const { id: orderId, order_number } = orderData;
    router.push({
        path: `/sales/order-details/${orderId}/${order_number}`,
    });
}

const applyFilter = () => {
    filterDialog.value = false;
}

const hideFilterDialog = () => {
    filterDialog.value = false;
}

const onPageChange = (event) => {
  const page = event.page + 1; // PrimeVue pagination starts at 0
  fetchAllProductsList(page);
};

const getCustomerList = async () => {
    companyService.fetchAllCompanies()
        .then(companies => {
             customerList.value = companies.data;
             console.log("customerList ", customerList.value);
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
} 

const fetchCustomerPricing = async () => {
    try {
        const { data } = await pricingService.fetchAllPricingList();
         pricingList.value = data.map(customer => {
    const productsInfo = customer.custom_pricing.map((pricing,index) => ({
        id: index + 1,
        sku: pricing.unit_variant?.grade_variant?.sku || null,
        product: pricing.unit_variant?.grade_variant?.product?.name || null,
        grade: pricing.unit_variant?.grade_variant?.grade_id || null,
        unit: pricing.unit_variant?.unit_id || null,
        sellingPrice: pricing.selling_price || pricing.unit_variant?.selling_price || null,
        lastModified: pricing.updated_at || pricing.unit_variant?.updated_at || null
    }));

    return {
        customerId: customer.id,
        customerName: customer.name,
        products: productsInfo.length,
        lastModified: productsInfo[0]?.lastModified || null,
        productsInfo
    };
});
        console.log("Pricing List ", pricingList.value)
    } catch (error) {
        console.error('Failed to fetch customer pricing:', error);
    }
};

  

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const showCustomerPricingDetails = (data) => {
    console.log("Data ", data);
    store.dispatch('customerPricing/setCustomerPricingDetails', data);

    router.push('/inventory/customer-pricing-details');
}

// const openAddCustomerPricing () => {
//     router.push({
//         path: ''
//     })
// }


// Lifecycle Hooks
onBeforeMount(() => {
    initFilters();
});

onMounted(async() => {
    fetchCustomerPricing();
    getCustomerList();
    photoService.getImages().then((data) => (images.value = data));

});

</script>


<template>
    <div class="grid" :style="{ 'margin-left': '-50px', 'margin-top': '-30px' }">

        <div class="col-12 lg:col-3 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Total Products</span>
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
                        <span class="block text-500 font-medium mb-1">Active</span>
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
                        <span class="block text-500 font-medium mb-1">Intive</span>
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
                        <span class="block text-500 font-medium mb-1">Back in Stock Soon</span>
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
                <DataTable ref="dt" :value="pricingList" dataKey="id"
                    :paginator="true" :rows="pagination.perPage" :totalRecords="pagination.total" :filters="filters"
                    :paginatorTemplate="paginatorTemplate" :rowsPerPageOptions="[5, 10, 25]"
                    :currentPageReportTemplate="currentPageReportTemplate" :lazy="true"
                    @page="onPageChange">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0 text-color-secondary">Customer Pricing</h5>
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
                            </div>

                            <div class="flex gap-2" :style="{ 'margin-right': '-22px' }">
                                <Button type="button" label="Export" icon="pi pi-file-export"
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                    @click="exportCSV($event)"></Button>
                                <Button type="button" label="Add Customer" icon="pi pi-plus"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="addCustomerModal = true"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="customerId" header="Customer ID" headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">CustomerId</span>
                            <button @click="showCustomerPricingDetails(slotProps.data)"
                                class="p-button p-component p-button-text p-button-plain">
                                <span  :style="{'color': '#747C50'}">{{ slotProps.data.customerId }}</span>
                            </button>

                        </template>
                    </Column>
                    <Column field="customer" header="Customer" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Customer</span>
                            <span>{{ slotProps.data.customerName }}</span>
                        </template>
                    </Column>
                    
                    <Column field="products" header="Products" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Products</span>
                           {{ slotProps.data.products }}
                         </template>
                    </Column>
                
                    <Column field="lastModified" header="Last Modified" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Last Modified</span>
                            {{ formatDate(slotProps.data.lastModified) }} 
                        </template>
                    </Column>
                    


                </DataTable>

                <Dialog v-model:visible="addCustomerModal" :style="{ width: '450px' }"
                    :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Add
                               Customer</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>
                    <div class="field">
                        <label for="name">Customer</label>
                        <Dropdown id="state" v-model="selectedCustomer" :options="customerList" optionLabel="name"
                        placeholder="Select Customer"></Dropdown>
                    </div>
                    <template #footer>
                        <Button type="button" label="Cancel" icon="pi pi-times"
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', color: '#122C20' }"
                            @click="hideDialog()"></Button>
                        <Button type="button" label="Continue" icon="pi pi-arrow-right"
                            :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                            @click="openAddCustomerPricing()"></Button>
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" :closable="false"
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
                            @click="hideDeleteProductDialog()"></Button>
                        <Button type="button" label="Yes, Do it" icon="pi pi-check"
                            :style="{ 'background-color': '#C80000', border: '#C80000', color: '#FFFFFF' }"
                            @click="deleteProduct()"></Button>
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
                        <Dropdown id="inventoryStatus" v-model="categoryFilter" :options="categories"
                            optionLabel="value" placeholder="Category">
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
                        <Dropdown id="inventoryStatus" v-model="gradeFilter" :options="grades" optionLabel="value"
                            placeholder="Grade">
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
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9' }" @click="hideFilterDialog()" />
                        <Button type="button" label="Apply" icon="pi pi-check"
                            :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="applyFilter()" />
                    </template>
                </Dialog>
            </div>
        </div>

    </div>
    <Sidebar v-model:visible="viewProductDetails" :baseZIndex="1000" position="right" :style="{ width: '400px' }">
        <template #header>
            <div class="p-d-flex p-flex-column p-ai-start">
                <h5 class="p-mb-2" style="font-weight: 700; color: #122C20;">
                    {{ selectedItem.product }} ({{ selectedItem.grade }})
                </h5>
                <Badge :value="selectedItem.status"
                    :class="['p-mt-2 p-border-round', getBadgeSeverity(selectedItem.status)]" :style="{
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
                    <div>{{ selectedItem.grade }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Category</div>
                    <div>{{ selectedItem.category }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Default Unit </div>
                    <div>{{ selectedItem.unit }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Ripeness </div>
                    <div>{{ selectedItem.ripeness || '-' }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Shelf Life </div>
                    <div>{{ selectedItem.shelfLife || '-' }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Units</div>
                    <div>{{ selectedItem.units || '-' }}</div>
                </div>
                <div class="flex justify-content-between">
                    <div :style="{ 'font-color': '#808080' }">Processing</div>
                    <div>{{ selectedItem.processing || '-' }}</div>
                </div>

            </div>

            <Accordion :activeIndex="0" :style="{ 'color': '#122C20', 'margin-left': '2px' }">
                <AccordionTab header="E-commerce Description">
                    <p class="line-height-3 m-0">
                        {{ selectedItem.description || '-' }}
                    </p>
                </AccordionTab>
            </Accordion>
            <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
            <Accordion :activeIndex="0" :style="{ 'color': '#122C20', 'margin-left': '2px' }">
                <AccordionTab header="Mobile App Description">
                    <p class="line-height-3 m-0">
                        {{ selectedItem.description || '-' }}
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
<style scoped>
/* Scoped CSS with higher specificity */
.custom-accordion .p-accordion-header-link,
.custom-accordion .p-accordion-header-action {
    color: #122C20 !important;
    margin-left: -15px !important;
}

/* Optionally, you can use the deep combinator to ensure the style is applied even to nested elements */
::v-deep .p-accordion-header-link,
::v-deep .p-accordion-header-action {
    color: #122C20 !important;
    margin-left: -15px !important;
}
</style>
