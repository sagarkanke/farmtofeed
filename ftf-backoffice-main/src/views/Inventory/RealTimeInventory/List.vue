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
const selectedGrade = ref(null);
const addCustomerModal = ref(false);
let customerList = ref([]);
let pricingList = ref([]);
const realTimeInventoryList = ref( [
  {
    id: 1,
    sku: 'SKU001',
    product: 'Product A',
    grade: 'Grade 1',
    quantity: 100,
    reOrderLevel: 20,
    sellingPrice: 25.50,
    avgShelfLife: '12 months',
    stock: [
      { id: 1, dateEnteredInWarehouse: '2024-08-01', quantity: 50, flaQuantity: 10, buyingPrice: 20.00 },
      { id: 2, dateEnteredInWarehouse: '2024-08-15', quantity: 30, flaQuantity: 5, buyingPrice: 20.00 }
    ]
  },
  {
    id: 2,
    sku: 'SKU002',
    product: 'Product B',
    grade: 'Grade 2',
    quantity: 200,
    reOrderLevel: 30,
    sellingPrice: 30.00,
    avgShelfLife: '6 months',
    stock: [
      { id: 3, dateEnteredInWarehouse: '2024-08-10', quantity: 70, flaQuantity: 15, buyingPrice: 25.00 },
      { id: 4, dateEnteredInWarehouse: '2024-08-20', quantity: 50, flaQuantity: 10, buyingPrice: 25.00 }
    ]
  },
  {
    id: 3,
    sku: 'SKU003',
    product: 'Product C',
    grade: 'Grade 3',
    quantity: 150,
    reOrderLevel: 25,
    sellingPrice: 45.75,
    avgShelfLife: '9 months',
    stock: [
      { id: 5, dateEnteredInWarehouse: '2024-08-05', quantity: 40, flaQuantity: 12, buyingPrice: 40.00 },
      { id: 6, dateEnteredInWarehouse: '2024-08-18', quantity: 60, flaQuantity: 8, buyingPrice: 40.00 }
    ]
  },
  {
    id: 4,
    sku: 'SKU004',
    product: 'Product D',
    grade: 'Grade 1',
    quantity: 180,
    reOrderLevel: 15,
    sellingPrice: 20.00,
    avgShelfLife: '18 months',
    stock: [
      { id: 7, dateEnteredInWarehouse: '2024-08-12', quantity: 50, flaQuantity: 5, buyingPrice: 18.00 },
      { id: 8, dateEnteredInWarehouse: '2024-08-22', quantity: 70, flaQuantity: 10, buyingPrice: 18.00 }
    ]
  },
  {
    id: 5,
    sku: 'SKU005',
    product: 'Product E',
    grade: 'Grade 2',
    quantity: 250,
    reOrderLevel: 35,
    sellingPrice: 60.00,
    avgShelfLife: '24 months',
    stock: [
      { id: 9, dateEnteredInWarehouse: '2024-08-08', quantity: 80, flaQuantity: 20, buyingPrice: 55.00 },
      { id: 10, dateEnteredInWarehouse: '2024-08-25', quantity: 60, flaQuantity: 12, buyingPrice: 55.00 }
    ]
  },
  {
    id: 6,
    sku: 'SKU006',
    product: 'Product F',
    grade: 'Grade 3',
    quantity: 220,
    reOrderLevel: 40,
    sellingPrice: 35.00,
    avgShelfLife: '6 months',
    stock: [
      { id: 11, dateEnteredInWarehouse: '2024-08-03', quantity: 90, flaQuantity: 20, buyingPrice: 30.00 },
      { id: 12, dateEnteredInWarehouse: '2024-08-17', quantity: 70, flaQuantity: 15, buyingPrice: 30.00 }
    ]
  },
  {
    id: 7,
    sku: 'SKU007',
    product: 'Product G',
    grade: 'Grade 1',
    quantity: 130,
    reOrderLevel: 25,
    sellingPrice: 27.50,
    avgShelfLife: '12 months',
    stock: [
      { id: 13, dateEnteredInWarehouse: '2024-08-07', quantity: 60, flaQuantity: 8, buyingPrice: 22.00 },
      { id: 14, dateEnteredInWarehouse: '2024-08-21', quantity: 40, flaQuantity: 10, buyingPrice: 22.00 }
    ]
  },
  {
    id: 8,
    sku: 'SKU008',
    product: 'Product H',
    grade: 'Grade 2',
    quantity: 170,
    reOrderLevel: 20,
    sellingPrice: 50.00,
    avgShelfLife: '9 months',
    stock: [
      { id: 15, dateEnteredInWarehouse: '2024-08-06', quantity: 70, flaQuantity: 12, buyingPrice: 45.00 },
      { id: 16, dateEnteredInWarehouse: '2024-08-19', quantity: 60, flaQuantity: 8, buyingPrice: 45.00 }
    ]
  },
  {
    id: 9,
    sku: 'SKU009',
    product: 'Product I',
    grade: 'Grade 3',
    quantity: 190,
    reOrderLevel: 30,
    sellingPrice: 40.00,
    avgShelfLife: '15 months',
    stock: [
      { id: 17, dateEnteredInWarehouse: '2024-08-02', quantity: 80, flaQuantity: 15, buyingPrice: 35.00 },
      { id: 18, dateEnteredInWarehouse: '2024-08-20', quantity: 70, flaQuantity: 10, buyingPrice: 35.00 }
    ]
  },
  {
    id: 10,
    sku: 'SKU010',
    product: 'Product J',
    grade: 'Grade 1',
    quantity: 140,
    reOrderLevel: 15,
    sellingPrice: 28.00,
    avgShelfLife: '18 months',
    stock: [
      { id: 19, dateEnteredInWarehouse: '2024-08-11', quantity: 60, flaQuantity: 10, buyingPrice: 22.00 },
      { id: 20, dateEnteredInWarehouse: '2024-08-26', quantity: 50, flaQuantity: 12, buyingPrice: 22.00 }
    ]
  },
  {
    id: 11,
    sku: 'SKU011',
    product: 'Product K',
    grade: 'Grade 2',
    quantity: 210,
    reOrderLevel: 35,
    sellingPrice: 55.00,
    avgShelfLife: '12 months',
    stock: [
      { id: 21, dateEnteredInWarehouse: '2024-08-04', quantity: 90, flaQuantity: 20, buyingPrice: 50.00 },
      { id: 22, dateEnteredInWarehouse: '2024-08-22', quantity: 60, flaQuantity: 15, buyingPrice: 50.00 }
    ]
  },
  {
    id: 12,
    sku: 'SKU012',
    product: 'Product L',
    grade: 'Grade 3',
    quantity: 230,
    reOrderLevel: 40,
    sellingPrice: 70.00,
    avgShelfLife: '24 months',
    stock: [
      { id: 23, dateEnteredInWarehouse: '2024-08-09', quantity: 80, flaQuantity: 18, buyingPrice: 60.00 },
      { id: 24, dateEnteredInWarehouse: '2024-08-23', quantity: 80, flaQuantity: 15, buyingPrice: 60.00 }
    ]
  },
  {
    id: 13,
    sku: 'SKU013',
    product: 'Product M',
    grade: 'Grade 1',
    quantity: 160,
    reOrderLevel: 25,
    sellingPrice: 22.00,
    avgShelfLife: '18 months',
    stock: [
      { id: 25, dateEnteredInWarehouse: '2024-08-13', quantity: 70, flaQuantity: 8, buyingPrice: 20.00 },
      { id: 26, dateEnteredInWarehouse: '2024-08-27', quantity: 50, flaQuantity: 10, buyingPrice: 20.00 }
    ]
  },
  {
    id: 14,
    sku: 'SKU014',
    product: 'Product N',
    grade: 'Grade 2',
    quantity: 180,
    reOrderLevel: 20,
    sellingPrice: 45.00,
    avgShelfLife: '9 months',
    stock: [
      { id: 27, dateEnteredInWarehouse: '2024-08-12', quantity: 60, flaQuantity: 10, buyingPrice: 40.00 },
      { id: 28, dateEnteredInWarehouse: '2024-08-24', quantity: 70, flaQuantity: 12, buyingPrice: 40.00 }
    ]
  },
  {
    id: 15,
    sku: 'SKU015',
    product: 'Product O',
    grade: 'Grade 3',
    quantity: 200,
    reOrderLevel: 30,
    sellingPrice: 50.00,
    avgShelfLife: '15 months',
    stock: [
      { id: 29, dateEnteredInWarehouse: '2024-08-14', quantity: 80, flaQuantity: 12, buyingPrice: 45.00 },
      { id: 30, dateEnteredInWarehouse: '2024-08-28', quantity: 70, flaQuantity: 10, buyingPrice: 45.00 }
    ]
  }
]);
const expandedRows = ref([]);
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

