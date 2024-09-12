<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { OrdersService } from '@/service/OrdersService';
import { CompanyService } from '../../../service/CompanyService';
import { CouponsService } from '../../../service/CouponService';
import { SupplierService } from '@/service/SupplierService';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import FileUpload from 'primevue/fileupload';

const ordersService = new OrdersService();
const productService = new ProductService();
const companyService = new CompanyService();
const couponsService = new CouponsService();
const supplierService = new SupplierService();
const toast = useToast();
const store = useStore();
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
const activeTab = ref('supplyHistory');
const location = ref(null);
const coordinates = ref(null);
// const cropsList = ref(null);
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
const selectedItem = computed(() => store.getters['farmer/getSelectedItem']);
console.log("selectedItem ", selectedItem.value);
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
const farmerList = ref([
    { id: 1, name: "John Doe", phone: "555-1234", email: "john@example.com" },
        { id: 2, name: "Mary Smith", phone: "555-5678", email: "mary@example.com" },
        { id: 3, name: "Robert Johnson", phone: "555-8765", email: "robert@example.com" },
        { id: 4, name: "Patricia Brown", phone: "555-4321", email: "patricia@example.com" },
        { id: 5, name: "Michael Davis", phone: "555-0987", email: "michael@example.com" },
        { id: 6, name: "Linda Wilson", phone: "555-6543", email: "linda@example.com" },
        { id: 7, name: "James Taylor", phone: "555-3210", email: "james@example.com" },
        { id: 8, name: "Barbara Moore", phone: "555-7890", email: "barbara@example.com" },
        { id: 9, name: "William Martin", phone: "555-2109", email: "william@example.com" },
        { id: 10, name: "Elizabeth Jackson", phone: "555-1098", email: "elizabeth@example.com" }
]);
const selectedPaymentReference = ref();
const integrationLogs = ref(null);
const nestedRouteItems = ref([
    { label: 'Supply History', key: 'supplyHistory' },
    { label: 'Crops', key: 'crops' },
    { label: 'Planted', key: 'planted' },
    { label: 'Harvested', key: 'harvested' },
]);
const supplyHistoryList = ref([
    {
          id: 1,
          fulfillment_date: '2024-08-15',
          foNo: 'FO12345',
          order_line_items: [
            { itemName: 'Tomatoes', quantity: 100 },
            { itemName: 'Potatoes', quantity: 50 },
          ],
          quantity: 150,
          price: 1200,
          totalOrderAmount: 1800,
          dateReceived: '2024-08-14',
          status: 'Delivered'
        },
        {
          id: 2,
          fulfillment_date: '2024-08-18',
          foNo: 'FO12346',
          order_line_items: [
            { itemName: 'Cabbage', quantity: 30 },
            { itemName: 'Onions', quantity: 60 },
          ],
          quantity: 90,
          price: 900,
          totalOrderAmount: 1350,
          dateReceived: '2024-08-17',
          status: 'Pending'
        },
        {
          id: 3,
          fulfillment_date: '2024-08-20',
          foNo: 'FO12347',
          order_line_items: [
            { itemName: 'Carrots', quantity: 40 },
            { itemName: 'Garlic', quantity: 20 },
          ],
          quantity: 60,
          price: 1100,
          totalOrderAmount: 1600,
          dateReceived: '2024-08-19',
          status: 'Cancelled'
        },
        {
          id: 4,
          fulfillment_date: '2024-08-22',
          foNo: 'FO12348',
          order_line_items: [
            { itemName: 'Peppers', quantity: 25 },
            { itemName: 'Broccoli', quantity: 35 },
          ],
          quantity: 60,
          price: 1300,
          totalOrderAmount: 1950,
          dateReceived: '2024-08-21',
          status: 'Shipped'
        },
        {
          id: 5,
          fulfillment_date: '2024-08-25',
          foNo: 'FO12349',
          order_line_items: [
            { itemName: 'Eggplant', quantity: 10 },
            { itemName: 'Lettuce', quantity: 15 },
          ],
          quantity: 25,
          price: 500,
          totalOrderAmount: 750,
          dateReceived: '2024-08-24',
          status: 'Delivered'
        }
]);
const farmerOrders = ref([

]);
const interactionLogs = ref([
    { 
          id: 1, 
          name: "John Doe", 
          date: "2024-09-01", 
          interaction: "Purchase - Fresh Vegetables", 
          notes: "We are excited that we have made initial contact with our lead customer. John purchased organic vegetables and is interested in regular deliveries of fresh produce." 
        },
        { 
          id: 2, 
          name: "Mary Smith", 
          date: "2024-09-02", 
          interaction: "Inquiry - Dairy Products", 
          notes: "Mary asked about the availability of lactose-free milk and yogurt. She is comparing options and will likely place an order next week." 
        },
        { 
          id: 3, 
          name: "Robert Johnson", 
          date: "2024-09-03", 
          interaction: "Purchase - Bakery Items", 
          notes: "Robert made a purchase of freshly baked bread and pastries. He mentioned interest in our subscription service for weekly bakery deliveries." 
        },
        { 
          id: 4, 
          name: "Patricia Brown", 
          date: "2024-09-04", 
          interaction: "Support - Order Issue", 
          notes: "Patricia reached out regarding a missing item in her grocery delivery. The issue was resolved, and she was satisfied with the outcome." 
        },
        { 
          id: 5, 
          name: "Michael Davis", 
          date: "2024-09-05", 
          interaction: "Purchase - Organic Fruits", 
          notes: "Michael purchased a variety of organic fruits and inquired about our seasonal fruit box. He is interested in subscribing for monthly deliveries." 
        }
])
const payments = ref([
    {
          id: 1,
          fulfillment_date: "2024-09-01",
          order_number: "FO12345",
          order_line_items: [
            { item: "Item 1", quantity: 2 },
            { item: "Item 2", quantity: 1 }
          ],
          rejectedItems: 1,
          totalOrderAmount: 500.0,
          status: "active",
        },
        {
          id: 2,
          fulfillment_date: "2024-09-02",
          order_number: "FO12346",
          order_line_items: [
            { item: "Item 3", quantity: 3 },
            { item: "Item 4", quantity: 2 }
          ],
          rejectedItems: 0,
          totalOrderAmount: 300.0,
          status: "inactive",
        },
        {
          id: 3,
          fulfillment_date: "2024-09-03",
          order_number: "FO12347",
          order_line_items: [
            { item: "Item 5", quantity: 5 }
          ],
          rejectedItems: 2,
          totalOrderAmount: 750.0,
          status: "active",
        },
        {
          id: 4,
          fulfillment_date: "2024-09-04",
          order_number: "FO12348",
          order_line_items: [
            { item: "Item 6", quantity: 1 },
            { item: "Item 7", quantity: 2 }
          ],
          rejectedItems: 0,
          totalOrderAmount: 450.0,
          status: "inactive",
        },
        {
          id: 5,
          fulfillment_date: "2024-09-05",
          order_number: "FO12349",
          order_line_items: [
            { item: "Item 8", quantity: 3 }
          ],
          rejectedItems: 1,
          totalOrderAmount: 650.0,
          status: "active",
        }
])
// const cropsList = ref([]);
const cropsList = ref([
    { id: 1, name: "Wheat" },
        { id: 2, name: "Rice" },
        { id: 3, name: "Corn" },
        { id: 4, name: "Barley" },
        { id: 5, name: "Soybeans" },
        { id: 6, name: "Sugarcane" },
        { id: 7, name: "Cotton" },
        { id: 8, name: "Oats" },
        { id: 9, name: "Sorghum" },
        { id: 10, name: "Peanuts" }
]);

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

