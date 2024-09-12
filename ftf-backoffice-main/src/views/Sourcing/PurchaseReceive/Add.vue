<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { OrdersService } from '@/service/OrdersService';
import { CompanyService } from '../../../service/CompanyService';
import { CouponsService } from '../../../service/CouponService';
import { useToast } from 'primevue/usetoast';
import {useStore} from 'vuex'
import { useRouter } from 'vue-router';

const ordersService = new OrdersService();
const productService = new ProductService();
const companyService = new CompanyService();
const couponsService = new CouponsService();
const router = useRouter();
const toast = useToast();
const store = useStore();
const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);
const selectedItem = computed(() => store.getters['purchaseReceive/getSelectedItem']);
let customerList = ref([

]);
const units = ref([
    { id: 1, label: 'KG' },
    { id: 2, label: 'Bunch' },
    { id: 3, label: 'Piece' },
    { id: 4, label: 'Punnet' },

]);
const code_of_conduct_file_upload = ref();
const code_of_conduct_file_data = ref(null);
let code_of_conduct_file_name = ref('');
const processing = ref([
    { id: 1, label: 'None' },
    { id: 2, label: 'Whole' },
    { id: 3, label: 'Peeled' },
    { id: 4, label: 'Diced' },
]);
const sizes = ref([
    { id: 1, label: 'Small' },
    { id: 2, label: 'Medium' },
    { id: 3, label: 'Large' },
]);
const ripeness = ref([
    { id: 1, label: 'Ripe' },
    { id: 2, label: 'Unripe' },
])
const paymentTypes = ref([
    { name: 'cash_on_delivery', label: 'Cash on Delivery' },
    { name: 'credit', label: 'Credit' },
]);
const deliveryLocations = ref([
    { name: 1, label: 'Headquarters 1' },
    { name: 2, label: 'Headquarters 2' },
    { name: 3, label: 'Headquarters 3' }
]);
const deliveryMethods = ref([
    { name: 'Pickup', label: 'Pick up from warehouse' },
    { name: 'Delivery', label: 'Regular delivery' }
]);
const deliveryWindows = ref([
    { name: '06:00-09:00', label: '6am - 9am' },
    { name: '09:00-12:00', label: '9am - 12 pm' },
    { name: '1:00-04:00', label: '1pm - 4 pm' }
]);
const gradeFilters = ref([
    { name: '1', label: 'Grade 1' },
    { name: '2', label: 'Grade Rescue' }
]);
const filters = ref({});
const dropdownItem = ref(null);
const selectedCustomer = ref(null);
const today = new Date();
const calenderValue = ref(today);
const selectedPaymentType = ref(null);
const couponCode = ref(null);
const selectedDeliveryLocation = ref(null);
const selectedDeliveryMethod = ref(null);
const selectedDeliveryWindow = ref(null);
const deliveryDate = ref(null);
const productDialog = ref(false);
const products = ref(null);
const skus = ref([]);
const product = ref({});
const submitted = ref(false);
const selectedGradeFilter = ref(null);
const selectedProducts = ref(null);
const addedLineItems = ref([]);
const orderNotes = ref(null);
const selectAddedSKU = ref(null);
let billingDetails = ref([]);
let customerDetails = ref();
const rejectionReasons = ref([
    {key: 'reason1', label: 'Reason 1'},
    {key: 'reason2', label: 'Reason 2'} ,
    {key: 'reason3', label: 'Reason 3'}
])
const selectedItemsArray = ref([]);
let totalSellingPrice = ref(0);
let discountPrice = ref(null);
let deliveryFee = ref(null);
let appliedCoupon = ref('');
let couponDiscount = ref(0);
let total = ref(0);
let isLoading = ref(false);
const tableData = ref([
    { sku: 1, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 2, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 3, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 4, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 5, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 6, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 }
    // Add more static data as needed
]);


//Functions
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const getDropdownValue = () => {
    console.log('Printing selected customer ', selectedCustomer.value.name);
   
    getBillingDetails();
    getCustomerDetails();

};

