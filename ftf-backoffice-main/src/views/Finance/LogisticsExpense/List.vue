<script setup>
import { useStore } from 'vuex';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AddDriverFrom from './Add.vue';
import Filters from './filters.vue';
import { useToast } from 'primevue/usetoast';
import { LogisticsService } from '../../../service/LogisticsService';

const store = useStore();
const router = useRouter();
const display = ref(false);
const loading = ref(true);

const vehicles = computed(() => store.getters['logisticsExpense/data']);
const isLoading = computed(() => store.getters['logisticsExpense/loading']);
const error = computed(() => store.getters['logisticsExpense/error']);
const dropdownValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

const dropdownValue = ref(null);

const fetchVehiclesData = async () => {
    try {
        console.log('api call');
        await store.dispatch('logisticsExpense/fetchLogisticsExpenseData');
    } catch (err) {
        console.error('Error fetching data:', err);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchVehiclesData);

const open = () => {
    display.value = true;
};

const close = () => {
    display.value = false;
};

const navigateTo = (path) => {
    console.log(`Navigating to ${path}`);
    router.push(path);
};

const navigateToAdd = () => {
    console.log('Navigating to vehiclesAdd');
    router.push('/logisticsExpense/vehiclesAdd');
};

const filters = ref({
    global: { value: null }
});

const getBadgeSeverity = (isActive) => {
    return isActive === 'active' ? 'success' : 'danger';
};
const toast = useToast()

const getItems = (rowData) => {

    return [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => handleMenuItemClick({ label: 'Edit' }, rowData)
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => handleMenuItemClick({ label: 'Delete' }, rowData)
        },
        {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => handleMenuItemClick({ label: 'View' }, rowData)
        }
        // Add more items here
    ]
};
const visibleRight = ref(false);
const sidebarLoading = ref(true);
const selected_vehicles_data = ref(null)
const selected_vehicles_loading = ref(true)


const handleMenuItemClick = async (item, rowData) => {
    if (item.label == 'Edit') {
        // editOpen()
        // try {
        //     const response = await new logisticsExpenseService().fetchSelectedVehicles(rowData?.id);
        //     console.log('response', response)

        //         selected_vehicles_data.value = response
        //         selected_vehicles_loading.value = false

        // } catch (error) {
        //     console.log("error", error)
        //     selected_vehicles_loading.value = false
        // }
        router.push(`/logisticsExpense/vehiclesEdit/${rowData?.id}`);
    }
    if (item.label == 'View') {
        console.log("view")

        try {
            const response = await new LogisticsService().fetchSelectedVehicles(rowData?.id);
            console.log('response', response)

            selected_vehicles_data.value = response
            selected_vehicles_loading.value = false

        } catch (error) {
            console.log("error", error)
            selected_vehicles_loading.value = false
        }

        // await store.dispatch('logistics/fetchSeclectedVehiclesData' , rowData?.id );
        visibleRight.value = true

    }
    if (item.label == 'Delete') {

        try {
            const response = await new LogisticsService().deleteDriver(rowData?.id);

            toast.add({ severity: 'success', summary: 'Successful', detail: 'Successfully deleted.', life: 1000 });
            await store.dispatch('logistics/fetchDriversData');
        } catch (error) {
            console.log('error', error)
            toast.add({ severity: 'error', summary: 'Deletion Failed..!!', detail: `${error?.response?.data?.message}`, life: 1000 });

        }


    }

    // await store.dispatch('logistics/setSelectedDriver', rowData);
};
const handleSidebarClose = () => {
    selected_vehicles_loading.value = true;  // Reset loading state
};
const values = {}
const nestedRouteItems = ref([
    {
        label: 'Overview',
        to: '/uikit/menu'
    },
    {
        label: 'Fuel',
        to: '/uikit/menu/seat'
    },
    {
        label: 'Lease',
        to: '/uikit/menu/payment'
    },
    {
        label: 'On Demand',
        to: '/uikit/menu/confirmation'
    }
]);
const startDate = ref(new Date(2024, 10, 1));
const endDate = ref(new Date(2024, 12, 31));
const style = {
    marginBottom: '12px !important',
    backgroundColor: 'transparent !important',
};
const selectionMode = ref('range'); // Enable range selection mode
const selectedDates = ref([]);
const dateRange = ref('');
const active = ref(0)
const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US').format(date);
};
const selectedTabLabel = computed(() => {

    return nestedRouteItems.value[active.value]?.label || 'Overview';
});