const plantedCropsList = ref([ 
    {
          id: 1,
          name: "Corn",
          harvestDate: "2024-07-10",
          yield: "2000 KG",
          sold: "1500 KG",
          wasted: "100 KG",
          inStock: "400 KG",
          noAcresPlanted: 10,
          cleaning: "Completed",
          storage: "Cold Storage",
        },
        {
          id: 2,
          name: "Wheat",
          harvestDate: "2024-07-15",
          yield: "3000 KG",
          sold: "2000 KG",
          wasted: "50 KG",
          inStock: "950 KG",
          noAcresPlanted: 20,
          cleaning: "In Progress",
          storage: "Warehouse",
        },
        {
          id: 3,
          name: "Soybeans",
          harvestDate: "2024-08-01",
          yield: "1500 KG",
          sold: "1000 KG",
          wasted: "20 KG",
          inStock: "480 KG",
          noAcresPlanted: 8,
          cleaning: "Completed",
          storage: "Silo",
        },
        {
          id: 4,
          name: "Rice",
          harvestDate: "2024-08-10",
          yield: "2500 KG",
          sold: "1800 KG",
          wasted: "40 KG",
          inStock: "660 KG",
          noAcresPlanted: 12,
          cleaning: "Pending",
          storage: "Cold Storage",
        },
        {
          id: 5,
          name: "Barley",
          harvestDate: "2024-07-22",
          yield: "1000 KG",
          sold: "700 KG",
          wasted: "10 KG",
          inStock: "290 KG",
          noAcresPlanted: 5,
          cleaning: "Completed",
          storage: "Warehouse",
        }])
