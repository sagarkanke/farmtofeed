<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import {LeadService} from '@/service/LeadService';
import { useStore } from 'vuex';
const toast = useToast();
const store = useStore();

const showLeadDetails = ref(false);
const deleteLeadDialog = ref(false);
let selectedItem = ref(null);
const router = useRouter();
const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const leadService = new LeadService();
const deleteProductsDialog = ref(false);
const filterDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const leadList = ref([
    {
          id: 1,
          customer: 'Acme Corp',
          category: 'Technology',
          contactPerson: 'John Doe',
          phoneNumber: '123-456-7890',
          email: 'john.doe@acme.com',
          contactDate: '2024-08-15',
          lastContact: '2024-08-20',
          inventoryStatus: 'New',
          source: 'Web',
          dealOpp: 'High',
          owner: 'Alice Smith'
        },
        {
          id: 2,
          customer: 'Beta Industries',
          category: 'Finance',
          contactPerson: 'Jane Smith',
          phoneNumber: '234-567-8901',
          email: 'jane.smith@beta.com',
          contactDate: '2024-08-12',
          lastContact: '2024-08-18',
          inventoryStatus: 'Follow-up',
          source: 'Referral',
          dealOpp: 'Medium',
          owner: 'Bob Johnson'
        },
        {
          id: 3,
          customer: 'Gamma LLC',
          category: 'Healthcare',
          contactPerson: 'Emily Davis',
          phoneNumber: '345-678-9012',
          email: 'emily.davis@gamma.com',
          contactDate: '2024-08-10',
          lastContact: '2024-08-16',
          inventoryStatus: 'Pending',
          source: 'Event',
          dealOpp: 'Low',
          owner: 'Charlie Brown'
        },
        {
          id: 4,
          customer: 'Delta Ltd',
          category: 'Education',
          contactPerson: 'Michael Brown',
          phoneNumber: '456-789-0123',
          email: 'michael.brown@delta.com',
          contactDate: '2024-08-08',
          lastContact: '2024-08-14',
          inventoryStatus: 'Closed',
          source: 'Email',
          dealOpp: 'High',
          owner: 'David Wilson'
        },
        {
          id: 5,
          customer: 'Epsilon Inc',
          category: 'Retail',
          contactPerson: 'Sarah Johnson',
          phoneNumber: '567-890-1234',
          email: 'sarah.johnson@epsilon.com',
          contactDate: '2024-08-07',
          lastContact: '2024-08-13',
          inventoryStatus: 'New',
          source: 'Social Media',
          dealOpp: 'Medium',
          owner: 'Eve Davis'
        },
        {
          id: 6,
          customer: 'Zeta Co',
          category: 'Manufacturing',
          contactPerson: 'Chris Evans',
          phoneNumber: '678-901-2345',
          email: 'chris.evans@zeta.com',
          contactDate: '2024-08-06',
          lastContact: '2024-08-12',
          inventoryStatus: 'Follow-up',
          source: 'Web',
          dealOpp: 'High',
          owner: 'Frank Turner'
        },
        {
          id: 7,
          customer: 'Eta Solutions',
          category: 'Telecommunications',
          contactPerson: 'Olivia Martinez',
          phoneNumber: '789-012-3456',
          email: 'olivia.martinez@eta.com',
          contactDate: '2024-08-05',
          lastContact: '2024-08-11',
          inventoryStatus: 'Pending',
          source: 'Referral',
          dealOpp: 'Low',
          owner: 'Grace Lee'
        },
        {
          id: 8,
          customer: 'Theta Partners',
          category: 'Automotive',
          contactPerson: 'Liam Wilson',
          phoneNumber: '890-123-4567',
          email: 'liam.wilson@theta.com',
          contactDate: '2024-08-04',
          lastContact: '2024-08-10',
          inventoryStatus: 'Closed',
          source: 'Event',
          dealOpp: 'Medium',
          owner: 'Hannah Clark'
        },
        {
          id: 9,
          customer: 'Iota Enterprises',
          category: 'Travel',
          contactPerson: 'Emma White',
          phoneNumber: '901-234-5678',
          email: 'emma.white@iota.com',
          contactDate: '2024-08-03',
          lastContact: '2024-08-09',
          inventoryStatus: 'New',
          source: 'Email',
          dealOpp: 'High',
          owner: 'Jack Scott'
        },
        {
          id: 10,
          customer: 'Kappa Group',
          category: 'Legal',
          contactPerson: 'James Taylor',
          phoneNumber: '012-345-6789',
          email: 'james.taylor@kappa.com',
          contactDate: '2024-08-02',
          lastContact: '2024-08-08',
          inventoryStatus: 'Follow-up',
          source: 'Social Media',
          dealOpp: 'Medium',
          owner: 'Jasmine Brown'
        },
        {
          id: 11,
          customer: 'Lambda Corporation',
          category: 'Real Estate',
          contactPerson: 'Lucas Harris',
          phoneNumber: '123-456-7891',
          email: 'lucas.harris@lambda.com',
          contactDate: '2024-08-01',
          lastContact: '2024-08-07',
          inventoryStatus: 'Pending',
          source: 'Web',
          dealOpp: 'Low',
          owner: 'Katherine Moore'
        },
        {
          id: 12,
          customer: 'Mu Industries',
          category: 'Insurance',
          contactPerson: 'Sophia Lee',
          phoneNumber: '234-567-8902',
          email: 'sophia.lee@mu.com',
          contactDate: '2024-07-31',
          lastContact: '2024-08-06',
          inventoryStatus: 'Closed',
          source: 'Referral',
          dealOpp: 'High',
          owner: 'Liam Johnson'
        },
        {
          id: 13,
          customer: 'Nu Technologies',
          category: 'Consulting',
          contactPerson: 'William Lewis',
          phoneNumber: '345-678-9013',
          email: 'william.lewis@nu.com',
          contactDate: '2024-07-30',
          lastContact: '2024-08-05',
          inventoryStatus: 'New',
          source: 'Event',
          dealOpp: 'Medium',
          owner: 'Mia Wilson'
        },
        {
          id: 14,
          customer: 'Xi Solutions',
          category: 'Pharmaceuticals',
          contactPerson: 'Isabella Robinson',
          phoneNumber: '456-789-0124',
          email: 'isabella.robinson@xi.com',
          contactDate: '2024-07-29',
          lastContact: '2024-08-04',
          inventoryStatus: 'Follow-up',
          source: 'Email',
          dealOpp: 'Low',
          owner: 'Noah Davis'
        },
        {
          id: 15,
          customer: 'Omicron Inc',
          category: 'Energy',
          contactPerson: 'Daniel Martinez',
          phoneNumber: '567-890-1235',
          email: 'daniel.martinez@omicron.com',
          contactDate: '2024-07-28',
          lastContact: '2024-08-03',
          inventoryStatus: 'Pending',
          source: 'Social Media',
          dealOpp: 'High',
          owner: 'Olivia Harris'
        },
        {
          id: 16,
          customer: 'Pi Technologies',
          category: 'Transportation',
          contactPerson: 'Ava Lewis',
          phoneNumber: '678-901-2346',
          email: 'ava.lewis@pi.com',
          contactDate: '2024-07-27',
          lastContact: '2024-08-02',
          inventoryStatus: 'Closed',
          source: 'Web',
          dealOpp: 'Medium',
          owner: 'Ethan Clark'
        },
        {
          id: 17,
          customer: 'Rho Enterprises',
          category: 'Retail',
          contactPerson: 'Mason Clark',
          phoneNumber: '789-012-3457',
          email: 'mason.clark@rho.com',
          contactDate: '2024-07-26',
          lastContact: '2024-08-01',
          inventoryStatus: 'New',
          source: 'Referral',
          dealOpp: 'Low',
          owner: 'Charlotte Moore'
        },
        {
          id: 18,
          customer: 'Sigma Corp',
          category: 'Real Estate',
          contactPerson: 'Lily Adams',
          phoneNumber: '890-123-4568',
          email: 'lily.adams@sigma.com',
          contactDate: '2024-07-25',
          lastContact: '2024-07-31',
          inventoryStatus: 'Follow-up',
          source: 'Event',
          dealOpp: 'High',
          owner: 'James Lewis'
        },
]);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'lead_generation', value: 'Lead generation' },
    { label: 'introduction', value: 'Introduction' },
    { label: 'proposal_and_negotiation', value: 'Proposal & Negotiation' },
    { label: 'vetting', value: 'Vetting' },
    { label: 'closed_won', value: 'Closed - Won' },
    { label: 'closed_lost', value: 'Closed - Lost' },
    { label: 'abandoned', value: 'Abandoned' },
    { label: 'on_hold', value: 'On Hold' },


]);
const categories = ref([
    { name: 'school', label: 'School/Feeding Program' },
    { name: 'hotel', label: 'Hotel/Restautant' },
    { name: 'caterer', label: 'Caterer' },
    { name: 'foodProcessor', label: 'Food Processor' },
    { name: 'retail', label: 'Retail' },
    { name: 'ftff', label: 'FTFF' },
    { name: 'ftf', label: 'Farm To Feed' },
    { name: 'other', label: 'Other' }
])
const status = ref(null);
const productService = new ProductService();
let calenderValue = ref(null);
const visibleRight = ref(false);
const items = ref([
{ label: 'View', icon: 'pi pi-fw pi-eye', command: () => handleMenuAction('Edit') },
    { label: 'Edit', icon: 'pi pi-fw pi-plus', command: () => handleMenuAction('Edit') },
    { label: 'Delete Coupon', icon: 'pi pi-fw pi-trash', command: () => handleMenuAction('Delete'), style: { color: 'red' } }
    
]);
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

