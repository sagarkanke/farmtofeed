<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { CompanyService } from '@/service/CompanyService';
import { useStore } from 'vuex';

const toast = useToast();
let selectedItem = ref(null);
const store = useStore();

const router = useRouter();
const products = ref(null);
const productDialog = ref(false);
const deleteCustomerDialog = ref(false);
const deleteProductsDialog = ref(false);
const filterDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'active', value: 'Active' },
    { label: 'pending', value: 'Pending' },
    { label: 'inactive', value: 'Inactive' },
    { label: 'expired', value: 'Expired' },

]);

const commissionsList = ref([
    {
        id: 1,
        leadOwner: "John Doe",
        january: "5",
        february: "7",
        march: "3",
        april: "8",
        may: "6",
        june: "9",
        july: "4",
        august: "10",
        september: "7",
        october: "5",
        november: "6",
        december: "8",
    },
    {
        id: 2,
        leadOwner: "Jane Smith",
        january: "8",
        february: "6",
        march: "7",
        april: "5",
        may: "9",
        june: "4",
        july: "6",
        august: "7",
        september: "8",
        october: "9",
        november: "4",
        december: "7",
    },
    {
        id: 3,
        leadOwner: "Robert Brown",
        january: "4",
        february: "9",
        march: "6",
        april: "7",
        may: "5",
        june: "8",
        july: "7",
        august: "9",
        september: "6",
        october: "8",
        november: "7",
        december: "5",
    },
    {
        id: 4,
        leadOwner: "Emily Johnson",
        january: "6",
        february: "5",
        march: "8",
        april: "9",
        may: "7",
        june: "6",
        july: "5",
        august: "8",
        september: "9",
        october: "6",
        november: "8",
        december: "9",
    },
    {
        id: 5,
        leadOwner: "Michael Davis",
        january: "7",
        february: "8",
        march: "9",
        april: "4",
        may: "8",
        june: "7",
        july: "9",
        august: "6",
        september: "5",
        october: "7",
        november: "9",
        december: "4",
    },
    {
        id: 6,
        leadOwner: "Laura Wilson",
        january: "9",
        february: "7",
        march: "5",
        april: "8",
        may: "4",
        june: "9",
        july: "8",
        august: "5",
        september: "4",
        october: "9",
        november: "6",
        december: "7",
    },
    {
        id: 7,
        leadOwner: "Chris Taylor",
        january: "6",
        february: "5",
        march: "7",
        april: "8",
        may: "6",
        june: "9",
        july: "4",
        august: "7",
        september: "8",
        october: "9",
        november: "4",
        december: "7",
    },
    {
        id: 8,
        leadOwner: "Olivia Lee",
        january: "8",
        february: "6",
        march: "9",
        april: "7",
        may: "5",
        june: "8",
        july: "6",
        august: "7",
        september: "9",
        october: "5",
        november: "7",
        december: "6",
    },
    {
        id: 9,
        leadOwner: "James Martin",
        january: "5",
        february: "8",
        march: "7",
        april: "6",
        may: "9",
        june: "5",
        july: "8",
        august: "7",
        september: "6",
        october: "9",
        november: "5",
        december: "8",
    },
    {
        id: 10,
        leadOwner: "Sophia Clark",
        january: "9",
        february: "5",
        march: "8",
        april: "7",
        may: "6",
        june: "9",
        july: "5",
        august: "8",
        september: "7",
        october: "6",
        november: "9",
        december: "5",
    },
    {
        id: 11,
        leadOwner: "Liam Harris",
        january: "7",
        february: "9",
        march: "5",
        april: "8",
        may: "7",
        june: "6",
        july: "9",
        august: "4",
        september: "7",
        october: "8",
        november: "9",
        december: "4",
    },
    {
        id: 12,
        leadOwner: "Isabella Rodriguez",
        january: "6",
        february: "7",
        march: "9",
        april: "5",
        may: "8",
        june: "7",
        july: "6",
        august: "9",
        september: "5",
        october: "8",
        november: "6",
        december: "9",
    },
    {
        id: 13,
        leadOwner: "William King",
        january: "5",
        february: "6",
        march: "8",
        april: "9",
        may: "4",
        june: "7",
        july: "5",
        august: "8",
        september: "9",
        october: "4",
        november: "7",
        december: "8",
    },
    {
        id: 14,
        leadOwner: "Emma Turner",
        january: "8",
        february: "7",
        march: "6",
        april: "9",
        may: "5",
        june: "8",
        july: "7",
        august: "6",
        september: "9",
        october: "5",
        november: "8",
        december: "7",
    },
    {
        id: 15,
        leadOwner: "Mason Scott",
        january: "9",
        february: "8",
        march: "5",
        april: "7",
        may: "6",
        june: "9",
        july: "5",
        august: "7",
        september: "8",
        october: "6",
        november: "9",
        december: "5",
    },
    {
        id: 16,
        leadOwner: "Ava Lewis",
        january: "6",
        february: "9",
        march: "7",
        april: "5",
        may: "8",
        june: "7",
        july: "6",
        august: "9",
        september: "5",
        october: "8",
        november: "7",
        december: "6",
    },
    {
        id: 17,
        leadOwner: "Lucas Walker",
        january: "7",
        february: "5",
        march: "8",
        april: "9",
        may: "4",
        june: "7",
        july: "9",
        august: "5",
        september: "8",
        october: "7",
        november: "9",
        december: "4",
    },
    {
        id: 18,
        leadOwner: "Mia Allen",
        january: "9",
        february: "6",
        march: "7",
        april: "8",
        may: "5",
        june: "9",
        july: "6",
        august: "7",
        september: "8",
        october: "9",
        november: "4",
        december: "7",
    },
    {
        id: 19,
        leadOwner: "Benjamin Wright",
        january: "5",
        february: "8",
        march: "9",
        april: "7",
        may: "6",
        june: "5",
        july: "8",
        august: "9",
        september: "7",
        october: "6",
        november: "8",
        december: "5",
    },
    {
        id: 20,
        leadOwner: "Harper Hill",
        january: "8",
        february: "7",
        march: "6",
        april: "9",
        may: "5",
        june: "8",
        july: "7",
        august: "6",
        september: "9",
        october: "5",
        november: "7",
        december: "8",
    },
])
const status = ref(null);
const productService = new ProductService();
const companyService = new CompanyService();
let calenderValue = ref(null);
const customerList = ref([]);
// const items = ref([
// { label: 'View', icon: 'pi pi-fw pi-eye', command: () => handleMenuAction('Edit') },
//     { label: 'Edit', icon: 'pi pi-fw pi-plus', command: () => handleMenuAction('Edit') },
//     { label: 'Delete Coupon', icon: 'pi pi-fw pi-trash', command: () => handleMenuAction('Delete'), style: { color: 'red' } }

