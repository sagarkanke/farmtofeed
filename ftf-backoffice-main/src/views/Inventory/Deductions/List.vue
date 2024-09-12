<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { CouponsService } from '@/service/CouponsService';
import { CompanyService } from '@/service/CompanyService';

const toast = useToast();
let selectedItemToDelete = ref(null);
const router = useRouter();
const products = ref(null);
const productDialog = ref(false);
const couponsService = new CouponsService();
const companyService = new CompanyService();
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const filterDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
let customerList = ref(null);
const selectedCustomer = ref(null);
const statuses = ref([
    { label: 'pending', value: 'Pending' },
    { label: 'validated', value: 'Validated' },
]);
const couponTypes = ref([
    { id: 1, name: 'Company Wise' },
    { id: 2, name: 'Free Delivery' },
    { id: 3, name: 'General' },
    { id: 4, name: 'First Time Order' }
]);
const discountTypes = ref([
    { label: 'percentage', name: 'Percentage' },
    { label: 'fixed', name: 'Fixed' },

]);
const deductionTypes = ref([
    { label: 'loss', name: 'Loss' },
    { label: 'staff_lunch', name: 'Staff Lunch' },
    { label: 'samples', name: 'Samples' },
    { label: 'donations', name: 'Donations' },
])
const selectedDeductionType = ref(null);
const reasonForLoses = ref([
    { label: 'cold_room_failure', name: 'Cold Room Failure' },
    { label: 'wrong_forecasting', name: 'Wrong Forecasting' },
    { label: 'semi_processing', name: 'Semi Processing' },
    { label: 'poor_sorting', name: 'Poor sorting' },
    { label: 'no_cold_room_space', name: 'No old room space' },
    { label: 'customer_order_cancellation', name: 'Customer order cancellation' },
    { label: 'customer_rejection', name: 'Customer rejection' },

]);
const selectedReasonForLoss = ref(null);
let productList = ref(null);
let productDropdown = ref(null);
const selectedDiscountType = ref(null);
const couponAmount = ref(null);
const selectedCouponType = ref(null);
const status = ref(null);
const productService = new ProductService();
const addFlashSale = ref(false);
let calenderValue = ref(null);
const editFlashSaleDialog = ref(false);
const couponsList = ref([]);
let couponCode = ref(null);
const selectedStartDate = ref(null);
const selectedEndDate = ref(null);
const userLimit = ref(0);
const addDeductionFlag = ref(false);
const selectedProduct = ref(null);
const editDeductions = ref(false);
// const items = ref([
//     { label: 'Edit', icon: 'pi pi-fw pi-plus', command: (event) => handleMenuAction('Edit', event.item) },
//     { label: 'Delete', icon: 'pi pi-fw pi-trash', command: (event) => handleMenuAction('Delete', event.item) }
// ]);