function formatDate(dateStr) {
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-');
    return `${day}/${month}/${year}`;
}



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
             customerList.value = companies;
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
} 

const fetchCustomerPricing = async () =>{
    pricingService.fetchAllPricingList()
        .then(pricing => {
            pricingList.value = pricing.data;
            console.log("Pricing List  ", pricingList.value)
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
}
// Lifecycle Hooks
onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
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

                <DataTable :value="realTimeInventoryList" v-model:expandedRows="expandedRows" dataKey="id" :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                tableStyle="min-width: 60rem">
                <template #header>
                    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                        :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                        <h5 class="m-0 text-color-secondary	">Real Time Inventory</h5>
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
                                <Button type="button" icon="pi pi-filter-fill" label="Filter" outlined @click="openFilter()" />
                            </div>
                            <div>
                                <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()" />
                            </div>
                        </div>

                        
                        <div class="flex gap-2" :style="{ 'margin-right': '-22px' }">
                            <Button type="button" label="Export" icon="pi pi-trash"
                                :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', 'color': '#C80000' }"
                                @click="exportCSV($event)"></Button>
                            <Button type="button" label="Import" icon="pi pi-file-import"
                                :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                @click="addUnitVariantModal()"></Button>
                        </div>
                    </div>
                </template>
                <Column :expander="true" headerStyle="width: 3rem" />
                <Column field="sku" header="SKU">
                    <template #body="slotProps">
                        {{ slotProps.data.sku }}
                    </template>
                </Column>

                <Column field="product" header="Product">
                    <template #body="slotProps">
                        {{ slotProps.data.product }}
                    </template>
                </Column>
                <Column field="grade" header="Grade">
                    <template #body="slotProps">
                        {{ slotProps.data.grade }}
                    </template>
                </Column>
                <Column field="quantity" header="Quantity">
                    <template #body="slotProps">
                        {{ slotProps.data.quantity }}
                    </template>
                </Column>
                <Column field="reOrderLevel" header="Re-Order Level">
                    <template #body="slotProps">
                        {{ slotProps.data.reOrderLevel }}
                    </template>
                </Column>
                <Column field="reOrderValue" header="Re-Order Value">
                    <template #body="slotProps">
                        {{ slotProps.data.reOrderLevel }}
                    </template>
                </Column>
                <Column field="avgShelfLife" header="Avg Shelf Life">
                    <template #body="slotProps">
                        {{ slotProps.data.avgShelfLife }}
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-3">
                        <DataTable :value="slotProps.data.stock" datakey="id">
                            <Column field="dateEnteredInWarehouse" header="Date Entered In Warehouse" :headerStyle="{ color: '#808080' }">
                                <template #body="slotProps">
                                    {{ slotProps.data.dateEnteredInWarehouse }}
                                </template>
                            </Column>
                            <Column field="quantity" header="Quantity" :headerStyle="{ color: '#808080' }">
                                <template #body="slotProps">
                                    {{ slotProps.data.quantity }}
                                </template>
                            </Column>
                            <Column field="flaQuantity" header="FLA Quantity" :headerStyle="{ color: '#808080' }">
                                <template #body="slotProps">
                                    {{ slotProps.data.flaQuantity }}
                                </template>
                            </Column>
                            <Column field="buyingPrice" header="Buying Price" :headerStyle="{ color: '#808080' }">
                                <template #body="slotProps">
                                    {{ slotProps.data.buyingPrice }}
                                </template>
                            </Column>
                           
                        </DataTable>

                    </div>
                </template>
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
                            @click="saveProductVariation()"></Button>
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
                        <Dropdown id="paymentType" v-model="selectedGrade"
                        :options="grades" optionLabel="value" placeholder="Select Grade" />
                    </div>

                    <template #footer>
                        <Button type="button" label="Cancel" icon="pi pi-times"
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color': 'darkgreen' }" @click="hideFilterDialog()" />
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
