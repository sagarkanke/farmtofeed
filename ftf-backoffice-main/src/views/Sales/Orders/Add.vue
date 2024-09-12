<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { OrdersService } from '@/service/OrdersService';
import { CompanyService } from '../../../service/CompanyService';
import { CouponsService } from '../../../service/CouponService';
import { useToast } from 'primevue/usetoast';
const ordersService = new OrdersService();
const productService = new ProductService();
const companyService = new CompanyService();
const couponsService = new CouponsService();
const toast = useToast();
const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);

let customerList = ref([

]);
const units = ref([
    { id: 1, label: 'KG' },
    { id: 2, label: 'Bunch' },
    { id: 3, label: 'Piece' },
    { id: 4, label: 'Punnet' },

]);

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
  // Prepare products array
  
  const products = addedLineItems.value.map(item => {
  // Log the item
  

  // Return the new object with the additional fields
  return {
    product_unit_variant_id: item.id,
    order_quantity: item.quantity,
    processing_type_id: item.selectedProcessing,
    // ripeness: item.selectedRipeness,
    size: item.selectedSize,
    specifications: item.selectedRipeness.label
  };
});

  // Prepare payload object
  const payload = {
    company_id: selectedCustomer.value.id,
    delivery_type: selectedDeliveryMethod.value.name,
    payment_type: selectedPaymentType.value.name,
    delivery_date: formatDate(deliveryDate.value),
    delivery_address_id: selectedDeliveryLocation.value.name || 1,
    delivery_slot: selectedDeliveryWindow.value.name,
    is_recurring: false,
//   recurring_dates: [],
    coupon_id: couponCode.value || '',
    delivery_notes: JSON.parse(JSON.stringify(orderNotes.value)) || '',
    products
  };

  try {
    // Create new order
    const data = await ordersService.createNewOrder(payload);
    if(data){
        toast.add({ severity: 'success', summary: 'Success', detail: 'Order created successfully!',life:3000 });
// Reset form fields
resetFormFields();
    }

    
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save the order.',life:3000 });

    console.error("Error creating order:", error);
  }
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
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem' }">New Order</h5>
        <div :style="{ 'margin-left': '30px' }"><Button type="button" label="Save Order" icon="pi pi-save"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }" @click="createNewOrder()"></Button></div>

    </div>

    <div class="grid" :style="{ 'margin-left': '-2rem' }">
        <div class="col-12 md:col-8">
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Order Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Select
                                Customer</label>
                            <Dropdown id="customer" :style="{ borderRadius: '8px' }" v-model="selectedCustomer"
                                :options="customerList" optionLabel="name" placeholder="Select"
                                @change="getDropdownValue()" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="orderDate" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Order
                                Date</label>
                            <Calendar v-model="calenderValue" :style="{ borderRadius: '8px' }" :manualInput="false" showIcon
                                placeholder="Select" icon="pi pi-calendar
                                "></Calendar>
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Payment
                                Type</label>
                            <Dropdown id="paymentType" :style="{ borderRadius: '8px' }" v-model="selectedPaymentType"
                                :options="paymentTypes" optionLabel="label" placeholder="Select" />
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3 mt-4">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Delivery Location</label>
                            <Dropdown id="deliveryMethod" :style="{ borderRadius: '8px' }"
                                v-model="selectedDeliveryLocation" :options="deliveryLocations" optionLabel="label"
                                class="custom-dropdown" placeholder="Select" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Delivery Method</label>
                            <Dropdown id="deliveryMethod" :style="{ borderRadius: '8px' }"
                                v-model="selectedDeliveryMethod" :options="deliveryMethods" optionLabel="label"
                                placeholder="Select" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryWindow"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Delivery Window</label>
                            <Dropdown id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="selectedDeliveryWindow" :options="deliveryWindows" optionLabel="label"
                                placeholder="Select" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryDate" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Delivery
                                Date</label>
                            <Calendar id="deliveryDate" :style="{ borderRadius: '8px' }" v-model="deliveryDate" showIcon
                                placeholder="Select" />
                        </div>
                    </div>

                    <!-- Third Row -->
                    <div>
                        <div class="field col-12">
                            <label for="orderNotes" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Order
                                Notes(Optional)</label>
                        </div>
                        <div :style="{ 'margin-top': '-30px', 'margin-left': '15px' }">
                            <Textarea id="orderNotes" v-model="orderNotes" rows="4" placeholder="Type your note here..."
                                :style="{ width: '100%' }"></Textarea>
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
    
                    <Column field="productId" header="Product ID" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Product Id</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="item" header="Item" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Customer</span>
                            {{ slotProps.data.sku }}
                        </template>
                    </Column>
                    <Column field="grade" header="Grade" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Grade</span>
                            {{ slotProps.data.grade.name || '-' }}
                        </template>
                    </Column>
                    <Column field="quantity" header="Quantity" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Quantity</span>
                            <InputText class="w-6" v-model="slotProps.data.quantity" />
                        </template>
                    </Column>
                    <Column field="unit" header="Unit" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Unit</span>
                            <Dropdown class="w-8" id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="slotProps.data.selectedUnit" :options="units" optionLabel="label"
                                optionValue="id" />
                        </template>
                    </Column>
                    <Column field="stdWgt" header="Std Wgt(G)" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Std Wgt(G)</span>
                            {{ slotProps.data.weight_per_unit }}
                        </template>
                    </Column>
                    <Column field="invEq" header="INV eq(KG)" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">INV eq(KG)</span>
                            {{ slotProps.data.inv_eq || '-' }}
                        </template>
                    </Column>
                    <Column field="processing" header="Processing" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">processing</span>
                            <Dropdown class="w-8" id="processing" :style="{ borderRadius: '8px' }"
                                v-model="slotProps.data.selectedProcessing" :options="processing" optionLabel="label"
                                optionValue="id" />
                        </template>
                    </Column>
                    <Column field="size" header="Size" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Specifications</span>
                            <Dropdown class="w-8" id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="slotProps.data.selectedSize" :options="sizes" optionLabel="label"
                                optionValue="id" />
                        </template>
                    </Column>
                    <Column field="ripeness" header="Ripeness" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Ripeness</span>
                            <Dropdown class="w-8" id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="slotProps.data.selectedRipeness" :options="ripeness" optionLabel="label"
                                />
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

        <div class="col-12 md:col-4">
            <div class="card p-fluid" :style="{}">
                <h5>Payment</h5>
                <template v-if="isLoading">
                    <div class="spinner-overlay">
                      <label class="font-bold text-lg">Loading...</label>
                      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                    </div>
                  </template>
                  <template v-else>
                    <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Subtotal</div>
                            <div>KSH {{totalSellingPrice || 0}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Delivery Fee</div>
                            <div>KSH00.00</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Coupon: {{appliedCoupon}}</div>
                            <div>(KSH {{couponDiscount}})<i class="pi pi-trash" :style="{ color: 'red', 'margin-left': '4px' }" @click="deleteCoupon()"></i>
                            </div>
                        </div>
                        <div class="flex justify-content-between" :style="{ 'font-weight': 'bold' }">
                            <div>Total</div>
                            <div>KSH {{total}}</div>
                        </div>
                    </div>
                  </template>
                
                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <div class="flex" :style="{ width: '100%', gap: '14px', 'margin-top': '20px' }">
                    <InputText :style="{ width: '70%', 'border-radius': '14px' }" id="firstname1" type="text"
                        placeholder="Coupon Code" v-model="couponCode" />
                    <button label="Apply coupon"  :disabled="!selectedCustomer && !addedLineItems.length == 0"
                        :style="{ width: '30%', 'background-color': '#DFEDDF', border: '0', 'border-radius': '10px' }"><span
                            :style="{ 'font-size': '11px', 'font-weight': 'bold' }" @click = applyCoupon()>Apply Coupon</span></button>
                </div>
            </div>

            <div class="card" :style="{ 'margin-top': '-14px' }">
                <h5>Customer</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Customer</div>
                        <div>{{selectedCustomer ? selectedCustomer.name : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{customerDetails ? customerDetails.contact_person_name : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Email</div>
                        <div>{{ billingDetails ? billingDetails.email: '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{ customerDetails ? customerDetails.contact_person_phone
                            : '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Billing Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Customer</div>
                        <div>{{selectedCustomer ? selectedCustomer.name : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{billingDetails ? billingDetails.contact_person_name : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Address</div>
                        <div>{{billingDetails ? billingDetails.address : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">City</div>
                        <div>{{billingDetails ? billingDetails.city : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                        <div>{{billingDetails ? billingDetails.kra_pin : '-'}}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Delivery Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Delivery Address</div>
                        <div>Mama Ngina St, LSG Building 4th floor</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Delivery Date</div>
                        <div>{{formatDateInMonthFormat(calenderValue)}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Delivery Window</div>
                        <div>{{selectedDeliveryWindow ? selectedDeliveryWindow.label : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{customerDetails ? customerDetails.contact_person_name : '-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{customerDetails ? customerDetails.contact_person_phone : '-'}}</div>
                    </div>
                </div>
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
