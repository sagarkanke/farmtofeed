<script setup>
import { ref, onMounted, reactive , onBeforeMount, computed, watch } from 'vue';

import MultiSelect from 'primevue/multiselect';
import axios from 'axios';

import { FilterMatchMode } from 'primevue/api';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { CompanyService } from '@/service/CompanyService';
import InputNumber from 'primevue/inputnumber';
import { PhotoService } from '@/service/PhotoService';
const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);
const center = ref({
    lat: 40.7128,  // Example latitude
    lng: -74.0060  // Example longitude
})
const productService = new ProductService();
const addUnitVariantFlag = ref(false);
const businessCategories = ref([
    { name: 'school', label: 'School/Feeding Program' },
    { name: 'hotel', label: 'Hotel/Restautant' },
    { name: 'caterer', label: 'Caterer' },
    { name: 'foodProcessor', label: 'Food Processor' },
    { name: 'retail', label: 'Retail' },
    { name: 'ftff', label: 'FTFF' },
    { name: 'ftf', label: 'Farm To Feed' },
    { name: 'other', label: 'Other' }
]);
const toast = useToast();
const sizes = ref([
    { label: 'small', name: 'Small' },
    { label: 'medium', name: 'Medium' },
    { label: 'large', name: 'Large' },

]);
const ripeness = ref([
    { label: 'semi_ripe', name: 'Semi Ripe' },
    { label: 'ripe', name: 'Ripe' },
]);
const grades = ref([
    { id: 1, label: 'Grade 1' },
    { id: 2, label: 'Grade Rescue' },])
const categories = ref([
    { id: 1, label: 'Fruits' },
    { id: 2, label: 'Vegetables' },
    { id: 3, label: 'Herbs' },
    { id: 4, label: 'Leafy Greens' },
    { id: 5, label: 'Fruits' },
    { id: 6, label: 'Roots or Tubers' },
    { id: 7, label: 'Eggs' },
]);
const units = ref([
    { id: 1, label: 'KG' },

    { id: 2, label: 'Bunch' },
    { id: 3, label: 'Piece' },
    { id: 4, label: 'Punnet' }
]);
const productId = ref(null);
const filters = ref({});
const dropdownItem = ref(null);
const selectedCustomer = ref(null);
const today = new Date();
const companyService = new CompanyService();
const calenderValue = ref(today);

const productDialog = ref(false);
const deliveryAddrDialog = ref(false);
const products = ref(null);
const product = ref({});
const submitted = ref(false);
const selectedProducts = ref(null);

const radioValue = ref(null);
const addNewUserDialog = ref(false);
const selectedBusinessName = ref(null);
const selectedBusinessCategory = ref(null);
const selectedEmail = ref(null);
const selectedPhone = ref(null);
const selectedOwner = ref(null);
const selectedPersonName = ref(null);
const selectedLastName = ref(null);
const contactPersonEmail = ref(null);
const contactPersonPhone = ref(null);
const designation = ref(null);
const billingAddress = ref(null);
const billingPostalCode = ref(null);
const billingCity = ref(null);
const kraPin = ref(null);
const customerProfile = ref(null);
const selectedProductName = ref(null);
const selectedGrade = ref(null);
const fileInput = ref(null);
const images = ref([]);
const selectedSizeAutoValue = ref(null);
const autoFilteredSizeValue = ref([]);
const selectedRipenessAutoValue = ref(null);
const autoFilteredRipenessValue = ref([]);
const selectedUnitForAdd = ref();
const minimumOrderQuantity = ref();



const nestedRouteItems = ref([

]);
const processing = ref([
    { name: 'none', label: 'None' },
    { name: 'whole', label: 'Whole' },
    { name: 'peeled', label: 'Peeled' },
    { name: 'diced', label: 'Diced' },
]);
const processedImages = ref([]);
const selectUnit = ref(null);
const selectedCategory = ref(null);

const activeTab = ref(null);
const inputStock = ref(0);
const shelfDays = ref(0);
const reOrderLevel = ref(0);
const reOrderValue = ref(0);
const addUnitVariant = ref(false);
const weightPerUnit = ref(0);
const buyingPrice = ref(0);
const sellingPrice = ref(0);
const selectedProcessing = ref();
const processSellingPrice = ref(0);
const unitVariantsList = ref([]);
const expandedRows = ref([]);
const galleryImages = ref([]);

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
const ecommerceDescription = ref();
const farmerAppDescription = ref();
onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    // photoService.getImages().then((data) => (galleryImages.value = data));

    //  productService.getProducts().then((data) => (products.value = data));
});

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

const addNewUser = () => {
    product.value = [];
    submitted.value = false;
    addNewUserDialog.value = true;
};