const harvestedPlantsList = ref([

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
const handleTabChange = ({ index }) => {
    console.log("Index ", index);
    activeTab.value = nestedRouteItems.value[index].key;
    console.log("activeTab ", activeTab.value);
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

const fetchFarmerOrders = async () => {
    try {
        const data = await supplierService.fetchAllOrders();
        farmerOrders.value = data.data;
        console.log("farmerOrders ", farmerOrders.value)
        farmerOrders.value.forEach(order => {
            const totalOrderAmount = order.order_line_items.reduce((sum, lineItem) => {
                return sum + lineItem.buying_price;
            }, 0);

            order.totalOrderAmount = totalOrderAmount;
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        isLoading.value = false;
    }
}
// Lifecycle hooks
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    //  productService.getProducts().then((data) => (products.value = data));
    fetchProducts();
    fetchFarmerOrders()
    getSupplierList();
    // getCustomerList();
});
</script>

<template>
    <div class="flex justify-content-between">
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem', 'color': '#122C20' }">FTF:
            {{ selectedItem?.farmerName }}</h5>
        <div :style="{ 'margin-left': '30px' }">
            <Button type="button" label="Save Order" icon="pi pi-save"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }" @click="createNewOrder()"></Button>
        </div>

    </div>
    <div class="flex " :style="{ 'margin-left': '-3rem' }">
        <div class="col-12 lg:col-3 xl:col-3">
            <div class="card mb-0 p-0" :style="{ height: 'calc(110% + 5px)' }">
                <div class="flex justify-content-between mb-2 ml-2 mt-2">
                    <div>
                        <span class="block text-500 font-medium mb-1">Total Farmers</span>
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
                        <span class="block text-500 font-medium mb-1">Inactive</span>
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
                        <span class="block text-500 font-medium mb-1">Cancelled</span>
                        <div class="text-xl font-bold mt--0">1234</div>
                    </div>
                </div>
                <Badge severity="warning" class="ml-2 mt--2"><i class="pi pi-arrow-down"
                        :style="{ 'font-size': 'smaller' }"></i> 12.89% </Badge>
                <span class="text-400" :style="{ 'font-size': '12px' }"> vs last months : 1200</span>
            </div>
        </div>
    </div>

    <div class="custom-tabmenu-wrapper mt-2" :style="{ 'margin-left': '-3rem' }">
        <TabMenu :model="nestedRouteItems" :activeIndex="nestedRouteItems.findIndex(item => item.key === activeTab)"
            @tab-change="handleTabChange" />
    </div>

    <div class="grid mt-2" :style="{ 'margin-left': '-3rem' }">
        <div class="col-12 md:col-8">

            <!-- Supply History  -->
            <div class="card" v-if="activeTab === 'supplyHistory'">
                <DataTable ref="dt" :value="supplyHistoryList" v-model:selection="selectedOrders" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0">Supply History</h5>
                        </div>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-35px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                                <div>
                                    <Calendar v-model="calendarRange" selectionMode="range" :manualInput="false"
                                        placeholder="Select Date Range" @change="filterByDate" showIcon></Calendar>
                                </div>
                                <div>
                                    <!-- <label for="state">Status</label> -->
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value"
                                        placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter
                                    " label="Filter" outlined
                                        :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                        @click="openFilter()" />
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()"
                                        :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }" />
                                </div>
                            </div>

                            <div class="flex gap-2">
                                <Button type="button" label="Export" icon="pi pi-file-export"
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                    @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="sourcingDate" header="Sourcing Date" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.fulfillment_date || '-' }}

                        </template>
                    </Column>
                    <Column field="foNo." header="FO No" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.foNo
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="items" header="Items" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.order_line_items?.length || '-' }}

                        </template>
                    </Column>
                    <Column field="quantity" header="Quantity" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.quantity || '-' }}

                        </template>
                    </Column>
                    <Column field="price" header="Price" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.price || '-' }}

                        </template>
                    </Column>
                    <Column field="orderDate" header="Order Date" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.fulfillment_date || '-' }}

                        </template>
                    </Column>
                    
                    <Column field="total" header="Total" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.totalOrderAmount || '-' }}

                        </template>
                    </Column>
                    <Column field="sourcingType" header="Date Received" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.dateReceived || '-' }}

                        </template>
                    </Column>
                    <Column field="status" header="Status" headerStyle="width:14%; min-width:7rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.status)">{{ slotProps.data.status }}</Tag>
                        </template>
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

            <!-- Crops  -->
            <div class="card" v-if="activeTab === 'crops'">
                <DataTable ref="dt" :value="cropsList" v-model:selection="selectedOrders" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0">Crops</h5>
                        </div>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-20px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                   </div>
                        </div>
                    </template>
                    <Column field="name" header="Name" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.name
                                || '-' }}

                        </template>
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

            <!-- Planted -->
            <div class="card" v-if="activeTab === 'planted'">
                <DataTable ref="dt" :value="plantedCropsList" v-model:selection="selectedOrders" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0">Farmers</h5>
                        </div>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-35px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                                <div>
                                    <Calendar v-model="calendarRange" selectionMode="range" :manualInput="false"
                                        placeholder="Select Date Range" @change="filterByDate" showIcon></Calendar>
                                </div>
                                <div>
                                    <!-- <label for="state">Status</label> -->
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value"
                                        placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter
                                    " label="Filter" outlined
                                        :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                        @click="openFilter()" />
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()"
                                        :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }" />
                                </div>
                            </div>

                            <div class="flex gap-2">
                                <Button type="button" label="Export" icon="pi pi-file-export"
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                    @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span :style="{ 'color': '#747C50' }">{{ slotProps.data?.name
                                || '-' }}</span>

                        </template>
                    </Column>
                    <Column field="noAcresPlanted" header="No.Acres Planted" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.noAcresPlanted
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="plantingDate" header="Planting Date" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.plantingDate
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="expectedHarvestedDate" header="Expected Harvested Date" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.expectedHarvestedDate
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="expectedHarvestedDate" header="Expected Yield(KG)" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.expectedHarvestedDate
                                || '-' }}

                        </template>
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

            <!-- Harvested -->
            <div class="card" v-if="activeTab === 'harvested'">
                <DataTable ref="dt" :value="plantedCropsList" v-model:selection="selectedOrders" dataKey="id"
                    :paginator="true" :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0">Harvested</h5>
                        </div>
                        <div class="flex justify-content-between gap-6 mt-2" :style="{ 'margin-left': '-35px' }">
                            <div class="flex gap-2">
                                <div>
                                    <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                        <InputIcon class="pi pi-search" />
                                        <InputText class="w-full sm:w-auto" v-model="filters['global'].value"
                                            placeholder="Search..." />
                                    </IconField>
                                </div>
                                <div>
                                    <Calendar v-model="calendarRange" selectionMode="range" :manualInput="false"
                                        placeholder="Select Date Range" @change="filterByDate" showIcon></Calendar>
                                </div>
                                <div>
                                    <!-- <label for="state">Status</label> -->
                                    <Dropdown id="state" v-model="status" :options="statuses" optionLabel="value"
                                        placeholder="Select Status" @change="filterByStatus"></Dropdown>
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter
                                    " label="Filter" outlined
                                        :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                        @click="openFilter()" />
                                </div>
                                <div>
                                    <Button type="button" icon="pi pi-filter-slash" outlined @click="clearFilter()"
                                        :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }" />
                                </div>
                            </div>

                            <div class="flex gap-2">
                                <Button type="button" label="Export" icon="pi pi-file-export"
                                    :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', 'color': '#122C20' }"
                                    @click="exportCSV($event)"></Button>
                            </div>
                        </div>
                    </template>
                    <Column field="name" header="Name" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            <span :style="{ 'color': '#747C50' }">{{ slotProps.data?.name
                                || '-' }}</span>

                        </template>
                    </Column>
                    <Column field="harvestDate" header="Harvest Date" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.harvestDate
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="yield" header="Yield" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.yield
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="sold" header="Sold" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.sold
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="wasted" header="Wasted" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.wasted
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="inStock" header="In Stock" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.inStock
                                || '-' }}

                        </template>
                    </Column>
                 
                    <Column field="cleaning" header="Cleaning" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.cleaning
                                || '-' }}

                        </template>
                    </Column>
                    <Column field="storage" header="Storage" headerStyle="width:14%; min-width:13rem;">
                        <template #body="slotProps">
                            {{ slotProps.data?.noAcresPlanted
                                || '-' }}

                        </template>
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

        </div>

        <div class="col-12 md:col-4">

        
            <div class="card p-fluid" :style="{}">
                <h5>Farmer Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Name</div>
                        <div>{{ supplierName ? supplierName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Gender</div>
                        <div>{{ supplierName ? supplierName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">D.O.B</div>
                        <div>{{ supplierName ? supplierName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Email</div>
                        <div>{{ supplierName ? supplierName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Phone</div>
                        <div>{{ supplierName ? supplierName : '-' }}</div>
                    </div>
                    
    
                </div>
    
    
                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Farms Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Ownership</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">No.of Acres</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Farming Type</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Irrigation</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Cooperative/Farmer Group</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Supply Hub</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Usual Buyer</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Food Loss Destination</div>
                        <div>{{ firstName ? firstName : '-' }}</div>
                    </div>
                </div>

                <div :style="{ 'border-top': '2px solid #F6F6F6', 'margin-top': '20px' }"></div>
                <h5>Billing Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Mpesa No.</div>
                        <div>{{ mpesaNumber ? mpesaNumber : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">Payment Preference</div>
                        <div>{{ selectedPaymentReference ? selectedPaymentReference : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#F6F6F6' }">KRA Pin</div>
                        <div>{{ kraPin ? kraPin : '-' }}</div>
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

.custom-tabmenu-wrapper {
    background: transparent;
    padding: 0;
    margin: 0;
}

/* Remove border from the .p-tabmenu-nav element */
.custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav {
    border: none !important;
    /* Remove border */
    box-shadow: none !important;
    /* Remove any shadow that might look like a border */
    background-color: transparent !important;
}

/* Ensure the tab menu items have a transparent background */
.custom-tabmenu-wrapper ::v-deep .p-menuitem-link {
    background-color: transparent !important;
    /* Make background transparent */
    color: inherit;
    /* Inherit text color from parent */
    position: relative;
    /* Ensure position for the underline effect */
    text-decoration: none;
    /* Remove default underline if present */
}

/* Ensure only the active tab has the orange underline */
.custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight>.p-menuitem-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    /* Adjust height as needed */
    background-color: orange;
    /* Orange underline */
}

/* Remove any additional pseudo-element used as underline */
.custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav::after {
    display: none;
    /* Hide any additional pseudo-element used as underline */
}
</style>