// ]);
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
const getBadgeSeverity = (inventoryStatus) => {
    switch (inventoryStatus.toLowerCase()) {
        case 'Active':
            return 'success';
        case 'Inactive':
            return 'warning';
        case 'Expired':
            return 'danger';
        default:
            return 'info';
    }
};

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    fetchCustomersList();
    // productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    deleteCustomerDialog.value = false
};

const openFilter = () => {
    product.value = {};
    submitted.value = false;
    filterDialog.value = true;
};

const clearFilter = () => {
    calenderValue.value = '';
    status.value = '';
    filters['global'].value = '';
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
    router.push({ path: '/sales/new-customers' });
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

const handleMenuAction = (action, item) => {
    if (item) {
        selectedItem.value = item;

    }
    if (action === 'Edit') {

        store.commit('customers/setSelectedItem', selectedItem);

        router.push('/sales/edit-customer');
    } else if (action === 'Delete') {
        deleteCustomerDialog.value = true;
    }
    else if (action === 'View') {
        store.commit('customers/setSelectedItem', selectedItem);
        router.push('/sales/customer-details');
    }
};

const fetchCustomersList = async () => {
    try {
        const data = await companyService.fetchAllCompanies();
        customerList.value = data.data;
    } catch (e) {
        console.log("Exception ", e)
    }
}

const deleteCoupon = async () => {
    try {
        if (selectedItemToDelete.value) {
            const data = await companyService.deleteCompany(selectedItemToDelete.value.id)
            console.log("data", data)
            if (data) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Customer deleted successfully!', life: 5000 });
                fetchCouponList();

            }
            deleteCustomerDialog.value = false;
            selectedItemToDelete.value = null;
        }


    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete..!!', life: 5000 });

        console.log("Error ", e)
    }
    deleteProductDialog.value = false;
};