onBeforeMount(() => {
    initFilters();
});

onMounted(() => {
    // fetchLeadList();
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
    
    deleteLeadDialog.value = false
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
    router.push({ path: '/sales/new-lead' });
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
    if(item){
        selectedItem.value = item;

    }
    if (action === 'Edit') {
       
        store.commit('leads/setSelectedItem', selectedItem);

    router.push('/sales/edit-lead');
    } else if (action === 'Delete') {
        deleteLeadDialog.value = true;
    }
    else if (action === 'View') {
        showLeadDetails.value = true;
    }
};

const fetchLeadList = async()=>{
    try{
        const data = await leadService.fetchLeadList();
        if(data){
            leadList.value=data.data;

        }

    }catch(e){
        console.log("Error fetching list", e)
    }
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
                <Badge severity="danger" class="ml-2 mt--2"> <i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89%</Badge>
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
                <Badge severity="success" class="ml-2 mt--2"> <i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
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
                <Badge severity="info" class="ml-2 mt--2"><i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
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
                <Badge severity="warning" class="ml-2 mt--2"><i class="pi pi-arrow-down" :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>

        <div class="col-12">
            <div class="card">
                <DataTable
                    ref="dt"
                    :value="leadList"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center" :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0">Leads</h5>
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
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value" placeholder="Select Status"></Dropdown>
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-fill" label="Filter" :style="{'background-color': '#DFEDDF','border': '#DFEDDF','border-radius': '8px'}" outlined @click="openFilter()" />
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-slash" :style="{'background-color': '#DFEDDF','border': '#DFEDDF','border-radius': '8px'}" outlined @click="clearFilter()" />
                                </div>
                            </div>

                            <div class="flex gap-2" :style="{ 'margin-right': '-22px' }">
                                <Button type="button" label="Export" icon="pi pi-file-export" :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }" @click="exportCSV($event)"></Button>
                                <Button type="button" label="New Lead" icon="pi pi-plus" :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="newOrder()"></Button>
                            </div>
                        </div>
                    </template>

                    <Column field="customer" header="Customer" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Customer</span>
                            <button @click="visibleRight = true" class="p-button p-component p-button-text p-button-plain">
                                {{ slotProps.data.customer }}
                              </button>
                        </template>
                    </Column>
                    <Column field="category" header="Category"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Category</span>
                            {{ slotProps.data.category }}
                        </template>
                    </Column>
                    <Column field="contactPerson" header="Contact Person" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">contactPerson</span>
                           <span :style="{'color': '#9BA56B'}">{{ slotProps.data.contactPerson }} </span>                        </template>
                    </Column>
                    <Column field="phoneNumber" header="Phone Number" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Phone Number</span>
                            {{ slotProps.data.phoneNumber }}                        </template>
                    </Column>
                    <Column field="email" header="Email" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Email</span>
                            {{ slotProps.data.email }}                        </template>
                    </Column>
                    
                    <Column field="contactDate" header="Contact Date" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Contact Date</span>
                            {{ slotProps.data.contactDate }}                          </template>
                    </Column>
                    <Column field="lastContact" header="Last Contact" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Last Contact</span>
                            {{ slotProps.data.lastContact }}                        </template>
                    </Column>
                    <Column field="status" header="Status" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column>
                    <Column field="source" header="Source" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Source</span>
                            {{ slotProps.data.source }}                        </template>
                    </Column>
                    <Column field="dealOpp" header="Deal Oppurtunity" headerStyle="width:14%; min-width:14rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Deal Oppurtunity</span>
                            {{ slotProps.data.dealOpp }}                        </template>
                    </Column>
                    <Column field="owner" header="Owner" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Owner</span>
                            {{ slotProps.data.owner }}                        </template>
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

                <Dialog v-model:visible="deleteLeadDialog" :style="{ width: '450px' }" :closable="false"
                :modal="true">
                <template #header>
                    <div>
                        <h5 :style="{ 'font-weight': '700' }">Delete Lead?</h5>
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
                        <Dropdown id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="value" placeholder="Select Lead Owner">
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
                        <Dropdown id="inventoryStatus" v-model="selectedCategory" :options="categories" optionLabel="label" placeholder="Select Category">
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
                        <Button type="button" label="Cancel" icon="pi pi-times" :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9','color':'#122C20' }" @click="hideDialog" />
                        <Button type="button" label="Apply" icon="pi pi-check" :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="saveProduct" />
                    </template>
                </Dialog>
            </div>
        </div>
      
        <Sidebar v-model:visible="showLeadDetails" :baseZIndex="1000" position="right" :style="{ width: '400px' }">
            <template #header>
                <h5 class="flex" style="font-weight: 700;color:#122C20">{{selectedItem.customer}}</h5>
                <h6 class="flex" style="margin-left:-27rem;margin-top:3rem; color:#808080">{{selectedItem.contactPerson}}</h6>
            </template>
            <div :style="{ 'margin-top': '-5px' }">
                <h5 style="font-weight: 700;color:#122C20">Business Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Business Name</div>
                        <div>{{selectedItem.customer}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Category</div>
                        <div>{{selectedItem.category}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Email </div>
                        <div>{{selectedItem.email}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Phone </div>
                        <div>{{selectedItem.phone}}</div>
                    </div>
                   
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>

                <h5 style="font-weight: 700;color:#122C20">Contact Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Contact Person</div>
                        <div>{{selectedItem.contactPerson}}</div>
                    </div>

                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Email </div>
                        <div>{{selectedItem.email}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Phone </div>
                        <div>{{selectedItem.phone}}</div>
                    </div>
                   
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>

                <h5 style="font-weight: 700;color:#122C20">Status</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Contact Date</div>
                        <div>{{selectedItem.contactDate}}</div>
                    </div>

                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Last Contact </div>
                        <div>{{selectedItem.lastContact}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Stage </div>
                        <div>{{selectedItem.stage}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Source </div>
                        <div>{{selectedItem.source}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Deal Oppurtunity </div>
                        <div>{{selectedItem.dealOpp}}</div>
                    </div>
                </div>

            </div>
        </Sidebar>
    </div>
</template>
