<script setup>
import { LogisticsService } from '@/service/LogisticsService';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const filterDialog = ref(false);
const product = ref({});
const loading = ref(true);
const submitted = ref(false);
const statuses = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
]);
// const vechiclesOptions = ref([]);
const ownershipOptions = ref([
    { value: 1, label: 'Own' },
    { value: 2, label: 'Lease' },
    { value: 3, label: 'Truck owner' }
]);

const vechiclesOptions = ref([
  { value: 'boda_boda', label: 'Boda Boda' },
  { value: 'closed_box_truck', label: 'Close Box Truck' },
  { value: 'open_pickup_truck', label: 'Open Pickup Truck' },
  { value: 'closed_pickup_truck', label: 'Closed Pickup Truck' },
  { value: 'closed_van', label: 'Closed Van' }
]);

const dropdownKey = ref(Date.now());
const vehicleType = ref(null);
const ownership = ref(null);
const status = ref(null);

onMounted(async () => {
    // try {
    //     const response = await new LogisticsService().fetchAllVehiclesList();
    //     vechiclesOptions.value = response.map((optn) => ({
    //         name: optn.id,
    //         label: optn.registration_number
    //     }));
    // } catch (error) {
    //     console.error('Error fetching options:', error);
    // } finally {
    //     loading.value = false;
    // }
});

const fetchPodsData = async () => {
    const params = {};
    console.log( status.value , ownership.value , vehicleType.value )
    if (status.value && status.value.value) {
        params.status = status.value.value;
    }
    if (ownership.value && ownership.value.value) {
        params.ownership = ownership.value.value;
    }
    if (vehicleType.value && vehicleType.value.value) {
        params.vehicle_type = vehicleType.value.value;
    }

    await store.dispatch('mileage/fetchMileagesData', params);
};

const saveFilters = async () => {
    filterDialog.value = false;
    await fetchPodsData();
};

const  clearFilter = async () => {
    ownership.value = null;
    status.value = null;
    vehicleType.value = null;
    dropdownKey.value = Date.now(); // Reset key to force dropdowns to reset
    await store.dispatch('mileage/fetchMileagesData');

};

const handleDropdownChange = async (selectedValue, type) => {
    switch (type) {
        case 'status':
            status.value = selectedValue;
            break;
        case 'ownership':
            ownership.value = selectedValue;
            break;
        case 'vehicleType':
            vehicleType.value = selectedValue;
            break;
    }
    // await fetchPodsData();
};

const handleDropdownStatusChange = async (selectedValue, type) => {
    status.value = selectedValue;
    await fetchPodsData();
};

const hideDialog = () => {
    filterDialog.value = false;
    submitted.value = false;
};

const openFilter = () => {
    product.value = {};
    submitted.value = false;
    filterDialog.value = true;
};
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="flex flex-col gap-4">
                <div>
                    <Dropdown
                        id="state"
                        v-model="status"
                        @change="handleDropdownStatusChange(status, 'status')"
                        :options="statuses"
                        optionLabel="label"
                        placeholder="Select Status"
                    />
                </div>
                <div>
                    <Button
                        type="button"
                        icon="pi pi-filter-fill"
                        label="Filter"
                        outlined
                        @click="openFilter"
                    />
                </div>
                <div>
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        outlined
                        @click="clearFilter"
                    />
                </div>
            </div>
            <Dialog v-model:visible="filterDialog" :style="{ width: '350px' }" :modal="true" class="p-fluid">
                <template #header>
                    <div class="p-d-flex p-ai-center">
                        <span class="pi pi-filter p-mr-1" style="color: darkgreen; font-weight: 700"></span>
                        <span class="p-ml-n6" style="color: darkgreen; font-weight: 700; font-size: larger"> More Filters</span>
                    </div>
                </template>

                <div class="field">
                    <Dropdown
                        v-model="status"
                        @change="handleDropdownChange(status, 'status')"
                        :key="dropdownKey"
                        :options="statuses"
                        optionLabel="label"
                        placeholder="Select Status"
                    />
                </div>

                <div class="field">
                    <Dropdown
                        v-model="ownership"
                        @change="handleDropdownChange(ownership, 'ownership')"
                        :key="dropdownKey"
                        :options="ownershipOptions"
                        optionLabel="label"
                        placeholder="Select Ownership"
                    />
                </div>

                <div class="field">
                    <Dropdown
                        v-model="vehicleType"
                        @change="handleDropdownChange(vehicleType, 'vehicleType')"
                        :key="dropdownKey"
                        :options="vechiclesOptions"
                        optionLabel="label"
                        placeholder="Select Vehicle"
                        class="w-full"
                        :style="{ borderRadius: '8px' }"
                    />
                </div>

                <template #footer>
                    <Button
                        type="button"
                        label="Cancel"
                        icon="pi pi-times"
                        :style="{ 'background-color': '#C8E6C9', border: '#C8E6C9' }"
                        @click="hideDialog"
                    />
                    <Button
                        type="button"
                        label="Save"
                        icon="pi pi-check"
                        :style="{ 'background-color': 'darkgreen', border: 'darkgreen' }"
                        @click="saveFilters"
                    />
                </template>
            </Dialog>
        </div>
    </Fluid>
</template>