const showOrderDetails = (orderData) => {

    router.push({
        path: `commissions-admin-details/${orderData.id}/${orderData.leadOwner}`,
    });
}

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
                <DataTable ref="dt" :value="commissionsList" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0">Overview</h5>
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
                            </div>
                        </div>
                    </template>

                    <Column field="leadOwner" header="Lead Owner" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Lead Owner</span>

                            <button @click="showOrderDetails(slotProps.data)"
                                class="p-button p-component p-button-text p-button-plain">
                                {{ slotProps.data.leadOwner || '-' }}
                            </button>

                        </template>
                    </Column>
                    <Column field="january" header="January" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">January</span>
                            {{ slotProps.data.january || '-' }}
                        </template>
                    </Column>
                    <Column field="february" header="February" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">February</span>
                            {{ slotProps.data.february || '-' }}
                        </template>
                    </Column>
                    <Column field="march" header="March" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">March</span>
                            {{ slotProps.data.march || '-' }}
                        </template>
                    </Column>
                    <Column field="april" header="April" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">April</span>
                            {{ slotProps.data.april || '-' }}
                        </template>
                    </Column>
                    <Column field="may" header="May" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">May</span>
                            {{ slotProps.data.may || '-' }}
                        </template>
                    </Column>
                    <Column field="june" header="June" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">June</span>
                            {{ slotProps.data.june || '-' }}
                        </template>
                    </Column>
                    <Column field="july" header="July" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">July</span>
                            {{ slotProps.data.july || '-' }}
                        </template>
                    </Column>
                    <Column field="august" header="August" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">August</span>
                            {{ slotProps.data.august || '-' }}
                        </template>
                    </Column>
                    <Column field="september" header="September" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">September</span>
                            {{ slotProps.data.september || '-' }}
                        </template>
                    </Column>
                    <Column field="october" header="October" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">October</span>
                            {{ slotProps.data.october || '-' }}
                        </template>
                    </Column>
                    <Column field="november" header="November" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">November</span>
                            {{ slotProps.data.november || '-' }}
                        </template>
                    </Column>
                    <Column field="december" header="December" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">December</span>
                            {{ slotProps.data.december || '-' }}
                        </template>
                    </Column>
                </DataTable>


                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details"
                    :modal="true" class="p-fluid">
                    <img :src="'/demo/images/product/' + product.image" :alt="product.image" v-if="product.image"
                        width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus
                            :invalid="submitted && !product.name" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" />
                    </div>

                    <div class="field">
                        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses"
                            optionLabel="value" placeholder="Select a Status">
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
                        <label class="mb-3">Category</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories"
                                    v-model="product.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing"
                                    v-model="product.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category3" name="category" value="Electronics"
                                    v-model="product.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category4" name="category" value="Fitness"
                                    v-model="product.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Price</label>
                            <InputNumber id="price" v-model="product.price" mode="currency" currency="USD"
                                locale="en-US" :invalid="submitted && !product.price" :required="true" />
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

                <Dialog v-model:visible="deleteCustomerDialog" :style="{ width: '450px' }" :closable="false"
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
                            @click="deleteCoupon()"></Button>
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
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
