<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { OrdersService } from '@/service/OrdersService';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
    orderId: {
        type: String,
        required: true
    },
    orderNumber: {
        type: String,
        required: true
    }
});
const router = useRouter();

const ordersService = new OrdersService();
const productService = new ProductService();
const store = useStore();

const tableLoading = ref(true);

const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);

const customerList = ref([
    { name: 'Alice Johnson', label: 'Alice Johnson' },
    { name: 'Bob Smith', label: 'Bob Smith' },
    { name: 'Catherine Brown', label: 'Catherine Brown' },
    { name: 'David Wilson', label: 'David Wilson' },
    { name: 'Ella Garcia', label: 'Ella Garcia' },
    { name: 'Frank White', label: 'Frank White' },
    { name: 'Grace Taylor', label: 'Grace Taylor' },
    { name: 'Henry Martinez', label: 'Henry Martinez' },
    { name: 'Ivy Anderson', label: 'Ivy Anderson' },
    { name: 'Jack Thomas', label: 'Jack Thomas' }
]);
const paymentTypes = ref([
    { name: 'cash', label: 'Cash' },
    { name: 'credit', label: 'Credit' }
]);
const deliveryLocations = ref([
    { name: 'headquarter1', label: 'Headquarters 1' },
    { name: 'headquarter2', label: 'Headquarters 2' },
    { name: 'headquarter3', label: 'Headquarters 3' }
]);
const deliveryMethods = ref([
    { name: 'pickUpFromWarehouse', label: 'Pick up from warehouse' },
    { name: 'regularDelivery', label: 'Regular delivery' }
]);
const deliveryWindows = ref([
    { name: '1', label: '6am - 9am' },
    { name: '2', label: '9am - 12 pm' },
    { name: '3', label: '1pm - 4 pm' }
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
const addedLineItems = ref(null);
const orderNotes = ref(null);
let orderData = ref(null);
const selectedItemsArray = ref([]);
let companyDetails = ref(null);
let addressDetails = ref(null);
const selectedItem = computed(() => store.getters['purchaseReceive/getSelectedItem']);
let delivered = selectedItem.value.deliveryDate;
let paid = selectedItem.value.paid;
let createdBy = selectedItem.value.createdBy;
let created = selectedItem.value.created;
let updated = selectedItem.value.updated

// const orderNumber = ref(route.params.orderNumber);
let lineItems = ref([]);

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
    console.log('Printing selected customer ', selectedCustomer.value.label);
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
    console.log('selectedProducts ', addedLineItems);
    productDialog.value = false;
};

const createNewOrder = async () => {
    const payload = {
        'company_id': selectedCustomer,
        'delivery_type': selectedDeliveryMethod,
        'delivery_date': deliveryDate,
        'delivery_address_id': selectedDeliveryLocation || 1,
        'delivery_slot': selectedDeliveryWindow,
        'coupon_id': couponCode || '',
        'products': []
    }
    try {
        const data = await ordersService.createNewOrder(payload);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

const fetchProducts = async () => {
    const data = await productService.fetchAllProducts();
    const variationsWithName = data.data.map(sku =>
        sku.variations.map(variation => ({
            ...variation, // Keep existing variation properties
            name: sku.name // Add the name from the SKU
        }))
    ).flat(); // Flatten the array of arrays into a single array

    skus.value = variationsWithName;
}

const editOrder = () => {
    console.log("Edit order called");
    router.push({ name: 'editOrder' });

}
const fetchOrderDetails = async () => {
    try {
        orderData = await ordersService.fetchSingleOrder(props.orderId);
        store.dispatch('orders/setOrderDetailsArray', orderData);
        console.log(" orderData",orderData);
        companyDetails.value = orderData.company;
        addressDetails.value = orderData.address;
        const variants = orderData.order_line_items.map(lineItem => {
            return {
                sku: lineItem.unit_variant.grade_variant.sku,
                item: '',
                gradeName: lineItem.unit_variant.grade_variant.grade.name,
                sellingPrice: lineItem.unit_variant.selling_price,
                orderQuantity: lineItem.order_quantity,
                unit: lineItem.unit_variant.unit.name,
                kgPerUnit: lineItem.unit_variant.weight_per_unit,
                quantity: Math.floor(lineItem.order_quantity * lineItem.unit_variant.weight_per_unit),
                processing: lineItem.processing,
                size: '',
                ripeness: '',
                unitCost: '',
                unitPrice: '',
            };
        });

        lineItems.value = variants;
        console.log("Line Items:", lineItems.value);

    } catch (error) {
        console.error("Error fetching order details:", error);
    } finally {
        console.log("Finally block executed")
        tableLoading.value = false;
        console.log("Table loading ",tableLoading.value )
    }
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

// Lifecycle hooks
onBeforeMount(() => {
    initFilters();
});
onMounted(async () => {
    console.log("On mounted called..!!");
    fetchOrderDetails();
    fetchProducts();
});

</script>

<template>

        <div class="flex justify-content-between">
            <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem', 'color': '#122C20' }">
                <router-link :to="{ path: '/sourcing/purchase-receive' }" class="back-arrow">
                    <i class="pi pi-arrow-left" :style="{ 'color': '#122C20' }"></i>
                </router-link> Farmer Order: {{ selectedItem?.orderNo }}                   
                
            </h5>
            <div :style="{ 'margin-left': '30px' }"><Button type="button" label="Edit Order" icon="pi pi-file-edit"
                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }" @click="editOrder()"></Button></div>
    
        </div>
        <div class="flex gap-2 flex-row flex-wrap pb-3" :style="{ 'margin-top': '-0.8rem', 'margin-left': '-2rem' }">
            <div>
                <Badge :value="`Delivered: ${delivered}`" severity="secondary" class="border-noround"></Badge>
            </div>
            <div>
                <Badge :value="`Paid: ${paid}`" severity="secondary" class="border-noround"></Badge>
            </div>
            <div>
                <Badge :value="`Created By: ${createdBy}`" severity="secondary" class="border-noround"></Badge>
            </div>
            <div>
                <Badge :value="`Created : ${created}`" severity="secondary" class="border-noround"></Badge>
            </div>
            <div>
                <Badge :value="`Created: ${updated}`" severity="secondary" class="border-noround"></Badge>
            </div>
       
        </div>
    
        <div class="grid" :style="{ 'margin-left': '-2rem' }">

            <div class="col-12 md:col-8">

                <div class="card h-30rem">
                    <DataTable ref="dt" :value="selectedItem?.lineItems" dataKey="sku" :paginator="true" :rows="10" :filters="filters" :loading="tableLoading"
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
                            <Button type="button" label="Export CSV" icon="pi pi-file-export"
                              :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF','color':'#122C20','font-weight':'bold' }"
                              @click="exportCSV($event)"></Button>
                          </div>
                        </div>
                      </template>
                      <Column field="product" header="Product"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                          {{ slotProps.data.product }}
                        </template>
                      </Column>
                      <
                      <Column field="grade" header="Grade" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                          <span class="p-column-title">Grade</span>
                          {{ slotProps.data.gradeName || '-' }}
                        </template>
                      </Column>
                      <Column field="quantity" header="Quantity" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                          <span class="p-column-title">Quantity</span>
                          {{ slotProps.data.quantity || '-' }}
                        </template>
                      </Column>
                      <Column field="unit" header="Unit"  headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                          <span class="p-column-title">Unit</span>
                          {{ slotProps.data.unit?.name || '-' }}
                        </template>
                      </Column>
                      <Column field="unitCost" header="Unit Cost" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                          <span class="p-column-title">Unit Cost</span>
                          {{ slotProps.data.unitCost || '-' }}
                        </template>
                      </Column>
                      <Column field="total" header="Total" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                          <span class="p-column-title">Unit Cost</span>
                          {{ slotProps.data.unitCost || '-' }}
                        </template>
                      </Column>
                      <Column field="farmer" header="Farmer" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                          <span class="p-column-title">Unit Cost</span>
                          {{ slotProps.data.unitCost || '-' }}
                        </template>
                      </Column>
                   
                    </DataTable>
            </div>

            <div class="card h-30rem">
                <DataTable ref="dt" :value="selectedItem?.received" v-model:selection="selectedProducts" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '5px' }">
                            <h5 style="color: #808080">Received</h5>
                        </div>
                        <div class="flex justify-content-between gap-3 mt-2">
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
                                <Button type="button" label="Export CSV" icon="pi pi-file-export" class="font-bold"
                                    :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF' ,'color':'#122C20'}"
                                    @click="exportCSV($event)"></Button>
                                    <Button type="button" label="Download Delivery/PickupNote" icon="pi pi-file-export" class="font-bold"
                                    :style="{ 'background-color': '#333333', border: '#333333' ,}"
                                    @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <!-- <template v-if="tableLoading">
                        <div class="flex justify-content-center py-4">
                            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                        </div>
                    </template> -->
                    <template >
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    
                        <Column field="product" header="Product"
                            headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.product }}
                            </template>
                        </Column>
                      
                        <Column field="ordered" header="Ordered"  headerStyle="width:14%; min-width:8rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Std Wgt(G)</span>
                                {{ slotProps.data.ordered }}
                            </template>
                        </Column>
                        <Column field="dispatched" header="Received"  headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.received || '-' }}
                            </template>
                        </Column>
                      
                        <Column field="rejected" header="Rejected" 
                            headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Rejected</span>
                                {{ slotProps.data.rejected || '-' }}
                            </template>
                        </Column>
                        <Column field="reason" header="Reason"  headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                <span class="p-column-title">Reason</span>
                                {{ slotProps.data.unit_cost || '-' }}
                            </template>
                        </Column>
                        <Column field="farmer" header="Farmer"  headerStyle="width:14%; min-width:10rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.farmer || '-' }}
                            </template>
                        </Column>
                    </template>
                    
                </DataTable>
            </div>

           
 

            </div>

            <div class="col-12 md:col-4">
                <div class="card p-fluid" :style="{}">
                    <h5>Payment</h5>
                    <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Subtotal</div>
                            <div>KSH200.00</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Collection Fee</div>
                            <div>KSH00.00</div>
                        </div>
                        
                        <div class="flex justify-content-between" :style="{ 'font-weight': 'bold' }">
                            <div>Total</div>
                            <div>KSH400.00</div>
                        </div>
                    </div>
                   
                </div>
    
                <div class="card" :style="{ 'margin-top': '-14px' }">
                    <h5>Supplier</h5>
                    <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Name</div>
                            <div>{{ companyDetails?.name || '-' }}
                            </div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                            <div>{{companyDetails?.contact_person_name || '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Email</div>
                            <div>{{companyDetails?.email || '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                            <div>{{companyDetails?.phone || '-'}}</div>
                        </div>
                    </div>
                    <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                    <h5>Payee Details</h5>
                    <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Name</div>
                            <div>{{companyDetails?.name || '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Address</div>
                            <div>{{companyDetails?.contact_person_name || '-'}}</div>
                        </div>
                        
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">City</div>
                            <div>{{companyDetails?.city || '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                            <div>{{companyDetails?.kra_pin || '-'}}</div>
                        </div>
                    </div>
                    <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                    <h5>Collection Details</h5>
                    <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Location</div>
                            <div>{{addressDetails?.address || '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Collection Date</div>
                            <div>{{orderData ? formatDateInMonthFormat(orderData.delivery_date) : '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Collection Type</div>
                            <div>{{orderData?.delivery_slot || '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                            <div>{{addressDetails?.contact_person_name || '-'}}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                            <div>{{addressDetails?.phone || '-'}}</div>
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



  .p-datatable thead {
    position: sticky;
    top: 0;
    background: #fff; /* Ensure the header has a background color to cover content underneath */
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