const addLineItem = () => {
    console.log('selectedProducts ', selectedProducts);
    productDialog.value = false;
};

const addDeliveryAddress = () => {
    console.log(" addDeliveryAddress called ")
    // product.value = [];
    // submitted.value = false;
    deliveryAddrDialog.value = true;
}
const exportCSV = () => {
    dt.value.exportCSV();
};

const saveProduct = async () => {
    try {

        console.log("selectedSizeAutoValueDisplay ", selectedSizeAutoValue.value);
        const selectedSizes = selectedSizeAutoValue.value.map((key) => {
            return key.label
                ;
        });
        const selectedRipeness = selectedRipenessAutoValue.value.map((key) => {
            return key.label
                ;
        });


        const payload = {
            "name": selectedProductName.value,
            "unit_id": selectUnit.value.id,
            "category_id": selectedCategory.value.id,
            "sizes": selectedSizes,
            "ripeness": selectedRipeness,
            "express_delivery_option": false,
        }
        console.log("Pyaload ", payload);
        const data = await productService.createNewProduct(payload);
        console.log("data ", data);
        if (data) {
            productId.value = data.data.id;
            addUnitVariantFlag.value = true;
            toast.add({ severity: 'success', summary: 'Success', detail: 'Product created successfully!', life: 3000 });
            // Reset form fields
            // resetFormFields();
        }



    } catch (e) {
        console.log("Error ", e);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product.', life: 3000 });

    }
}

// const saveProductVariation = async () => {
//     try {
//         const formData = new FormData();
//         const grades = selectedGrade.value.map((grade)=>{
//             return grade.id
//         });
//         const images = processedImages.value.map((img)=>{
//             return {
//                 image:img.alt,
//                 size: img.size,
//                 type:img.type
//             }
//         })

//         const payload = {
//             "product_id":  13 ,// productId.value,
//             "unit_id": selectedUnitForAdd.value.id,
//             "grade_id": 1,
//             "selling_price": sellingPrice.value,
//             "buying_price": buyingPrice.value,
//             "auto_sku": true,
//             "status": radioValue.value,
//             "minimum_order_quantity": minimumOrderQuantity.value,
//             "weight_per_unit": weightPerUnit.value,
//             "is_standard_weight": false,
//             "short_description": ecommerceDescription.value,
//             "description": farmerAppDescription.value,
//             "average_shelf_life": shelfDays.value,
//             "reorder_level": reOrderLevel.value,
//             "reorder_volume": reOrderValue.value,
//             "product_images": images

//         }
//         console.log("Payload ", payload)
//         const results = await Promise.all(
//             grades.map(variantGrade => 
//                 productService.createProductVariant({ ...payload, grade_id: variantGrade })
//             )
//         );
//         // const data = await productService.createProductVariant(payload);
//         console.log("data ", results);
//         if (results) {

//             toast.add({ severity: 'success', summary: 'Success', detail: 'Product variation created successfully!', life: 3000 });
//             // Reset form fields
//             // resetFormFields();
//         }



//     } catch (e) {
//         console.log("Error ", e);
//         toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product variation.', life: 3000 });

//     }
// }



// const handleTabChange = () => {

//     console.log("Selected Grade ID:", selectedGrade.value, selectedProductName.value);
//     const selectedGradeObject = grades.value.find(item => item.id === selectedGrade.value.id);
//     activeTab.value = selectedGradeObject?.label ?? activeTab.value;
//     console.log("Active Tab Label:", activeTab.value);
//     nestedRouteItems.value.push(activeTab.value);

// };

const handleTabChange = () => {
    console.log("Selected Grades:", selectedGrade.value, selectedProductName.value);

    nestedRouteItems.value = [];
    let counter = 1;
    selectedGrade.value.forEach(grade => {
        const selectedGradeObject = grades.value.find(item => item.id === grade.id);

        if (selectedGradeObject) {
            const label = selectedGradeObject.label;

            activeTab.value = label;

            if (!nestedRouteItems.value.includes(label)) {
                nestedRouteItems.value.push({
                    'id': counter++,
                    'label': label
                }
                );
            }
        }
    });

    console.log("Active Tab Label:", activeTab.value);
    console.log("Updated Nested Route Items:", nestedRouteItems.value);
};

