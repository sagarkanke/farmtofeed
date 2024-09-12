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

const vehicles = computed(() => store.getters['vehicle/vehicles_data']);
const isLoading = computed(() => store.getters['vehicle/vehicles_loading']);
const error = computed(() => store.getters['vehicle/vehicles_error']);
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
        await store.dispatch('vehicle/fetchVehiclesData');
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
    router.push('/logistics/vehiclesAdd');
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
const selected_vehicles_data  = ref(null)
const selected_vehicles_loading  = ref(true)


const handleMenuItemClick = async (item, rowData) => {
    if (item.label == 'Edit') {
        // editOpen()
        // try {
        //     const response = await new LogisticsService().fetchSelectedVehicles(rowData?.id);
        //     console.log('response', response)
           
        //         selected_vehicles_data.value = response
        //         selected_vehicles_loading.value = false
          
        // } catch (error) {
        //     console.log("error", error)
        //     selected_vehicles_loading.value = false
        // }
        router.push( `/logistics/vehiclesEdit/${rowData?.id }` );
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
            const response = await new LogisticsService().deleteVehicle(rowData?.id);

            toast.add({ severity: 'success', summary: 'Successful', detail: 'Successfully deleted.', life: 1000 });
            await store.dispatch('vehicle/fetchVehiclesData');
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
const handleEdit = (rowData) => {
    // Trigger the row to be in editing mode
    const rowIndex = vehicles.value.findIndex(vehicle => vehicle.id === rowData.id);
    editingRows.value[rowIndex] = true;
};
const values = {}
</script>

<template>
    <div class="card" :style="{ marginLeft: '-26px' }">
        <h5>Vehicles</h5>

        <div class="flex justify-content-between">
            <IconField iconPosition="left">
                <InputText type="text" placeholder="Search" />
                <InputIcon class="pi pi-search" />
            </IconField>

            <div>
                <Filters />
            </div>

            <div class="flex-col">
                <Button label="Export" icon="pi pi-file-export" class="flex-1 mr-2 mb-2" />
                <Button @click="navigateToAdd" label="Add Vehicle" icon="pi pi-plus"
                    class="custom-green-900-button flex-1 mr-2 mb-2" />
            </div>
        </div>

        <div>
            <Dialog class="h-full" header="Add Vehicle" v-model:visible="display" :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '60vw', height: '70vw' }" :modal="true">
                <AddDriverFrom :close="close"></AddDriverFrom>
            </Dialog>

            <DataTable :value="vehicles" :loading="isLoading" :rows="5" :paginator="true" responsiveLayout="scroll">
                <Column field="Registration" header="Registration" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.registration_number }}
                    </template>
                </Column>
                <Column  :style="{ minWidth: '105px' }"  field="owner" header="Owner" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.owner }}
                    </template>
                </Column>
                <!-- <Column header="Status" field="status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 5rem">
                    <template #body="slotProps">
                        <span class="p-column-title">Status</span>
                        <Tag :severity="getBadgeSeverity(slotProps.data.status)">
                            {{ slotProps.data.status === 'active' ? 'Active' : 'Inactive' }}
                        </Tag>
                    </template>
                </Column> -->
                <Column field="driver" header="Driver" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.driver }}
                    </template>
                </Column>
                <Column field="ownership" header="Ownership" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.code_of_conduct }}
                    </template>
                </Column>
                <Column :style="{ minWidth: '139px' }" field="contact_number" header="Contact number" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.phone_number }}
                    </template>
                </Column>
                <Column  :style="{ minWidth: '125px' }"  field="lease_team" header="Lease team" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.food_handling_certificates }}
                    </template>
                </Column>
                <Column field="rates" header="Rates" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.rates }}
                    </template>
                </Column>
                <Column :style="{ minWidth: '125px' }" field="lease_cost" header="Lease cost" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.lease_cost }}
                    </template>
                </Column>
                <Column  :style="{ minWidth: '135px' }" field="vehicle_type" header="Vehicle type" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.vehicle_type }}

                    </template>
                </Column>
                

                
                <Column headerStyle="min-width:10rem;">
                    <template #body="slotProps">
                        <!-- <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded /> -->
                        <!-- <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editProduct(slotProps.data)" /> -->
                        <!-- <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded /> -->
                        <div>
                            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                            @click="$refs[`menu-${slotProps.data.id}`].toggle($event)"></Button>
                            <Menu :ref="`menu-${slotProps.data.id}`" :popup="true" :model="getItems(slotProps.data)"
                                class="!min-w-40">
                            </Menu>

                        </div>
                        <!-- <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" /> -->
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