const formattedDate = computed(() => {
    if (!calenderValue.value) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return calenderValue.value.toLocaleDateString(undefined, options);
});

const addNewLineItem = () => {
    product.value = [];
    submitted.value = false;
    productDialog.value = true;
};

const addLineItem = () => {
    console.log("Select products ", addedLineItems);
    totalSellingPrice.value = addedLineItems.value.reduce((accumulator, item) => {
  return accumulator + item.selling_price;
}, 0);
    productDialog.value = false;
};

const createNewOrder = async () => {
router.push('/sourcing/purchase-receive')
};

const fetchProducts = async () => {
    const data = await productService.fetchAllProducts();
  
    const variationsWithName = data.data.map(sku =>
        sku.variations.map(variation => ({
            ...variation,
            name: sku.name
        }))
    ).flat(); // Flatten the array of arrays into a single array

    skus.value = variationsWithName;
}

const getCustomerList = async () => {
    companyService.fetchAllCompanies()
        .then(companies => {
             customerList.value = companies.data;
             console.log("Customers ", customerList.value);
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
}

function formatDate(date) {
  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();

  // Return formatted date
  return `${year}/${month}/${day}`;
}


const resetFormFields = () => {
  addedLineItems.value = []; 
  selectedCustomer.value = null; 
  selectedDeliveryMethod.value = {}; 
  selectedPaymentType.value = {};
  deliveryDate.value = null; 
  selectedDeliveryLocation.value = {};
  selectedDeliveryWindow.value = {};
  couponCode.value = '';
};

const getBillingDetails = async () => {
    companyService.fetchBillingDetails(selectedCustomer.value.id)
        .then(companies => {
            billingDetails.value = companies[0];
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
};



const getCustomerDetails = async () => {
    companyService.fetchCustomerDetails(selectedCustomer.value.id)
        .then(companies => {
            customerDetails.value = companies[0];
             console.log("Printing Company Address Details ", customerDetails)
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
        });
}

const applyCoupon = async () => {
    appliedCoupon.value = couponCode.value;
    const data = {
        company_id: selectedCustomer.value.id,
        code: couponCode.value
    };

    try {
        const coupons = await ordersService.checkCouponValidity(data);
        const discountValue = coupons.coupon.discount_value;
        const discountType = coupons.coupon.discount_type;
        couponDiscount.value = totalSellingPrice.value - calculateDiscount(totalSellingPrice.value, discountValue, discountType);

        total.value = Math.floor(totalSellingPrice.value - couponDiscount.value);
        console.log("Total ", total);
         toast.add({ severity: 'success', summary: 'Success', detail: 'Coupon applied successfully.', life: 5000 });

       
    } catch (error) {
        console.log("error ", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid Coupon.', life: 5000 });
    } finally {
       
        isLoading.value = false;
    }
};


const deleteCoupon =() => {
    couponDiscount.value = 0.00;
    total.value = totalSellingPrice.value;
    appliedCoupon.value = '';
}

function formatDateInMonthFormat(date) {
      if (!date) return '-';
      
      const options = { year: '2-digit', month: 'short', day: '2-digit' };
      const formattedDate = new Date(date).toLocaleDateString('en-US', options);
      
      const [month, day, year] = formattedDate.split(' ');
      const formattedMonth = month.slice(0, 3);
      const formattedDay = day.replace(',', '');
      const formattedYear = year;
      
      return `${formattedMonth} ${formattedDay} ${formattedYear}`;
    }

    function calculateDiscount(originalPrice, discountValue, discountType) {
    let discountedPrice = originalPrice;
    console.log(originalPrice,discountValue,discountType);
    if (discountType === 'percentage') {
        // Calculate percentage discount
        if (discountValue > 100 || discountValue < 0) {
            throw new Error('Invalid discount percentage value.');
        }
        discountedPrice = originalPrice - (originalPrice * (discountValue / 100));
    } else if (discountType === 'flat') {
        // Calculate flat amount discount
        if (discountValue < 0) {
            throw new Error('Invalid discount flat value.');
        }
        discountedPrice = originalPrice - discountValue;
    } else {
        throw new Error('Invalid discount type. Use "percentage" or "flat".');
    }

    // Ensure discounted price is not less than zero
    if (discountedPrice < 0) {
        discountedPrice = 0;
    }

    return discountedPrice;
}

const removeSKU =()=>{

    addedLineItems.value = addedLineItems.value.filter(sku=> !selectAddedSKU.value.some(selectedSku =>sku.id === selectedSku.id))

}

function handleFileChangeCodeOfConduct(event) {
    if (event && event.files && event.files.length > 0) {
        const file = event.files[0];
        console.log('Selected File:', file);

        code_of_conduct_file_data.value = file;
        code_of_conduct_file_name.value = file.name;
    } else {
        code_of_conduct_file_data.value = null;
        code_of_conduct_file_name.value = '';
    }
}
// Lifecycle hooks
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    //  productService.getProducts().then((data) => (products.value = data));
    fetchProducts();
    getCustomerList();
});


</script>

<template>
    <div class="flex justify-content-between">
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem' }">Receive Order: {{selectedItem?.orderNo}}</h5>
        <div :style="{ 'margin-left': '30px' }"><Button type="button" label="Save Received Order" icon="pi pi-save"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }" @click="createNewOrder()"></Button></div>

    </div>

    <div class="grid" :style="{ 'margin-left': '-3rem' }">
        <div class="col-12 md:col-8">
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Receive Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-grow-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Receive Date
                                </label>
                            <Calendar id="customer" :style="{ borderRadius: '8px' }" v-model="selectedItem.receivedDate" showIcon
                               placeholder="Select"
                                 />
                        </div>
                        <div class="field field flex-1 flex flex-column justify-content-end w-6">
                            <FileUpload name="code_of_conduct" ref="code_of_conduct_file_upload" mode="basic"
                                class="w-12" @select="handleFileChangeCodeOfConduct" :multiple="true"
                                accept="image/*,application/pdf" :style="{ 'background-color': '#333333','border':'#333333' }"
                                :maxFileSize="1000000" @upload="onUpload" chooseLabel="Upload KRA Certificate">
                            </FileUpload>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <DataTable ref="dt" :value="addedLineItems" v-model:selection="selectAddedSKU" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '5px' }">
                            <h5 style="color: #808080">Line Items</h5>
                        </div>
                        <div class="flex justify-content-between gap-6 mt-2">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <Button type="button" label="Remove" icon="pi pi-trash"
                                    :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF' ,'color': '#122C20'}"
                                    @click="removeSKU()"></Button>
                                <Button type="button" label="Add" icon="pi pi-plus"
                                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"
                                    @click="addNewLineItem()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    
                    <Column field="productGrade" header="Product Grade" 
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Product Id</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="unit" header="Unit" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Unit</span>
                            <Dropdown class="w-8" id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="slotProps.data.selectedUnit" :options="units" optionLabel="label"
                                optionValue="id" />
                        </template>
                    </Column>
                    <Column field="ordered" header="Ordered" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                           {{ slotProps.data?.ordered || 0 }}
                        </template>
                    </Column>
                    <Column field="dispatched" header="Dispatched" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                           {{ slotProps.data?.dispatched || 0 }}
                        </template>
                    </Column>
                    <Column field="receiveQty" header="Receive Qty" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <InputNumber class="w-6" v-model="slotProps.data.quantity" />
                        </template>
                    </Column>
                    <Column field="inventoryEq" header="Inventory EQ" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                           {{ slotProps.data?.inventoryEq || 0 }}
                        </template>
                    </Column>
            
                    <Column field="grade" header="Grade Received" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Grade</span>
                            <Dropdown class="w-8" id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="slotProps.data.selectedGrade" :options="gradeFilters" optionLabel="label"
                                 />
                        </template>
                    </Column>
                    <Column field="grade" header="Rejected Reasons" headerStyle="width:14%; min-width:14rem;">
                        <template #body="slotProps">
                            <Dropdown class="w-8" id="deliveryWindow" :style="{ borderRadius: '8px' }"
                            v-model="slotProps.data.selectedGrade" :options="rejectionReasons" optionLabel="label"
                             />
                        </template>
                    </Column>
                    <Column  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-text p-button-plain flex-end"
                                    @click="handleDelete(index, 'images')"
                                    :style="{ 'color': 'red', 'margin-left': 'auto' }" />
                        </template>
                    </Column>

                    <!-- <Column headerStyle="min-width:10rem;">
                        <template #body>
                            <Button icon="pi pi-ellipsis-v" type="button" class="p-button-text"></Button>
                        </template>
                    </Column> -->
                </DataTable>
    
                <Dialog v-model:visible="productDialog" :style="{ width: '650px', height: '430px' }" :modal="true"
                    class="p-fluid">
                    <template #header>
                        <div class="dialog-header">
                            <i class="pi pi-plus" :style="{ 'margin-right': '8px', color: '#122C20' }"></i>
                            <span :style="{ color: '#122C20', 'font-size': '18px', 'font-weight': '700' }">Add Line
                                Item</span>
                        </div>
                    </template>
                    <div class="card">
                        <DataTable ref="dt" :value="skus"   :filters="filters" v-model:selection="addedLineItems" dataKey="sku"
                            :scrollable="true" scrollHeight="200px" :style="{ 'margin-left': '-20px' }">
                            <template #header>
                                <div class="flex justify-content-between"
                                    :style="{ 'margin-top': '-30px', 'margin-left': '-14px' }">
                                    <div>
                                        <IconField iconPosition="left" class="block mt-1 md:mt-0">
                                            <InputIcon class="pi pi-search" />
                                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                                placeholder="Search..." />
                                        </IconField>
                                    </div>
                                    <div :style="{ 'margin-right': '-17px' }">
                                        <Dropdown id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                            v-model="selectedGradeFilter" :options="gradeFilters" optionLabel="label" 
                                            placeholder="Filter By Grade" />
                                    </div>
                                </div>
                            </template>
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    
                            <Column field="sku" header="SKU" :sortable="true" headerStyle="width:14%; min-width:10rem;">
    
                                <template #body="slotProps">
                                    <span class="p-column-title">SKU</span>
                                    {{ slotProps.data.sku }}
                                </template>
                            </Column>
                            <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Name</span>
                                    {{ slotProps.data.name }}
                                </template>
                            </Column>
                            <Column field="grade" header="Grade" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Grade</span>
                                    {{ slotProps.data.grade.name }}
                                </template>
                            </Column>
                            <Column field="available" header="Available" :sortable="true"
                                headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Available</span>
                                    {{ slotProps.data.available }}
                                </template>
                            </Column>
                            <Column field="committed" header="Committed" :sortable="true"
                                headerStyle="width:14%; min-width:8rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Committed</span>
                                    {{ slotProps.data.committed }}
                                </template>
                            </Column>
                            <Column field="incoming" header="Incoming" :sortable="true"
                                headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Incoming</span>
                                    {{ slotProps.data.committed }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    <div class="flex justify-content-end gap-2 ml-5">
                        <Button type="button" label="Remove" icon="pi pi-trash"
                            :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF', width: '100px','color':'#122C20' }"
                            @click="exportCSV($event)"></Button>
                        <Button type="button" label="Add" icon="pi pi-plus"
                            :style="{ 'background-color': '#1E4A35', border: '#1E4A35', width: '100px' }"
                            @click="addLineItem()"></Button>
                    </div>
                </Dialog>
            </div>

        </div>    
    
    </div>
</template>
<style scoped>
/* Scoped styles to target the placeholder text in the dropdown */
.custom-dropdown .p-dropdown-label.p-placeholder {
    font-size: 12px !important;
    /* Adjust the font size as needed */
    color: #e21818 !important;
    /* Adjust the color if needed */
}

:deep(.rounded-dropdown .p-dropdown) {
    border-radius: 8px !important;
}

.spinner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8); /* Optional: background to make spinner more visible */
    z-index: 10; /* Ensure spinner is above table content */
    pointer-events: none; /* Allow clicks to pass through spinner */
  }
</style>