const apiClient = axios.create({
    baseURL: 'https://api-v2-dev.farm2feed.com/api', // Base URL for your API
    headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer 40|MNwXstxvGtoYyHX6BgB45Cq2gcqT2BgoULN6S7YQdd4e3b63', // Replace with your access token
    },
});
const saveProductVariation = async () => {
    try {
        const formData = new FormData();

        // Append all fields with correct types
        const fields = {
            product_grade_variant_id: 1,
            product_id: 13,
            unit_id: selectedUnitForAdd.value.id,
            selling_price: sellingPrice.value,
            buying_price: buyingPrice.value,
            status: radioValue.value,
            minimum_order_quantity: minimumOrderQuantity.value,
            weight_per_unit: weightPerUnit.value,
            auto_sku: 1, // Boolean as 1 for true
            is_standard_weight: 1, // Boolean as 1 for true
            short_description: ecommerceDescription.value,
            description: farmerAppDescription.value,
            average_shelf_life: shelfDays.value,
            reorder_level: reOrderLevel.value,
            reorder_volume: reOrderValue.value,
            grade_id: 1
        };

        // Append fields to formData
        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Handle images
        processedImages.value.forEach((img, index) => {
            const isBase64 = img.itemImageSrc.startsWith('data:');
            const fileName = img.alt;

            if (isBase64) {
                const base64Data = img.itemImageSrc.split(',')[1];
                const blob = base64ToBlob(base64Data, img.type);
                formData.append(`product_images[${index}]`, blob, fileName);
            } else {
                // Assuming img.itemImageSrc is a file path or URL
                formData.append(`product_images[${index}]`, img.itemImageSrc, fileName);
            }
        });

        // Sending the request
        const data = await productService.createProductVariant(formData);
        if(data){
            toast.add({ severity: 'success', summary: 'Success', detail: 'Product variation created successfully!', life: 3000 });
            addVariants();
            addUnitVariant.value = false;
            

        }
 

    

    } catch (error) {
        // Handle errors
        console.error("Error ", error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product variation.', life: 3000 });
    }
};


function base64ToBlob(base64, mime) {
    // Decode the base64 string into binary data
    const byteChars = atob(base64);

    // Create an array to hold the binary data
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i); // Convert each character to its byte code
    }

    // Create a typed array (Uint8Array) from the binary data
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from the typed array and specify the MIME type
    return new Blob([byteArray], { type: mime });
}


const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const handleFileChange = (type, event) => {
    if (event && event.target && event.target.files) {
        const files = event.target.files;
        let counter = 1;
        for (let i = 0; i < files.length; i++) {

            const file = files[i];

            const reader = new FileReader();

            reader.onload = (e) => {
                const imageData = {
                    id: counter++,
                    itemImageSrc: e.target.result,
                    thumbnailImageSrc: e.target.result, // You can use the same image for thumbnail or generate a smaller version
                    alt: file.name,
                    title: file.name,
                    size: file.size,
                    type: file.type
                };

                galleryImages.value.push(imageData); // Push to the galleryImages array

                if (type === 'images') {
                    images.value.push(imageData);
                } else if (type === 'processedImages') {
                    processedImages.value.push(imageData);
                }

                // Log the updated state after the file is processed
                console.log(`${type} `, type === 'images' ? images.value : processedImages.value);
            };

            reader.readAsDataURL(file);
        }
    }
};



const formatSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / 1048576).toFixed(2)} MB`;
};

// const handleDelete = (id, type) => {

//     if (type === 'images') {
//         images.value.splice(id, 1);
//     } else if (type === 'processedImages') {
//         processedImages.value.splice(id, 1);
//     } else if (type === 'unitVariantList') {
//         unitVariantsList.value.splice(id, 1);
//         unitVariantsList.value.forEach(variant => {
//             if (variant.processedImages) {
//                 variant.processedImages = variant.processedImages.filter(img => img.id !== id);
//             }
//         });
//     };

//     console.log("Gallery Images ", galleryImages)
// }
const handleDelete = (index, type) => {
    let imageToDelete;

    if (type === 'images') {
        // Retrieve the image object that needs to be deleted
        imageToDelete = images.value[index];
        images.value.splice(index, 1);
    } else if (type === 'processedImages') {
        imageToDelete = processedImages.value[index];
        processedImages.value.splice(index, 1);
    } else if (type === 'unitVariantList') {
        imageToDelete = unitVariantsList.value[index];
        unitVariantsList.value.splice(index, 1);
        unitVariantsList.value.forEach(variant => {
            if (variant.processedImages) {
                variant.processedImages = variant.processedImages.filter(img => img !== imageToDelete);
            }
        });
    }

    // Remove the image from galleryImages if it exists
    const galleryIndex = galleryImages.value.findIndex(image =>
        image.itemImageSrc === imageToDelete.itemImageSrc &&
        image.alt === imageToDelete.alt &&
        image.title === imageToDelete.title
    );

    galleryImages.value.splice(galleryIndex, 1);

    // No need to log if the image is not found
    console.log("Updated Gallery Images", galleryImages.value);
}

const searchSize = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredSizeValue.value = [...sizes.value];
        } else {
            autoFilteredSizeValue.value = sizes.value.filter((size) => {
                return size.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};
const selectedSizeAutoValueDisplay = computed(() => {
    return selectedSizeAutoValue.value && selectedSizeAutoValue.value.length > 0
        ? selectedSizeAutoValue.value.map(item => item.name).join(', ')
        : '';
});


const searchRipeness = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
            autoFilteredRipenessValue.value = [...ripeness.value];
        } else {
            autoFilteredRipenessValue.value = ripeness.value.filter((ripeness) => {
                return ripeness.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }
    }, 250);
};

const selectedRipenessAutoValueDisplay = computed(() => {
    return selectedRipenessAutoValue.value && selectedRipenessAutoValue.value.length > 0
        ? selectedRipenessAutoValue.value.map(item => item.name).join(', ')
        : '';
});


const addUnitVariantModal = () => {
    addUnitVariant.value = true;
}

const addVariants = () => {

    const expansionData = processedImages.value.map((img) => {

        // Return the mapped object
        return {
            id: img.id,
            image: img.itemImageSrc,
            processing: selectedProcessing.value.value,
            sellingPrice: sellingPrice.value,
        };
    });

    unitVariantsList.value.push({
        "unit": selectedUnitForAdd.value.value,
        "minimumOrderQuantity": minimumOrderQuantity.value,
        "weightPerUnit": weightPerUnit.value,
        "buyingPrice": buyingPrice.value,
        "sellingPrice": sellingPrice.value,
        "processing": selectedProcessing.value,
        "processingSellingPrice": processSellingPrice.value.value,
        "processedImages": expansionData
    });
    // console.log("Unit variants ", unitVariantsList.value);
    addUnitVariant.value = false;

}

const expandAll = () => {
    expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
};
const collapseAll = () => {
    expandedRows.value = null;
};

const hideDialog = () => {
    addUnitVariant.value = false;
}

// Simulate fetching dynamic tabs from an API
async function fetchDynamicTabsFromAPI() {
  return {
    tabList1: [{ field1: '', field2: '' }], // Example initial values for tabs
    tabList2: [{ field1: '', field2: '' }],
  };
}
// Fetch dynamic tabs and setup form values
onMounted(async () => {
  try {
    const dynamicTabs = await fetchDynamicTabsFromAPI();
    Object.assign(formValues, dynamicTabs);

    // Initialize nestedRouteItems based on dynamicTabs keys
    nestedRouteItems.value = Object.keys(dynamicTabs).map((key, index) => ({
      label: `Tab List ${index + 1}`,
      key: key,
    }));

    // Set the initial active tab key
    activeTabKey.value = nestedRouteItems.value[0]?.key || '';
  } catch (error) {
    console.error('Error fetching dynamic tabs:', error);
  }
});
const formValues = reactive({});
const activeIndex = ref(0);
const activeTabKey = ref('');
</script>

<template>
    <div class="flex justify-content-between">
        <h5 :style="{ 'font-size': 'large', 'font-weight': 'bold', 'margin-left': '-2rem' }">New Product</h5>
        <div class="flex gap-2 mb-3" :style="{ 'margin-left': '30px' }">
            <Button type="button" label="Delete Product" icon="pi pi-trash" @click="createNewCompany()"
                :style="{ 'background-color': '#FCE8E8', border: '#FCE8E8', 'color': '#C80000', 'border-radius': '8px' }"></Button>
            <Button type="button" label="Save Product" icon="pi pi-save" @click="saveProduct()"
                :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"></Button>
        </div>

    </div>

    <div class="grid" :style="{ 'margin-left': '-3rem' }">
        <div class="col-12 md:col-8">
            <div class="card">
                <h5 :style="{ color: '#808080', 'font-size': 'medium', 'margin-left': '-10px' }">Primary Details</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Product
                                Name</label>
                            <InputText id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="selectedProductName" aria-describedby="username-help" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Grade(s)
                                Category</label>
                            <MultiSelect id="paymentType" :style="{ borderRadius: '8px' }" v-model="selectedGrade"
                                display="chip" filter @Change="handleTabChange" :options="grades" optionLabel="label"
                                placeholder="Select" />
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Default
                                Unit</label>
                            <Dropdown id="paymentType" :style="{ borderRadius: '8px' }" v-model="selectUnit"
                                :options="units" optionLabel="label" placeholder="Select" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Category
                            </label>
                            <div class="field flex-1 flex flex-column">

                                <Dropdown id="paymentType" :style="{ borderRadius: '8px' }" v-model="selectedCategory"
                                    :options="categories" optionLabel="label" placeholder="Select" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card p-fluid" :style="{}">
                <h5>Specifications</h5>
                <div class="flex justify-content-between gap-3">
                    <div class="flex-1">
                        <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Size
                        </label>
                        <AutoComplete id="dd" :dropdown="true" :multiple="true" v-model="selectedSizeAutoValue"
                            :suggestions="autoFilteredSizeValue" @complete="searchSize($event)" field="name" />

                    </div>
                    <div class="flex-1">
                        <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Ripeness
                        </label>
                        <AutoComplete :dropdown="true" :multiple="true" v-model="selectedRipenessAutoValue"
                            :suggestions="autoFilteredRipenessValue" @complete="searchRipeness($event)" field="name" />

                    </div>

                </div>
            </div>


            <div v-if="selectedGrade" class="mt-2">
                <div class="custom-tabmenu-wrapper">
                    <TabMenu :model="nestedRouteItems"
                        :activeIndex="nestedRouteItems.findIndex(item => item.label === activeTab)"
                        @tab-change="handleTabChange" />
                </div>
            </div>
          
            <div class="card p-fluid mt-3" :style="{}">
                <h5>Product Status</h5>
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option1" name="option" value="active" v-model="radioValue" />
                            <label for="option1">Active</label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4" :style="{ 'margin-left': '-45px' }">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option2" name="option" value="inactive" v-model="radioValue" />
                            <label for="option2">Back In Stock</label>
                        </div>
                    </div>
                    <div class="col-12 md:col-4" :style="{ 'margin-left': '-45px' }">
                        <div class="field-radiobutton mb-0">
                            <RadioButton id="option2" name="option" value="inactive" v-model="radioValue" />
                            <label for="option2">Inactive</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card ">
                <h5 :style="{ color: '#808080', 'font-size': 'medium', 'margin-left': '-10px' }">Product Description
                </h5>
                <div v-if="activeTabKey" class="mt-3">
      <h5 :style="{ color: '#808080', 'font-size': 'medium', 'margin-left': '-10px' }">
        Product Description
      </h5>
      <div :style="{ 'margin-left': '-22px' }">
        <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
          <div class="field flex-1 flex flex-column">
            <label for="ecommerceDescription" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
              Ecommerce Description
            </label>
            <Textarea
              id="ecommerceDescription"
              v-model="formValues[activeTabKey][0].field1"
              rows="4"
              placeholder="Product Description..."
              :style="{ width: '100%' }"
            ></Textarea>
          </div>
          <div class="field flex-1 flex flex-column">
            <label for="farmerAppDescription" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
              Farmer App Description
            </label>
            <Textarea
              id="farmerAppDescription"
              v-model="formValues[activeTabKey][0].field2"
              rows="4"
              placeholder="Product Description..."
              :style="{ width: '100%' }"
            ></Textarea>
          </div>
        </div>
        <div class="flex justify-content-between ml-3">
          <div class="text-sm text-color-secondary ml-1" :style="{ 'margin-top': '-2%' }">
            <span> Max 144 Characters</span>
          </div>
          <div class="text-sm text-color-secondary" :style="{ 'margin-top': '-2%', 'margin-right': '14rem' }">
            <span> Max 144 Characters</span>
          </div>
        </div>
      </div>
    </div>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Ecommerce
                                Description</label>
                            <Textarea id="orderNotes" v-model="ecommerceDescription" rows="4"
                                placeholder="Product Description..." :style="{ width: '100%' }"></Textarea>
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Farmer App
                                Description
                            </label>
                            <Textarea id="orderNotes" v-model="farmerAppDescription" rows="4"
                                placeholder="Product Description..." :style="{ width: '100%' }"></Textarea>
                        </div>

                    </div>
                    <div class="flex justify-content-between  ml-3">
                        <div class="text-sm text-color-secondary ml-1" :style="{ 'margin-top': '-2%' }">
                            <span> Max 144 Characters</span>
                        </div>
                        <div class=" text-sm text-color-secondary"
                            :style="{ 'margin-top': '-2%', 'margin-right': '14rem' }">
                            <span> Max 144 Characters</span>
                        </div>
                    </div>


                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3 mt-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
                                Product Image (Max 2mb)
                            </label>
                            <div class="card mt-2 h-8rem flex justify-content-center align-items-center"
                                :style="{ 'background-color': '#F6F6F6', 'cursor': 'pointer' }"
                                @click="triggerFileInput">
                                <input type="file" ref="fileInput" multiple @change="handleFileChange('images', $event)"
                                    accept="image/*" style="display: none;" />
                                <div class="flex flex-column align-items-center justify-content-center text-center"
                                    :style="{ 'cursor': 'pointer' }">
                                    <i class="pi pi-plus-circle"
                                        :style="{ 'font-size': '1rem', 'color': '#999', 'cursor': 'pointer' }"></i>
                                    <p :style="{ 'color': '#999', 'font-size': '1rem', 'cursor': 'pointer' }"
                                        class="mt-2">
                                        Add Image
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="images" class="flex gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <div v-for="(image, index) in images" :key="index" class="card h-8rem flex mb-3">
                                <Image :src="image.itemImageSrc" alt="Image" width="110" height="90" preview
                                    :style="{ 'margin-top': '-1rem', 'margin-left': '-1rem' }" />
                                <p
                                    :style="{ 'font-size': '1rem', 'color': '#333', 'text-align': 'center', 'margin-top': '5px', 'margin-left': '8px' }">
                                    {{ image.alt }} <br>
                                    {{ formatSize(image.size) }}
                                </p>
                                <Button icon="pi pi-trash" class="p-button-text p-button-plain flex-end"
                                    @click="handleDelete(index, 'images')"
                                    :style="{ 'color': 'red', 'margin-left': 'auto' }" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div class="card">
                <h5 :style="{ color: '#808080', 'font-size': 'medium', 'margin-left': '-10px' }">Stock</h5>
                <div :style="{ 'margin-left': '-22px' }">
                    <!-- First Row -->
                    <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <label for="customer" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Initial
                                Stock</label>
                            <InputNumber id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="inputStock" aria-describedby="username-help" />
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="paymentType" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Shelf Life
                                (Days)
                                Category</label>
                            <InputNumber id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="shelfDays" aria-describedby="username-help" />
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="flex gap-2 ml-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Re-Order
                                Level (Optional)</label>
                            <InputNumber id="username2" :style="{ borderRadius: '8px' }" type="username" class="p-error"
                                v-model="reOrderLevel" aria-describedby="username-help" />
                            <!-- <Dropdown id="deliveryLocation" v-model="selectedDeliveryLocation" :options="deliveryLocations" placeholder="Select Delivery Location" /> -->
                        </div>
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod"
                                :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Re-Order Volume
                                (Optional)
                            </label>
                            <div class="field flex-1 flex flex-column">

                                <InputNumber id="username2" :style="{ borderRadius: '8px' }" type="username"
                                    class="p-error" v-model="reOrderValue" aria-describedby="username-help" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <DataTable :value="unitVariantsList" v-model:expandedRows="expandedRows" dataKey="id" :paginator="true"
                    :rows="10"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    tableStyle="min-width: 60rem">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
                            :style="{ 'margin-top': '-20px', 'margin-left': '-15px' }">
                            <h5 class="m-0">Unit Variants</h5>
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
                                <Button type="button" label="Add Unit Variant" icon="pi pi-plus" :disabled="!addUnitVariantFlag"
                                    :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                                    @click="addUnitVariantModal()"></Button>
                            </div>
                        </div>
                    </template>
                    <Column :expander="true" headerStyle="width: 3rem" />
                    <Column field="unit" header="Unit">
                        <template #body="slotProps">
                            {{ slotProps.data.unit }}
                        </template>
                    </Column>

                    <Column field="wtPerUnit" header="Wt./Unit(KG)">
                        <template #body="slotProps">
                            {{ slotProps.data.weightPerUnit }}
                        </template>
                    </Column>
                    <Column field="standardWt" header="Standart Wt.">
                        <template #body="slotProps">
                            {{ slotProps.data.unit }}
                        </template>
                    </Column>
                    <Column field="minOrderQty" header="Min Order Qty">
                        <template #body="slotProps">
                            {{ slotProps.data.minimumOrderQuantity }}
                        </template>
                    </Column>
                    <Column field="buyingPrice" header="Buying Price">
                        <template #body="slotProps">
                            <span class="p-column-title">Buying Price</span>
                            <InputText class="w-6" v-model="slotProps.data.buyingPrice" />
                        </template>
                    </Column>
                    <Column field="sellingPrice" header="Selling Price">
                        <template #body="slotProps">
                            <span class="p-column-title">Selling Price</span>
                            <InputText class="w-6" v-model="slotProps.data.sellingPrice" />
                        </template>
                    </Column>
                    <Column headerStyle="width:4rem">
                        <template #body>
                            <Button icon="pi pi-trash" class="p-button-text p-button-plain"
                                @click="handleDelete(index, 'unitVariantsList')"
                                :style="{ 'color': 'red', 'margin-left': '28%' }" /> </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-3">
                            <DataTable :value="slotProps.data.processedImages" datakey="id">
                                <Column field="Image" header="Image" :headerStyle="{ color: '#808080' }">
                                    <template #body="slotProps">
                                        <Image :src="slotProps.data.image" alt="Image" width="110" preview
                                            :style="{ 'margin-left': '-1rem' }" />
                                    </template>
                                </Column>
                                <Column field="processing" header="Processing" :headerStyle="{ color: '#808080' }">
                                    <template #body="slotProps">
                                        <span class="p-column-title">Processing</span>
                                        <Dropdown class="w-8" id="processing" :style="{ borderRadius: '8px' }"
                                            v-model="slotProps.data.selectedProcessing" :options="processing"
                                            optionLabel="value" />
                                    </template>
                                </Column>
                                <Column field="sellingPrice" header="Selling Price" :headerStyle="{ color: '#808080' }">
                                    <template #body="slotProps">
                                        <span class="p-column-title">Selling Price</span>
                                        <InputText class="w-6" v-model="slotProps.data.sellingPrice" />
                                    </template>
                                </Column>
                                <Column headerStyle="width:4rem">
                                    <template #body="slotProps">
                                        <!-- Assuming slotProps.rowIndex is available -->
                                        <Button icon="pi pi-trash" class="p-button-text p-button-plain"
                                            @click="handleDelete(slotProps.data.id, 'unitVariantList')"
                                            :style="{ 'color': 'red', 'margin-left': '28%' }" />
                                    </template>
                                </Column>
                            </DataTable>

                        </div>
                    </template>
                </DataTable>

                <Dialog v-model:visible="addUnitVariant" :style="{ width: '450px' }" :modal="true" class="p-fluid">
                    <template #header>
                        <div class="p-d-flex p-ai-center">
                            <span class="pi pi-plus p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                            <!-- PrimeIcons class for the filter icon with custom color -->
                            <span class="p-ml-n6 ml-2" style="color: darkgreen; font-weight: 700; font-size: larger">Add
                                Unit Variant</span>
                            <!-- PrimeFlex classes for margin-left and bold text -->
                        </div>
                    </template>
                    <div class="flex justify-content-between gap-2">
                        <div class="flex-1">
                            <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Unit</label>
                            <Dropdown id="state" v-model="selectedUnitForAdd" :options="units" optionLabel="label"
                                placeholder="Select Unit"></Dropdown>
                        </div>
                        <div class="flex-1">
                            <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Minimum Order
                                Quantity</label>
                            <InputNumber id="price" v-model="minimumOrderQuantity" :required="true" />
                        </div>
                    </div>

                    <div class="field mt-3">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Weight Per
                            Unit(KG)</label>
                        <InputNumber id="price" v-model="weightPerUnit" :required="true" />

                    </div>
                    <div class="flex justify-content-between mt-3 gap-2">
                        <div>
                            <label for="orderDate" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Buying
                                Price</label>
                            <InputNumber id="price" v-model="buyingPrice" :required="true" />

                        </div>
                        <div>
                            <label for="orderDate" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Selling
                                Price</label>
                            <InputNumber id="price" v-model="sellingPrice" :required="true" />
                        </div>
                    </div>
                    <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>

                    <div class="field mt-3">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">Processing
                            (Optional)</label>
                        <Dropdown id="state" v-model="selectedProcessing" :options="processing" optionLabel="label"
                            placeholder="Select Processing"></Dropdown>

                    </div>

                    <div class="field mt-3">
                        <label for="name" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">(Processs)-Selling
                            Price</label>
                        <InputNumber id="price" v-model="processSellingPrice" :required="true" />
                    </div>
                    <div class="flex gap-2  mt-3">
                        <div class="field flex-1 flex flex-column">
                            <label for="deliveryMethod" :style="{ 'font-weight': 'bold', 'font-size': 'small' }">
                                Processed Image (Max 2mb)
                            </label>
                            <div class="card mt-2 h-8rem flex justify-content-center align-items-center"
                                :style="{ 'background-color': '#F6F6F6', 'cursor': 'pointer' }"
                                @click="triggerFileInput">
                                <input type="file" ref="fileInput" multiple
                                    @change="handleFileChange('processedImages', $event)" accept="image/*"
                                    style="display: none;" />
                                <div class="flex flex-column align-items-center justify-content-center text-center"
                                    :style="{ 'cursor': 'pointer' }">
                                    <i class="pi pi-plus-circle"
                                        :style="{ 'font-size': '1rem', 'color': '#999', 'cursor': 'pointer' }"></i>
                                    <p :style="{ 'color': '#999', 'font-size': '1rem', 'cursor': 'pointer' }"
                                        class="mt-2">
                                        Add Image
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="processedImages" class="flex gap-2 ml-3 mt-1">
                        <div class="field flex-1 flex flex-column">
                            <div v-for="(image, index) in processedImages" :key="index" class="card h-8rem flex mb-3">
                                <Image :src="image.itemImageSrc" alt="Image" width="110" preview
                                    :style="{ 'margin-top': '-1rem', 'margin-left': '-1rem' }" />
                                <p
                                    :style="{ 'font-size': '1rem', 'color': '#333', 'text-align': 'center', 'margin-top': '-15px', 'margin-left': '8px' }">
                                    {{ image.alt }} <br>
                                    {{ formatSize(image.size) }}
                                </p>
                                <Button icon="pi pi-trash" class="p-button-text p-button-plain"
                                    @click="handleDelete(index, 'processedImages')"
                                    :style="{ 'color': 'red', 'margin-left': '28%' }" />
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button type="button" label="Cancel" icon="pi pi-times"
                            :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9', color: '#122C20' }"
                            @click="hideDialog()"></Button>
                        <Button type="button" label="Add Variant" icon="pi pi-check"
                            :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                            @click="saveProductVariation()"></Button>
                    </template>
                </Dialog>
            </div>
        </div>


        <div class="col-12 md:col-4">
            <div class="card">
                <h5 :style="{ 'color': '#122C20' }">Product Details</h5>
                <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Name</div>
                        <div>{{ selectedProductName ? selectedProductName : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Grade</div>
                        <div>{{ selectedGrade ? selectedGrade.label : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Category</div>
                        <div>{{ selectedCategory ? selectedCategory.label : '-' }}</div>
                    </div>
                    <div class="flex justify-content-between">
                        <div :style="{ 'font-color': '#808080' }">Default Unit</div>
                        <div>{{ selectUnit ? selectUnit.label : '-' }}</div>
                    </div>
                </div>
                <div v-if="Array.isArray(selectedGrade) && selectedGrade.some(grade => grade.label === 'Grade 1')">
                    <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>

                    <h5 :style="{ 'color': '#122C20' }">Grade 1</h5>
                    <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Size</div>
                            <div>{{ selectedSizeAutoValueDisplay ? selectedSizeAutoValueDisplay : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Ripeness</div>
                            <div>{{ selectedRipenessAutoValueDisplay ? selectedRipenessAutoValueDisplay : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Shelf Life(Days)</div>
                            <div>{{ shelfDays ? shelfDays : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Units</div>
                            <div>{{ selectUnit ? selectUnit.label : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Processing</div>
                            <div>{{ selectedProcessing ? selectedProcessing.label : '-' }}</div>
                        </div>
                    </div>
                </div>
                <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '18px' }"></div>

                <div v-if="Array.isArray(selectedGrade) && selectedGrade.some(grade => grade.label === 'Grade Rescue')"
                    class="mt-4">
                    <h5 :style="{ 'color': '#122C20' }">Grade Rescue</h5>
                    <div :style="{ display: 'flex', 'flex-direction': 'column', gap: '16px' }">
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Size</div>
                            <div>{{ selectedSizeAutoValueDisplay ? selectedSizeAutoValueDisplay : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Ripeness</div>
                            <div>{{ selectedRipenessAutoValueDisplay ? selectedRipenessAutoValueDisplay : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Shelf Life(Days)</div>
                            <div>{{ shelfDays ? shelfDays : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Units</div>
                            <div>{{ selectUnit ? selectUnit.label : '-' }}</div>
                        </div>
                        <div class="flex justify-content-between">
                            <div :style="{ 'font-color': '#F6F6F6' }">Processing</div>
                            <div>{{ selectedProcessing ? selectedProcessing.label : '-' }}</div>
                        </div>
                    </div>
                    <div :style="{ 'border-top': '2px solid #E2E8F0', 'margin-top': '20px' }"></div>
                </div>

                <h5>Product Images</h5>
                <div>
                    <Galleria :value="galleryImages" :responsiveOptions="galleriaResponsiveOptions" :numVisible="7"
                        :circular="true" containerStyle="max-width: 400px; margin: auto">
                        <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                                style="width: 100%; display: block" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt"
                                :style="{ 'width': '100%', 'height': '80px', 'display': 'block' }" />
                        </template>
                    </Galleria>
                </div>
            </div>
        </div>




    </div>
</template>
<style scoped>
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

.custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav {
    border: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
}

/* Apply orange color and underline only to the active tab */
.custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight>.p-menuitem-link {
    color: orange !important;
    /* Change active tab font color to orange */
    background-color: transparent !important;
    /* Ensure background is transparent */
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
    color: orange;
}

/* Remove any additional pseudo-element used as underline */
.custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav::after {
    display: none;
    /* Hide any additional pseudo-element used as underline */
}
/* Updated deep selector syntax */


</style>