console.log('selectedTabLabel', selectedTabLabel, active)

const handleDateChange = (event) => {
    const { value } = event;
    if (value.length === 2) {
        selectedDates.value = value;
        dateRange.value = `${formatDate(value[0])} - ${formatDate(value[1])}`;
    } else {
        selectedDates.value = [];
        dateRange.value = '';
    }
};
const getSeverity = (status) => {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'approved':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warning';

        case 'renewal':
            return null;
    }
};
const showAddButtonText = computed(() => selectedTabLabel.value === 'Lease' || selectedTabLabel.value == 'Fuel');
const AddButtonLabel = computed(() => 'New ' + selectedTabLabel.value + ' Exp ')
</script>
<style>
.date-picker-container {
    display: flex;
    /* flex-direction: column; */
    align-items: flex-start;
    /* width : 260px; */
}

.date-picker-input {
    display: flex;
    /* flex-direction: column; */
    align-items: flex-start;
}

.date-picker-inputl-w {

    width: 108px;
}

.date-picker-inputr-w {

    width: 138px;
}

.date-picker-input InputText {
    margin-bottom: 1rem;
    width: 100%;
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
    background-color: transparent !important;
    /* Orange underline */
}
.custom-tabmenu-wrapper > .p-tabmenu-nav:first-of-type {
    background-color: transparent;
}
/* Remove any additional pseudo-element used as underline */
.custom-tabmenu-wrapper ::v-deep .p-tabmenu .p-tabmenu-nav::after {
    display: none;
    background-color: transparent !important;
    /* Hide any additional pseudo-element used as underline */
}
</style>
<template>
    <div :style="{ marginLeft: '-26px' }">
        <div class="grid">
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Fuel</span>
                            <div class="text-900 font-medium text-xl">1234</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">13 </span>
                    <span class="text-500"> vs last month's : 1200</span>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Lease</span>
                            <div class="text-900 font-medium text-xl">1234</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">%52+ </span>
                    <span class="text-500">vs last month's : 1200</span>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">On Demand</span>
                            <div class="text-900 font-medium text-xl">28441</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">520 </span>
                    <span class="text-500">vs last month's : 1200</span>
                </div>
            </div>
            <div class="col-12 lg:col-6 xl:col-3">
                <div class="card mb-0">
                    <div class="flex justify-content-between mb-3">
                        <div>
                            <span class="block text-500 font-medium mb-3">Bolt</span>
                            <div class="text-900 font-medium text-xl">1234</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style="width: 2.5rem; height: 2.5rem">
                            <i class="pi pi-comment text-purple-500 text-xl"></i>
                        </div>
                    </div>
                    <span class="text-green-500 font-medium">85 </span>
                    <span class="text-500">vs last mmonth's : 1200</span>
                </div>
            </div>
        </div>
        <!-- <div class="mt-4">
            <div class="custom-tabmenu-wrapper">
                <TabMenu :model="nestedRouteItems"
                    :activeIndex="nestedRouteItems.findIndex(item => item.key === activeTab)"
                    @tab-change="handleTabChange" />
            </div>
        </div> -->
        <!-- <div class="custom-tabmenu-wrapper" :style="{ marginTop: '-10px', marginBottom: '12px' }">
                <TabMenu v-model:activeIndex="active" :model="nestedRouteItems" class="" />
                <router-view />

            </div> -->
        <div class="card">
            <div class="custom-tabmenu-wrapper" :style="{ marginTop: '-10px', marginBottom: '12px' }">
                <TabMenu v-model:activeIndex="active" :model="nestedRouteItems" class="custom-tabmenu" />
                <router-view />

            </div>




            <div>


                <DataTable :value="vehicles" :loading="isLoading" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <template #header>
                        <h5>{{ selectedTabLabel }}</h5>

                        <div class="flex justify-content-between align-items-center "
                            :style="{ marginTop: '18px', marginBottom: '18px', marginLeft: '-13px', marginRight: '-31px' }">
                            <!-- <div class=" flex justify-content-between align-items-center " :style="{ gap: '20px' }"> -->

                            <div class="grid formgrid">

                                <div class="col-12 mb-2 lg:col-6 lg:mb-0">
                                    <IconField iconPosition="left">
                                        <InputText type="text" placeholder="Search" />
                                        <InputIcon class="pi pi-search" />
                                    </IconField>
                                </div>
                            </div>
                            <div class="date-picker-container">

                                <div class="date-picker-input">
                                    <!-- <InputText v-model="formattedDateRange" placeholder="Select Date Range" readonly /> -->
                                    <Calendar class=" date-picker-inputl-w " v-model="startDate" :showButtonBar="true"
                                        :dateFormat="'yy-mm-dd'" @change="updateStartDate" />
                                    <Calendar class=" date-picker-inputr-w " showIcon fluid v-model="endDate"
                                        :showButtonBar="true" :dateFormat="'yy-mm-dd'" @change="updateEndDate" />
                                </div>
                            </div>
                            <div>
                                <Filters />
                            </div>
                            <div class=" flex align-items-center" :style="{ marginTop: '6px' }">
                                <Button label="Export" icon="pi pi-file-export" class=" mr-2 mb-2" />
                                <Button v-if="showAddButtonText" @click="navigateToAdd" :label="AddButtonLabel"
                                    icon="pi pi-plus" class="custom-green-900-button  mr-2 mb-2" />
                                <!-- </div> -->
                            </div>

                        </div>
                    </template>
                    <Column field="date" header="Date" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.date }}
                        </template>
                    </Column>
                    <Column field="vehicle" header="vehicle" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.vehicle }}
                        </template>
                    </Column>
                    <Column field="owner" header="Owner" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.owner }}
                        </template>
                    </Column>
                    <Column field="expense_type" :style="{ minWidth: '123px' }" header="Expense Type" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.expense_type }}
                        </template>
                    </Column>
                    <Column field="mileage" header="Mileage" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.mileage }}
                        </template>
                    </Column>
                    <Column field="first_mile" :style="{ minWidth: '93px' }" header="First Mile" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.first_mile }}
                        </template>
                    </Column>
                    <Column field="last_mile" :style="{ minWidth: '93px' }" header="Last Mile" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.last_mile }}

                        </template>
                    </Column>
                    <Column field="fm_cost" :style="{ minWidth: '93px' }" header="FM Cost" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.fm_cost }}

                        </template>
                    </Column>
                    <Column field="lm_cost" :style="{ minWidth: '93px' }" header="LM Cost" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.lm_cost }}

                        </template>
                    </Column>
                    <Column field="transaction_cost" :style="{ minWidth: '146px' }" header="Transaction Cost"
                        :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.transaction_cost }}

                        </template>
                    </Column>
                    <Column field="qb_reference" :style="{ minWidth: '122px' }" header="QB Reference" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.qb_reference }}

                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="false">
                        <template #body="slotProps">
                            {{ slotProps.data.status }}

                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">

                            <Tag :severity="getSeverity(slotProps.data.status)"><i class="pi"
                                    :style="{ marginRight: '5px' }"
                                    :class="{ 'text-green-500 pi-check-circle': slotProps.data.status, 'text-pink-500 pi-times-circle': !slotProps.data.status }"></i>{{
                                        slotProps.data.status.toUpperCase() }}</Tag>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
