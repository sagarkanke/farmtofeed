<template>
    <form @submit.prevent="handleSubmit">
      <!-- TabMenu Component from PrimeVue -->
      <div v-if="selectedGrade" class="mt-2">
        <div class="custom-tabmenu-wrapper">
          <TabMenu
            :model="nestedRouteItems"
            :activeIndex="activeIndex"
            @tab-change="handleTabChange"
          />
        </div>
      </div>
  
      <!-- Dynamic Inputs for the Active Tab -->
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
  
      <button type="submit" class="mt-3">Submit</button>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { TabMenu } from 'primevue/tabmenu'; // Ensure PrimeVue is correctly set up in your project
  import Textarea from 'primevue/textarea'; // Ensure the Textarea component is imported from PrimeVue
  
  // Simulate fetching dynamic tabs from an API
  async function fetchDynamicTabsFromAPI() {
    return {
      tabList1: [{ field1: '', field2: '' }], // Example initial values for tabs
      tabList2: [{ field1: '', field2: '' }],
    };
  }
  
  // Reactive object for form values based on API data
  const formValues = reactive({});
  const activeIndex = ref(0);
  const nestedRouteItems = ref([]);
  const selectedGrade = true; // Mocked value; update as necessary
  const activeTabKey = ref('');
  
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
  
  // Handle tab change event from TabMenu
  const handleTabChange = (event) => {
    activeIndex.value = event.index;
    activeTabKey.value = nestedRouteItems.value[activeIndex.value].key;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    console.log('Form Values:', formValues);
    alert(JSON.stringify(formValues, null, 2));
  };
  </script>
  
  <style scoped>
  /* Optional styles for better visual separation */
  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  button {
    margin-right: 10px;
  }
  
  input, textarea {
    margin: 5px 0;
    padding: 5px;
  }
  </style>
  