const deductions = ref([
    { id: 1, date: '2024-08-01', sku: 'SKU12345', product: 'Oranges', type: 'Type A', type_description: 'Fruit type A', quantity: '50', qbreference: 'QB123', is_active: true },
    { id: 2, date: '2024-08-02', sku: 'SKU12346', product: 'Apples', type: 'Type B', type_description: 'Fruit type B', quantity: '60', qbreference: 'QB124', is_active: false },
    { id: 3, date: '2024-08-03', sku: 'SKU12347', product: 'Bananas', type: 'Type C', type_description: 'Fruit type C', quantity: '70', qbreference: 'QB125', is_active: true },
    { id: 4, date: '2024-08-04', sku: 'SKU12348', product: 'Grapes', type: 'Type A', type_description: 'Fruit type A', quantity: '55', qbreference: 'QB126', is_active: false },
    { id: 5, date: '2024-08-05', sku: 'SKU12349', product: 'Pineapples', type: 'Type B', type_description: 'Fruit type B', quantity: '65', qbreference: 'QB127', is_active: true },
    { id: 6, date: '2024-08-06', sku: 'SKU12350', product: 'Strawberries', type: 'Type C', type_description: 'Fruit type C', quantity: '40', qbreference: 'QB128', is_active: false },
    { id: 7, date: '2024-08-07', sku: 'SKU12351', product: 'Blueberries', type: 'Type A', type_description: 'Fruit type A', quantity: '45', qbreference: 'QB129', is_active: true },
    { id: 8, date: '2024-08-08', sku: 'SKU12352', product: 'Kiwis', type: 'Type B', type_description: 'Fruit type B', quantity: '50', qbreference: 'QB130', is_active: false },
    { id: 9, date: '2024-08-09', sku: 'SKU12353', product: 'Pears', type: 'Type C', type_description: 'Fruit type C', quantity: '55', qbreference: 'QB131', is_active: true },
    { id: 10, date: '2024-08-10', sku: 'SKU12354', product: 'Peaches', type: 'Type A', type_description: 'Fruit type A', quantity: '60', qbreference: 'QB132', is_active: false },
    { id: 11, date: '2024-08-11', sku: 'SKU12355', product: 'Plums', type: 'Type B', type_description: 'Fruit type B', quantity: '70', qbreference: 'QB133', is_active: true },
    { id: 12, date: '2024-08-12', sku: 'SKU12356', product: 'Cherries', type: 'Type C', type_description: 'Fruit type C', quantity: '45', qbreference: 'QB134', is_active: false },
    { id: 13, date: '2024-08-13', sku: 'SKU12357', product: 'Raspberries', type: 'Type A', type_description: 'Fruit type A', quantity: '50', qbreference: 'QB135', is_active: true },
    { id: 14, date: '2024-08-14', sku: 'SKU12358', product: 'Blackberries', type: 'Type B', type_description: 'Fruit type B', quantity: '40', qbreference: 'QB136', is_active: false },
    { id: 15, date: '2024-08-15', sku: 'SKU12359', product: 'Mangoes', type: 'Type C', type_description: 'Fruit type C', quantity: '60', qbreference: 'QB137', is_active: true },
    { id: 16, date: '2024-08-16', sku: 'SKU12360', product: 'Papayas', type: 'Type A', type_description: 'Fruit type A', quantity: '55', qbreference: 'QB138', is_active: false },
    { id: 17, date: '2024-08-17', sku: 'SKU12361', product: 'Pomegranates', type: 'Type B', type_description: 'Fruit type B', quantity: '65', qbreference: 'QB139', is_active: true },
    { id: 18, date: '2024-08-18', sku: 'SKU12362', product: 'Dates', type: 'Type C', type_description: 'Fruit type C', quantity: '70', qbreference: 'QB140', is_active: false },
    { id: 19, date: '2024-08-19', sku: 'SKU12363', product: 'Figs', type: 'Type A', type_description: 'Fruit type A', quantity: '45', qbreference: 'QB141', is_active: true },
    { id: 20, date: '2024-08-20', sku: 'SKU12364', product: 'Avocados', type: 'Type B', type_description: 'Fruit type B', quantity: '50', qbreference: 'QB142', is_active: false },
]);
const getItems = (rowData) => {
    return [
        {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            command: () => handleMenuAction('Edit', rowData)
        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
            command: () => handleMenuAction('Delete', rowData)
        }
    ];
};
const getBadgeSeverity = (isActive) => {
    return isActive ? 'success' : 'danger';
};
onBeforeMount(() => {
    initFilters();
});

