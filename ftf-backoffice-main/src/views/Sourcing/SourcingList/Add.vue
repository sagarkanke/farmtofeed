<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { OrdersService } from '@/service/OrdersService';
import { CompanyService } from '../../../service/CompanyService';
import { CouponsService } from '../../../service/CouponService';
import { SupplierService } from '@/service/SupplierService';
import { useToast } from 'primevue/usetoast';
const ordersService = new OrdersService();
const productService = new ProductService();
const companyService = new CompanyService();
const couponsService = new CouponsService();
const supplierService = new SupplierService();
const toast = useToast();
const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);

let customerList = ref([

]);
let supplierList = ref([])
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
    { id: 1, label: 'Grade 1' },
    { id: 2, label: 'Grade Rescue' }
]);
const selectedGrade = ref(null);
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
const editingRows = ref([]);
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
const addCommentBox = ref(false);
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
const sourcingDate = ref(null);
const specifications = ref(null);
const selectedSupplier = ref(null);
const productsList = ref([
    {
                    id: 1,
                    product: "Oranges",
                    grade:  'Grade 1',
                    quantity: 50,
                    unit:'Kg' ,
                    buyingPrice: 20.00,
                    overrideBp: false,
                    transport: 5.00,
                    total: 1000.00
                },
                {
                    id: 2,
                    product: "Apples",
                    grade:  'Grade 1',
                    quantity: 30,
                    unit:'Kg' ,
                    buyingPrice: 30.00,
                    overrideBp: true,
                    transport: 3.00,
                    total: 900.00
                },
                {
                    id: 3,
                    product: "Bananas",
                    grade:  'Grade 1',
                    quantity: 100,
                    unit:'Kg' ,
                    buyingPrice: 10.00,
                    overrideBp: false,
                    transport: 7.00,
                    total: 1000.00
                },
])
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
    if (!Array.isArray(addedLineItems.value)) {
    console.error("addedLineItems.value is not an array:", addedLineItems.value);
    return;
}

    addedLineItems.value = addedLineItems.value.map(item => {
        return {
            ...item,
            transport: true,
            grade: item.grade?.name || '-',
            unit:item.unit_variants[0]?.unit?.name || '-'
        };
    });
    console.log("Select products ", addedLineItems.value);
    totalSellingPrice.value = addedLineItems.value.reduce((accumulator, lineItem) => {
    const unitVariantsTotal = (lineItem.unit_variants || []).reduce((unitAcc, variant) => {
        // Convert selling_price to a number to avoid concatenation
        return unitAcc + Number(variant.selling_price || 0);
    }, 0);
    
    return accumulator + unitVariantsTotal;
}, 0);



    productDialog.value = false;
};

const createNewOrder = async () => {
    // Prepare products array

    const products = addedLineItems.value.flatMap(item => {
    // Ensure that item.unit_variants is an array
    return (item.unit_variants || []).map(variant => {
        // Return a new object that includes both the item and the variant properties
        return {
            product_unit_variant_id: variant.id, 
            order_quantity: variant.quantity || 0,   
            buying_price: variant.buying_price   || 0     
        };
    });
});

console.log(products);


    // Prepare payload object
    const payload = {
        supplier_id: selectedSupplier.value.id,
        delivery_type: selectedSourcingMethod.value.label,
        fulfillment_date: formatDate(sourcingDate.value),
        fulfillment_slot: "Morning",
        logistics_cost: 0,
        delivery_note: "",
        
        products
    };

    try {
        // Create new order
        const data = await ordersService.createNewFarmerOrder(payload);
        if (data) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Order created successfully!',life:3000 });
            // Reset form fields
            resetFormFields();
        }


    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error,life:3000 });

        console.error("Error creating order:", error);
    }
};


