<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { OrdersService } from '@/service/OrdersService';
import { CompanyService } from '../../../service/CompanyService';
import { CouponsService } from '../../../service/CouponService';
import { SupplierService } from '@/service/SupplierService';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';

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

let customerList = ref([]);
let supplierList = ref([]);
const units = ref([
    { id: 1, label: 'KG' },
    { id: 2, label: 'Bunch' },
    { id: 3, label: 'Piece' },
    { id: 4, label: 'Punnet' }
]);

const processing = ref([
    { id: 1, label: 'None' },
    { id: 2, label: 'Whole' },
    { id: 3, label: 'Peeled' },
    { id: 4, label: 'Diced' }
]);
const sizes = ref([
    { id: 1, label: 'Small' },
    { id: 2, label: 'Medium' },
    { id: 3, label: 'Large' }
]);
const ripeness = ref([
    { id: 1, label: 'Ripe' },
    { id: 2, label: 'Unripe' }
]);
const paymentTypes = ref([
    { name: 'cash_on_delivery', label: 'Cash on Delivery' },
    { name: 'credit', label: 'Credit' }
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
const supplierName = ref(null);
const supplierTypes = ref([
    { key: 'farmer', label: 'Farmer' },
    { key: 'supply_hub', label: 'Supply Hub' },
    { key: 'aggregator', label: 'Aggregator' },
    { key: 'exporter', label: 'Exporter' },
    { key: 'market', label: 'Market' }
]);
const selectedSupplierType = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const email = ref(null);
const phone = ref(null);
const location = ref(null);
const coordinates = ref(null);
const cropsList = ref(null);
const mpesaNumber = ref(null);
const paymentPreferences = ref([]);
const kraPin = ref(null);
const farmersList = ref(null);
const tableData = ref([
    { sku: 1, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 2, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 3, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 4, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 5, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 },
    { sku: 6, name: 'Apple Crispy Red', grade: '1', available: '200', committed: 5, incoming: 56 }
    // Add more static data as needed
]);
const code_of_conduct_file_upload = ref();
const code_of_conduct_file_data = ref(null);
let code_of_conduct_file_name = ref('');
const sourcingMethods = ref([
    { label: 'pickup', value: 'Pickup' },
    { label: 'delivery', value: 'Delivery' }
]);
const selectedSourcingMethod = ref(null);
const sourcingTimes = ref([
    { label: 'before5Am', value: 'Before 5:00 am' },
    { label: 'before12Pm', value: 'Before 12:00 pm' },
    { label: 'before5Pm', value: 'Before 5:00 pm' }
]);
const selectedSourcingTime = ref(null);
const sourcingDate = ref(null);
const specifications = ref(null);
const selectedSupplier = ref(null);
const addCropDialog = ref(false);
const addNewFarmerDialog = ref(false);
const farmerList = ref([]);
const selectedPaymentReference = ref();
const integrationLogs = ref(null);
// const cropsList = ref([]);
const productsList = ref([
    {
        id: 1,
        product: 'Oranges',
        grade: 'Grade 1',
        quantity: 50,
        unit: 'Kg',
        buyingPrice: 20.0,
        overrideBp: false,
        transport: 5.0,
        total: 1000.0
    },
    {
        id: 2,
        product: 'Apples',
        grade: 'Grade 1',
        quantity: 30,
        unit: 'Kg',
        buyingPrice: 30.0,
        overrideBp: true,
        transport: 3.0,
        total: 900.0
    },
    {
        id: 3,
        product: 'Bananas',
        grade: 'Grade 1',
        quantity: 100,
        unit: 'Kg',
        buyingPrice: 10.0,
        overrideBp: false,
        transport: 7.0,
        total: 1000.0
    }
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
    if (!Array.isArray(addedLineItems.value)) {
        console.error('addedLineItems.value is not an array:', addedLineItems.value);
        return;
    }

    addedLineItems.value = addedLineItems.value.map((item) => {
        return {
            ...item,
            transport: true,
            grade: item.grade?.name || '-',
            unit: item.unit_variants[0]?.unit?.name || '-'
        };
    });
    console.log('Select products ', addedLineItems.value);
    totalSellingPrice.value = addedLineItems.value.reduce((accumulator, item) => {
        return accumulator + item.selling_price;
    }, 0);
    productDialog.value = false;
};

const createNewOrder = async () => {
    // Prepare products array

    const products = addedLineItems.value.map((item) => {
        // Log the item
        console.log('item', item);

        // Return the new object with the additional fields
        return {
            product_variant_id: item.id,
            order_quantity: item.quantity,
            // processing: item.selectedProcessing,
            ripeness: item.selectedRipeness,
            size: item.selectedSize
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
        coupon_id: couponCode.value || '',
        delivery_notes: JSON.parse(JSON.stringify(orderNotes.value)) || '',
        products
    };

    try {
        // Create new order
        const data = await ordersService.createNewOrder(payload);
        if (data) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Order created successfully!' });
            // Reset form fields
            resetFormFields();
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save the order.' });

        console.error('Error creating order:', error);
    }
};

const fetchProducts = async () => {
    const data = await productService.fetchAllProducts();
    const variationsWithName = data.data
        .map((sku) =>
            sku.variations.map((variation) => ({
                ...variation,
                name: sku.name
            }))
        )
        .flat(); // Flatten the array of arrays into a single array

    skus.value = variationsWithName;
};

const getSupplierList = async () => {
    supplierService
        .getSupplierList()
        .then((companies) => {
            supplierList.value = companies;
            console.log('supplierList.value ', supplierList.value);
        })
        .catch((error) => {
            console.error('Error fetching companies:', error);
        });
};

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
    companyService
        .fetchBillingDetails(selectedCustomer.value.id)
        .then((companies) => {
            billingDetails.value = companies[0];
        })
        .catch((error) => {
            console.error('Error fetching companies:', error);
        });
};

const getCustomerDetails = async () => {
    supplierService
        .getSupplierList()
        .then((companies) => {
            supplierList.value = companies[0];
            console.log('Printing Company Address Details ', customerDetails);
        })
        .catch((error) => {
            console.error('Error fetching companies:', error);
        });
};

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
        console.log('Total ', total);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Coupon applied successfully.', life: 5000 });
    } catch (error) {
        console.log('error ', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid Coupon.', life: 5000 });
    } finally {
        isLoading.value = false;
    }
};

const deleteCoupon = () => {
    couponDiscount.value = 0.0;
    total.value = totalSellingPrice.value;
    appliedCoupon.value = '';
};

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
        discountedPrice = originalPrice - originalPrice * (discountValue / 100);
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
    addedLineItems.value = addedLineItems.value.filter((sku) => !selectAddedSKU.value.some((selectedSku) => sku.id === selectedSku.id));
};

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

const addNewCrop = () => {
    addCropDialog.value = true;
};

const openFarmerDialog = () => {
    addNewFarmerDialog.value = true
}
// Lifecycle hooks
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    //  productService.getProducts().then((data) => (products.value = data));
    fetchProducts();
    getSupplierList();
    // getCustomerList();
});
</script>