onMounted(() => {

    getProductList();
    // fetchCouponList();
    // getCustomerList();
    // productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const getProductList = async () => {
    try {
        const data = await productService.fetchAllProducts();
        productList.value = data.data;
        productDropdown.value = productList.value.flatMap(product => {
            return product.variations.map(variation => {
                return {
                    id: variation.id,
                    name: `${product.name} (${variation.sku})` //product.name
                };
            });
        });


    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    addFlashSale.value = false;

};
const deleteCouponDiaog = () => {
    deleteCouponDiaog.value = true;
}
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

const openAddNewFlashSale = () => {
    addFlashSale.value = true;
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
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
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
    router.push({ path: '/sales/orders/new-orders' });
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

const deleteCoupon = async () => {
    try {
        if (selectedItemToDelete.value) {
            const data = await couponsService.deleteCoupon(selectedItemToDelete.value.id)
            console.log("data", data)
            if (data) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Coupon deleted successfully!', life: 5000 });
                fetchCouponList();

            }
            deleteProductDialog.value = false;
            editFlashSaleDialog.value = false;
            selectedItemToDelete.value = null;
        }


    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete..!!', life: 5000 });

        console.log("Error ", e)
    }
    deleteProductDialog.value = false;
};

const fetchCouponList = async () => {
    try {
        const data = await couponsService.fetchAllCoupons();
        console.log("Data ", data);
        couponsList.value = data;
        console.log("couponsList ", couponsList.value);
    } catch (e) {

    }
}
function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    // Format the date to 'dd/mm/yyyy'
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function generateCouponCode(length = 10) {
    couponCode.value = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode.value += characters[randomIndex];
    }
    return couponCode.value;
}

const getCustomerList = async () => {
    companyService.fetchAllCompanies()
        .then(companies => {
            customerList.value = companies;
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
}

const saveCoupon = async () => {
    try {
        const payload = {

            "code": couponCode.value,
            "coupon_type": selectedCouponType.value,
            "discount_type": selectedDiscountType.value,
            "start_date": selectedStartDate.value,
            "end_date": selectedEndDate.value,
            "discount_value": couponAmount.value,
            "customer": selectedCustomer.value.id,
            "user_limit": userLimit.value
        }
        const data = await couponsService.saveCoupon(payload)
        if (data) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Coupon added successfully!', life: 3000 });
            // Reset form fields
            resetFormFields();
            addFlashSale.value = false;
        }

    } catch (e) {
        console.log(e)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save coupon.', life: 3000 });

    }
}

const editCoupon = async () => {
    try {
        const payload = {
            ...(couponCode.value && { code: couponCode.value }),
            ...(selectedCouponType.value && { coupon_type: selectedCouponType.value }),
            ...(selectedDiscountType.value && { discount_type: selectedDiscountType.value }),
            ...(selectedStartDate.value && { start_date: formatDateObject(selectedStartDate.value) }),
            ...(selectedEndDate.value && { end_date: formatDateObject(selectedEndDate.value) }),
            ...(couponAmount.value && { discount_value: couponAmount.value }),
            ...(selectedCustomer.value?.id && { customer: selectedCustomer.value.id }),
            ...(userLimit.value && { user_limit: userLimit.value })
        };

        const data = await couponsService.editCoupon(selectedItemToDelete.value.id, payload)
        if (data) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Coupon added successfully!', life: 3000 });
            // Reset form fields
            fetchCouponList();
            resetFormFields();
            editFlashSaleDialog.value = false;
        }

    } catch (e) {
        console.log(e)
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save coupon.', life: 3000 });

    }
}

const resetFormFields = () => {
    couponCode.value = null,
        selectedCouponType.value = null,
        selectedDiscountType.value = null,
        selectedStartDate.value = null,
        selectedEndDate.value = null,
        couponAmount.value = null,
        selectedCustomer.value = null
}

function formatDateObject(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
}

const filteredOrders = computed(() => {
    let filtered = [...couponsList.value];

    // Global search filter
    if (filters.value['global']?.value) {
        filtered = filtered.filter(order =>
            Object.values(order).some(val =>
                val && val.toString().toLowerCase().includes(filters.value['global'].value.toLowerCase())
            )
        );
    }


    // Status filter
    if (status.value) {
        filtered = filtered.filter(order => order.status === status.value);
    }

    // Calendar filter
    if (calenderValue.value && calenderValue.value.length === 2) {
        const [startDate, endDate] = calenderValue.value;

        // Convert startDate and endDate to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Set the end date to the end of the day
        end.setHours(23, 59, 59, 999);

        // Filter orders within the date range
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.order_date);
            return orderDate >= start && orderDate <= end;
        });
    }


    return filtered;
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
                <DataTable ref="dt" :value="deductions" dataKey="id" :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0 text-color-secondary">Deductions</h5>
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
                                    <!-- <label for="state">Status</label> -->
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value"
                                        @change="fetchCouponList()" placeholder="Select Status"></Dropdown>
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
                                <Button type="button" label="Export" icon="pi pi-file-export"
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', color: '#122C20' }"
                                    @click="exportCSV($event)"></Button>
                                <Button type="button" label="Add Deductions" icon="pi pi-plus"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="addDeductionFlag = true"></Button>
                            </div>
                        </div>
                    </template>

                    <Column field="date" header="Date" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Date</span>
                            {{ formatDate(slotProps.data.date) }}
                        </template>
                    </Column>
                    <Column field="sku" header="SKU" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">SKU</span>
                            {{ slotProps.data.sku }}
                        </template>
                    </Column>
                    <Column field="product" header="Product" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Product</span>
                            {{ slotProps.data.product }}
                        </template>
                    </Column>
                    <Column field="type" header="Type" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Type</span>
                            {{ slotProps.data.type }} <br>
                            <span :style="{'color': '#7B6A62'}" class="mt-1 text-xs	">{{ slotProps.data.type_description
                                }} </span>

                        </template>
                    </Column>
                    <Column field="quantity" header="Quantity(KG)" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Quantity(KG)</span>
                            {{ slotProps.data.quantity }}
                        </template>
                    </Column>
                    <Column field="qbRefernce" header="QB Reference" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">QB Reference</span>
                            {{ slotProps.data.qbreference || '-' }}
                        </template>
                    </Column>

                    <Column field="status" header="Status" headerStyle="width:10%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.is_active)">
                                {{ slotProps.data.is_active ? 'Active' : 'Inactive' }}
                            </Tag>
                        </template>
                    </Column>
                    <Column headerStyle="width:10%; min-width:8rem;">
                        <template #body="slotProps">
                            <Button type="button" label="Validate" icon="pi pi-check-square" class="text-base	"
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

                <Dialog v-model:visible="addDeductionFlag" :style="{ width: '450px' }" :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Add
                                Deduction</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>
                    <div class="field mt-3">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Product</label>
                        <Dropdown v-model="selectedProduct" :options="productDropdown" optionLabel="name" class="border-round-lg	"
                            optionValue="id" placeholder="Select Product">
                        </Dropdown>
                    </div>
                    <div class="field">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Deduction
                            Type</label>
                        <Dropdown v-model="selectedDeductionType" :options="deductionTypes" optionLabel="name"
                            placeholder="Select">
                        </Dropdown>
                    </div>
                    <div class="field">
                        <div>
                            <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Reason For
                                loss</label>
                            <Dropdown v-model="selectedReasonForLoss" :options="reasonForLoses" optionLabel="name"
                                optionValue="label" placeholder="Select" class="mt-1">
                            </Dropdown>
                        </div>
                    </div>
                    <div class="field">
                        <div>
                            <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
                                Lead</label>
                            <Dropdown v-model="selectedReasonForLoss" :options="reasonForLoses" optionLabel="name"
                                optionValue="label" placeholder="Select" class="mt-1">
                            </Dropdown>
                        </div>
                    </div>
                    <div class="field">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
                            Charity</label>
                        <Dropdown v-model="selectedReasonForLoss" :options="reasonForLoses" optionLabel="name"
                            optionValue="label" placeholder="Select" class="mt-1">
                        </Dropdown>
                    </div>
           
            <div class="field mt-3">
                <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Quantity(KG)</label>
                <InputNumber v-model="userLimit" inputId="integeronly" fluid />

            </div>
            <template #footer>
                <Button type="button" label="Cancel" icon="pi pi-times"
                    :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF', color: '#122C20' }"
                    @click="hideDialog()"></Button>
                <Button type="button" label="Add Deduction" icon="pi pi-plus"
                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35', color: 'white' }"
                    @click="saveCoupon()"></Button>
            </template>
            </Dialog>

            <Dialog v-model:visible="editDeductions" :style="{ width: '450px' }" :modal="true" class="p-fluid">
              <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Edit
                                Deduction</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>
                    <div class="field mt-3">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Product</label>
                        <Dropdown v-model="selectedProduct" :options="productDropdown" optionLabel="name" class="border-round-md	"
                            optionValue="id" placeholder="Select Product">
                        </Dropdown>
                    </div>
                    <div class="field">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Deduction
                            Type</label>
                        <Dropdown v-model="selectedDeductionType" :options="deductionTypes" optionLabel="name"
                            placeholder="Select">
                        </Dropdown>
                    </div>
                    <div class="field">
                        <div>
                            <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Reason For
                                loss</label>
                            <Dropdown v-model="selectedReasonForLoss" :options="reasonForLoses" optionLabel="name"
                                optionValue="label" placeholder="Select" class="mt-1">
                            </Dropdown>
                        </div>
                    </div>
                    <div class="field">
                        <div>
                            <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
                                Lead</label>
                            <Dropdown v-model="selectedReasonForLoss" :options="reasonForLoses" optionLabel="name"
                                optionValue="label" placeholder="Select" class="mt-1">
                            </Dropdown>
                        </div>
                    </div>
                    <div class="field">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
                            Charity</label>
                        <Dropdown v-model="selectedReasonForLoss" :options="reasonForLoses" optionLabel="name"
                            optionValue="label" placeholder="Select" class="mt-1">
                        </Dropdown>
                    </div>
           
            <div class="field mt-3">
                <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Quantity(KG)</label>
                <InputNumber v-model="userLimit" inputId="integeronly" fluid />

            </div>
            <template #footer>
                <Button type="button" label="Remove" icon="pi pi-trash"
                    :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', color: '#C80000' }"
                    @click="hideDialog()"></Button>
                <Button type="button" label="Add Deduction" icon="pi pi-plus"
                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35', color: 'white' }"
                    @click="saveCoupon()"></Button>
            </template>
            </Dialog>

            <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" :closable="false" :modal="true">
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
                        @click="deleteCouponDiaog()"></Button>
                    <Button type="button" label="Yes, Do it" icon="pi pi-check"
                        :style="{ 'background-color': '#C80000', border: '#C80000', color: '#FFFFFF' }"
                        @click="deleteCoupon()"></Button>
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
</template>
<style lang="scss" scoped>
/* Apply styles using the deep selector */
::v-deep .p-menuitem .p-menuitem-text[data-pc-section='label'] {
    color: red !important;
    /* Example: change text color to red */
    font-weight: bold;
    /* Example: make text bold */
}

.custom-delete-menu-item {
    color: red !important;
}
</style>