function formatDateString(dateString) {
  const date = new Date(dateString);
  
  // Format the date
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long', // Can use 'short' for abbreviated month names
    day: '2-digit',
  }) + ' ' + date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
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
    supplierService.getSupplierList()
        .then(companies => {
            supplierList.value = companies[0];
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


const deleteCoupon = () => {
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
    console.log(originalPrice, discountValue, discountType);
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

const onRowEditSave = (event) => {
    let { newData, index } = event;

    addedLineItems.value[index] = newData;
};

const removeSKU = () => {

    addedLineItems.value = addedLineItems.value.filter(sku => !selectAddedSKU.value.some(selectedSku => sku.id === selectedSku.id))

}

const onPageChange = (event) => {
    const page = event.page + 1; // PrimeVue pagination starts at 0
    fetchAllProductsList(page);
};

function onCheckboxChange(data, field) {
            try {
                // Handle checkbox change
                console.log('Checkbox changed:', data[field]);
            } catch (error) {
                console.error('Error handling checkbox change:', error);
            }
        }

// Lifecycle hooks
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    //  productService.getProducts().then((data) => (products.value = data));
    fetchProducts();
    getSupplierList()
        // getCustomerList();
});


</script>

<template>
    <div class="flex justify-content-between">
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem' }">New Farmer Order</h5>
        <div :style="{ 'margin-left': '30px' }"><Button type="button" label="Save Order" icon="pi pi-save"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }" @click="createNewOrder()"></Button></div>

    </div>

    <div class="grid" :style="{ 'margin-left': '-3rem' }">
        <div class="col-12 md:col-8">

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Order Details</h5>
                <div :style="{ 'margin-left': '-22px' }">


                    <!-- First Row -->
                    <div class="col-12 md:col-8">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Select
                                Supplier</label>
                            <Dropdown id="customer" :style="{ borderRadius: '8px' }" v-model="selectedSupplier"
                                :options="supplierList" optionLabel="name" placeholder="Select Supplier"
                                />
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Sourcing Method</label>
                            <Dropdown id="deliveryMethod" :style="{ borderRadius: '8px' }"
                                v-model="selectedSourcingMethod" :options="sourcingMethods" optionLabel="value"
                                class="custom-dropdown" placeholder="Select" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Sourcing Date</label>
                            <Calendar v-model="sourcingDate" showIcon :manualInput="false" placeholder="Select Date">
                            </Calendar>

                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryWindow"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Sourcing Time</label>
                            <Dropdown id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="selectedSourcingTime" :options="sourcingTimes" optionLabel="value"
                                placeholder="Select" />
                        </div>

                    </div>

                    <!-- Third Row -->
                    <div>
                        <div class="field col-12">
                            <label for="orderNotes"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Specification
                                (Optional)</label>
                        </div>
                        <div :style="{ 'margin-top': '-30px', 'margin-left': '15px' }">
                            <Textarea id="orderNotes" v-model="specifications" rows="4"
                                placeholder="Type your note here..." :style="{ width: '100%' }"></Textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card" :style="{ height: 'auto' }">
                <DataTable ref="dt" 
                :value="addedLineItems" 
                v-model:selection="selectAddedSKU" 
                dataKey="id"
                v-model:editingRows="editingRows" 
                :paginator="true" 
                :rows="10" 
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]" 
                editMode="row"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                @row-edit-save="onRowEditSave" 
                @page="onPageChange" 
                :pt="{
                        table: { style: 'min-width: 50rem' },
                        column: {
                            bodycell: ({ state }) => ({
                                style: state['d_editing'] ? 'padding-top: 0.75rem; padding-bottom: 0.75rem;' : ''
                            })
                        }
                    }">
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
                                    :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF', 'color': '#122C20' }"
                                    @click="removeSKU()"></Button>
                                <Button type="button" label="Add" icon="pi pi-plus"
                                    :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"
                                    @click="addNewLineItem()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <Column field="product" header="Product " :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Product</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>

                    <Column field="grade" header="Grade" headerStyle="width:14%; min-width:10rem;">
                        <template #editor="{ data, field }">
                            <Dropdown v-model="data[field]" :options="gradeFilters" optionLabel="label"
                                placeholder="Select Grade" fluid>
                                <template #option="slotProps">
                                    <span>{{ slotProps.option.label }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column field="quantity" header="Quantity" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data, field }">
                            {{ data[field] || 0 }}
                        </template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" fluid />
                        </template>
                    </Column>

                    <Column field="unit" header="Unit" headerStyle="width:14%; min-width:10rem;">
                        <template #editor="{ data, field }">
                            <Dropdown v-model="data[field]" :options="units" optionLabel="label"
                                placeholder="Select Unit" fluid>
                                <template #option="slotProps">
                                    <span>{{ slotProps.option.label }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column field="buyingPrice" header="Buying Price" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data, field }">
                            {{ data[field] || 0}}
                        </template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" fluid />
                        </template>
                    </Column>

                    <Column field="overrideBp" header="Override BP" headerStyle="width:14%; min-width:10rem;">
                        <template #body="{ data, field }">
                            {{ data[field] || '-'}}
                        </template>
                        <template #editor="{ data, field }">
                            <InputNumber v-model="data[field]" fluid />
                        </template>
                    </Column>

                    <Column field="transport" header="Transport" headerStyle="width:14%; min-width:10rem;">
                        <!-- Body template for displaying the icon based on the checkbox state -->
                        <template #body="{ data, field }">
                            <i :class="data[field] ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
                        </template>
            
                        <!-- Editor template for editing the value using a checkbox -->
                        <template #editor="{ data, field }">
                            <Checkbox id="checkOption1"
                            v-model="data[field]" fluid/>
                        </template>
                    </Column>

        

                    <Column field="total" header="Total" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Total</span>
                            {{ slotProps.data.total || 0}}
                        </template>
                    </Column>

                    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
                    </Column>
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
                        <DataTable ref="dt" :value="skus" :filters="filters" v-model:selection="addedLineItems"
                            dataKey="sku" :scrollable="true" scrollHeight="200px" :style="{ 'margin-left': '-20px' }">
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
                            <Column field="name" header="Name" :sortable="true"
                                headerStyle="width:14%; min-width:10rem;">
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
                            :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF', width: '100px', 'color': '#122C20' }"
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
                <h5>Bill</h5>
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
                            <div>KSH {{ totalSellingPrice || 0 }}</div>
                        </div>
                        <div class="flex justify-content-between" :style="{ 'font-weight': 'bold' }">
                            <div>Total</div>
                            <div>KSH {{ total>0?total:totalSellingPrice }}</div>
                        </div>
                    </div>
                </template>

            
            </div>

            <div class="card" :style="{ 'margin-top': '-14px' }">
                <h5>Billing Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Name</div>
                        <div>{{ selectedSupplier ? selectedSupplier.name : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Contact Person</div>
                        <div>{{ customerDetails ? customerDetails.contact_person_name : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Email</div>
                        <div>{{ billingDetails ? billingDetails.email : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{ customerDetails ? customerDetails.contact_person_phone
                            : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                        <div>{{ kraPin ? kraPin
                            : '-' }}</div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Supplier Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Location</div>
                        <div>{{ selectedSupplier ? selectedSupplier.name : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Sourcing Date</div>
                        <div>{{ sourcingDate ? formatDate(sourcingDate): '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Sourcing Time</div>
                        <div>{{ selectedSourcingTime ? selectedSourcingTime.value: '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Sourcing Type</div>
                        <div>{{selectedSourcingType ? selectedSourcingType: '-' }}</div>
                    </div>
                
                </div>
               
               
               
    
            </div>
            <div class="card">
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <h5>Comments</h5>
                        <Button type="button" label="Add Comment" icon="pi pi-plus"
                :style="{'background-color': '#F7E6D4','color':' #814E18'
                ,
                    'border': '#1E4A35','border-radius': '8px' }" @click="addCommentBox = 'true'" class="-mt-2 text-sm	"></Button>
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
    background: rgba(255, 255, 255, 0.8);
    /* Optional: background to make spinner more visible */
    z-index: 10;
    /* Ensure spinner is above table content */
    pointer-events: none;
    /* Allow clicks to pass through spinner */
}
</style>