<template>
    <div class="flex justify-content-between">
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem' }">New Supplier</h5>
        <div :style="{ 'margin-left': '30px' }">
            <Button type="button" label="Save Order" icon="pi pi-save"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }" @click="createNewOrder()"></Button>
        </div>
    </div>

    <div class="grid" :style="{ 'margin-left': '-3rem' }">
        <div class="col-12 md:col-8">
            <!-- Supplier Details -->
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Supplier Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Name</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="supplierName" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Type</label>
                            <Dropdown id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="selectedSupplierType" :options="supplierTypes" optionLabel="label"
                                placeholder="Select" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Details -->

            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Contact Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">First
                                Name</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="firstName" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Last
                                Name</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="lastName" aria-describedby="username-help" />
                        </div>
                    </div>
                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Email</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="email" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Phone</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="phone" aria-describedby="username-help" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Location Details -->
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Location Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Location </label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="location" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Coordinates </label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="coordinates" aria-describedby="username-help" />
                        </div>
                    </div>
                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Crops
                                Available</label>
                            <Dropdown id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="selectedSupplierType" :options="cropsList" optionLabel="label"
                                placeholder="Select" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Farmers</label>
                            <Dropdown id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="selectedSupplierType" :options="farmerList" optionLabel="label"
                                placeholder="Select" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Billing Details -->
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Billing Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Mpesa
                                Number </label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="mpesaNumber" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Payment
                                Preferences </label>
                            <Dropdown id="deliveryWindow" :style="{ borderRadius: '8px' }"
                                v-model="selectedPaymentReference" :options="paymentPreferences" optionLabel="label"
                                placeholder="Select" />
                        </div>
                    </div>
                    <!-- Second Row -->
                    <div class="flex column-gap-2 ml-3">
                        <div class="field flex-3 flex flex-column w-6">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">KRA
                                Pin</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="kraPin" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column justify-content-end w-6">
                            <FileUpload name="code_of_conduct" ref="code_of_conduct_file_upload" mode="basic"
                                class="w-12" @select="handleFileChangeCodeOfConduct" :multiple="true"
                                accept="image/*,application/pdf" :style="{ 'background-color': '#333333','border':'#333333' }"
                                :maxFileSize="1000000" @upload="onUpload" chooseLabel="Upload KRA Certificate">
                            </FileUpload>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Crops Available -->
            <div class="card">
                <DataTable ref="dt" :value="cropsList" v-model:selection="selectedOrders" dataKey="id" :paginator="true"
                    :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0 text-color-secondary">Crops Available</h5>
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
                                <Button type="button" label="Remove" icon="pi pi-trash"
                                    :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', 'color': '#C80000' }"
                                    @click="exportCSV($event)"></Button>
                                <Button type="button" label="Add Crops" icon="pi pi-plus"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="addNewCrop()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.user?.name || '-' }}

                        </template>
                    </Column>
                    <Column> <Button icon="pi pi-trash" class="p-button-text p-button-plain flex-end"
                            @click="handleDelete(index, 'images')" :style="{ 'color': 'red', 'margin-left': 'auto' }" />
                    </Column>


                </DataTable>


                <Dialog v-model:visible="addCropDialog" :style="{ width: '350px' }" :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Add
                                Crop</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>

                    <div class="field">
                        <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Crop
                        </label>
                        <Dropdown id="inventoryStatus" v-model="product.supplierId" :options="supplierList"
                            optionLabel="value" placeholder="Select">
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
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                            @click="hideDialog" />
                        <Button type="button" label="Add Crop" icon="pi pi-check"
                            :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="saveProduct" />
                    </template>
                </Dialog>


            </div>

            <!-- Farmers -->
            <div class="card">
                <DataTable ref="dt" :value="farmerList" v-model:selection="selectedOrders" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0 text-color-secondary">Farmers</h5>
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
                                <Button type="button" label="Remove" icon="pi pi-trash"
                                    :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', 'color': '#C80000' }"
                                    @click="exportCSV($event)"></Button>
                                <Button type="button" label="Add Farmer" icon="pi pi-plus"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="openFarmerDialog()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.user.name || '-' }}

                        </template>
                    </Column>
                    <Column field="phoneNo" header="Phone Number" headerStyle="width:14%; min-width:11rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.contact || '-' }}

                        </template>
                    </Column>
                    <Column field="email" header="Email" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.user?.email }}
                        </template>
                    </Column>
                    <Column field="type" header="Type" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.supplier_type || '-' }} </template>
                    </Column>


                </DataTable>

                <Dialog v-model:visible="addNewFarmerDialog" :style="{ width: '350px' }" :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Add
                                Farmer</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>

                    <div class="field">
                        <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Crop
                        </label>
                        <Dropdown id="inventoryStatus" v-model="product.supplierId" :options="supplierList"
                            optionLabel="value" placeholder="Select">
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
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                            @click="hideDialog" />
                        <Button type="button" label="Add Crop" icon="pi pi-check"
                            :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }" @click="saveProduct" />
                    </template>
                </Dialog>
            </div>

            <!-- Interaction Log -->
            <div class="card">
                <h5 :style="{ color: 'gray', 'font-size': 'medium', 'margin-left': '-10px' }">Integration Log</h5>
                <div :style="{ 'margin-left': '-10px' }">
                    <div class="card mt-2 h-8rem flex justify-content-center align-items-center"
                        :style="{ 'background-color': '#F6F6F6', 'cursor': 'pointer' }" @click="triggerFileInput">
                        <input type="file" ref="fileInput" multiple @change="handleFileChange('images', $event)"
                            accept="image/*" style="display: none;" />
                        <div class="flex flex-column align-items-center justify-content-center text-center"
                            :style="{ 'cursor': 'pointer' }">
                            {{ integrationLogs ? integrationLogs : 'N/A' }}
                        </div>
                    </div>
                </div>
                <div :style="{ 'margin-left': '-10px' }">
                    <div class="mt-5">
                        <label for="integrationLogs" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Write
                            log
                        </label>
                    </div>
                    <div class="mt-2">
                        <Textarea id="orderNotes" v-model="integrationLogs" rows="4"
                            placeholder="Type your note here..." :style="{ width: '100%' }"></Textarea>
                    </div>
                </div>
                <div class="flex flex-1 justify-content-end mt-3">
                    <Button type="button" label="Publish Log" icon="pi pi-file-import"
                        :style="{ 'background-color': '#DFEDDF', border: '#DFEDDF',color: '#122C20' }"
                        @click="addNewCrop()"></Button>
                </div>
            </div>
        </div>

        <div class="col-12 md:col-4">

            <div class="card p-fluid" :style="{}">
                <h5>Status</h5>
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option1" name="option" value="activa" v-model="radioValue" />
                            <label for="option1">Active</label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option2" name="option" value="inactive" v-model="radioValue" />
                            <label for="option2">Inactive</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card p-fluid" :style="{}">
                <h5>Supplier Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Name</div>
                        <div>{{supplierName?supplierName:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Supplier Type</div>
                        <div>{{selectedSupplierType?selectedSupplierType.label:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Last Contacted</div>
                        <div>{{lastContactDate?lastContactDate:'-'}}</div>
                    </div>
                   
                </div>
               

                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Contact Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Name</div>
                        <div>{{firstName?firstName:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Email</div>
                        <div>{{email?email:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{phone?phone:'-'}}</div>
                    </div>
                   
                </div>

                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Location Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Location</div>
                        <div>{{location?location:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Coordinates</div>
                        <div>{{coordinates?coordinates:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{phone?phone:'-'}}</div>
                    </div>
                   
                </div>
                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Billing Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Mpesa No.</div>
                        <div>{{mpesaNumber?mpesaNumber:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Payment Preference</div>
                        <div>{{selectedPaymentReference?selectedPaymentReference:'-'}}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                        <div>{{kraPin?kraPin:'-'}}</div>
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
