<template>
    <!-- PrimeVue TabMenu Component -->
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
    <div  class="mt-3" v-if="formValues[activeTabKey]">
      <h5 :style="{ color: '#808080', 'font-size': 'medium', 'margin-left': '-10px' }">
        Product Description
      </h5>
      <div :style="{ 'margin-left': '-22px' }">
        <div class="form-row flex flex-wrap gap-2 ml-3 mt-1">
          <div class="field flex-1 flex flex-column" >
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
          <div class="field flex-1 flex flex-column" >
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
  
    <!-- Button to Submit Values -->
    <button @click="handleSubmit" class="mt-3">Submit</button>
  </template>
  
  <script setup>
  import { ref, watch, computed  } from 'vue';
  
  // Props
  const props = defineProps({
    formValues: {
      type: Object,
      required: true,
    },
  });
  
  // Reactive state for internal component logic
  const activeIndex = ref(0);
  const nestedRouteItems = ref([]);
  const selectedGrade = true; // Mocked value; update as necessary
  const activeTabKey = ref('');
  
 
  
  // Computed property to access the current tab's values
  const currentTabValues = computed(() => {
    return props.formValues[activeTabKey.value] || [];
  });
  
  // Handle tab change event from TabMenu
  const handleTabChange = (event) => {
    activeIndex.value = event.index;
    activeTabKey.value = nestedRouteItems.value[activeIndex.value].key;
  };
  
  // Handle submission by logging or processing form values
  const handleSubmit = () => {
    console.log('Form Values:', props.formValues);
    alert(JSON.stringify(props.formValues, null, 2));
  };
  console.log("formValues",props.formValues)
  watch(
  () => props.formValues,
  (newValues) => {
    const keys = Object.keys(newValues);
    console.log("keys", keys)
    nestedRouteItems.value = keys.map((key, index) => ({
      label: `${key}`,
      key: key,
    }));

    // Set the initial active tab key if it's not already set
    if (!activeTabKey.value) {
      activeTabKey.value = keys[0] || '';
    }
  },
  { immediate: true, deep: true }
);
  </script>
  
  <style scoped>
  /* Updated deep selector syntax */
  :deep(.custom-tabmenu-wrapper) {
    /* Your styles */
  }
  
  :deep(.form-row) {
    /* Additional scoped styles if needed */
  }
  </style>
  