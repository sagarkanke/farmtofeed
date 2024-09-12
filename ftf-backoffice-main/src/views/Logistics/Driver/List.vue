<script setup>
import { useStore } from 'vuex';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AddDriverFrom from './Add.vue';
import SampleForm from './SampleForm.vue';
import EditDriverFrom from './Edit.vue'
import { useToast } from 'primevue/usetoast';
import { LogisticsService } from '../../../service/LogisticsService';
const store = useStore();
const router = useRouter();
const display = ref(false);
const editDisplay = ref(false);
const loading = ref(true);
const toast = useToast()

const drivers = computed(() => store.getters['driver/data']);
const isLoading = computed(() => store.getters['driver/loading']);
const error = computed(() => store.getters['driver/error']);
const selected_driver = computed(() => store.getters['driver/selected_driver']);

const dt = ref();

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
        }
        // Add more items here
    ]
};

const handleMenuItemClick = async (item, rowData) => {
    console.log('rowData', rowData)
    if (item.label == 'Edit') {
        editOpen()
    }
    if (item.label == 'Delete') {

        try {
            const response = await new LogisticsService().deleteDriver(rowData?.id);

            toast.add({ severity: 'success', summary: 'Successful', detail: 'Successfully deleted.', life: 1000 });
            await store.dispatch('driver/fetchDriversData');
        } catch (error) {
            console.log('error', error)
            toast.add({ severity: 'error', summary: 'Deletion Failed..!!', detail: `${error?.response?.data?.message}`, life: 1000 });

        }


    }
    await store.dispatch('driver/setSelectedDriver', rowData);
};

function exportCSV() {
    dt.value.exportCSV();
}

const fetchDriversData = async () => {
    try {
        await store.dispatch('driver/fetchDriversData');
    } catch (err) {
        console.error('Error fetching data:', err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchDriversData();
});

const open = () => {
    display.value = true;
};

const editOpen = () => {
    editDisplay.value = true;
};

const close = () => {
    display.value = false;
};

const editClose = () => {
    editDisplay.value = false;
};


const navigateTo = (path) => {
    console.log(`Navigating to ${path}`);
    router.push(path); // Navigate to the specified path
};

const handleClick = (event) => {
    console.log('Button clicked:', event);
    // Toggle the menu visibility
    const menu = $refs.menu2;
    if (menu) {
        menu.toggle(event);
    }
};
console.log('drivers', drivers.value)
</script>
<template>
    <div class="card" :style="{ marginLeft: '-26px' }">
        <h5>Drivers </h5>

        <div class=" flex justify-content-between">
            <IconField iconPosition="left">
                <InputText type="text" placeholder="Search" />
                <InputIcon class="pi pi-search" />
            </IconField>
            <div class="flex-col ">
                <Button label="Export" icon="pi pi-file-export" @click="exportCSV($event)"
                    class=" flex-1 mr-2 mb-2"></Button>
                <Button @click="open" label="Add Driver" icon="pi pi-plus"
                    class=" custom-green-900-button  flex-1  mr-2 mb-2"></Button>

            </div>
        </div>

        <div>
            <Dialog class=" h-full " header="Add Driver" v-model:visible="display" :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '70vw', height: '70vw' }" :modal="true">
                <AddDriverFrom :close="close"></AddDriverFrom>


                <!-- <template #footer>
                    <Button label="Ok" @click="close" icon="pi pi-check" class="p-button-outlined" />
                </template> -->
            </Dialog>
            <Dialog class=" h-full " header="Edit Driver" v-model:visible="editDisplay"
                :breakpoints="{ '960px': '75vw' }" :style="{ width: '70vw', height: '70vw' }" :modal="true">
                <EditDriverFrom :close="editClose"></EditDriverFrom>


                <!-- <template #footer>
                    <Button label="Ok" @click="close" icon="pi pi-check" class="p-button-outlined" />
                </template> -->
            </Dialog>
            <DataTable currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                :loading="loading" ref="dt" :value="drivers" :rows="5" :paginator="true" responsiveLayout="scroll">
                <Column field="id" header="Id" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.id }}
                    </template>
                </Column>
                <Column field="name" header="Name" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.name }}
                    </template>
                </Column>
                <Column   :style="{ minWidth: '130px' }"  field="phone_number" header="Phone Number" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.phone_number }}
                    </template>
                </Column>
                <Column field="type" header="Type" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.type }}
                    </template>
                </Column>
                <Column field="vehicles" header="Vehicles" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.vehicles }}
                    </template>
                </Column>
                <Column  :style="{ minWidth: '141px' }"  field="code_of_conduct" header="Code of conduct" :sortable="false">
                    <template #body="slotProps">
                        <div class=" flex flex-column gap-2 ">
                            <div>
                                {{ slotProps.data.code_of_conduct }}
                            </div>
                            <div>
                                {{ slotProps.data.code_of_conduct_expiry }}
                            </div>
                        </div>
                    </template>
                </Column>
                <Column  :style="{ minWidth: '122px' }" field="driver_license" header="Driver license" :sortable="false">
                    <template #body="slotProps">
                        <div class=" flex flex-column gap-2 ">
                            <div>
                                {{ slotProps.data.drivers_license }}
                            </div>
                            <div>
                                {{ slotProps.data.drivers_license_expiry }}
                            </div>
                        </div>
                    </template>
                </Column>
                <Column :style="{ minWidth: '208px' }"   field="food_handling_certificates" header="Food handling certificates" :sortable="false">
                    <template #body="slotProps">
                        <div class="flex flex-column gap-2 ">
                            <div>
                                {{ slotProps.data.food_handling }}
                            </div>
                            <div>
                                {{ slotProps.data.food_handling_expiry }}
                               
                            </div>
                        </div>
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
                <!-- <Column headerStyle="width:4rem">
          <template #body="slotProps">
            <Button icon="pi pi-search" />
          </template>
        </Column> -->
            </DataTable>
        </div>
    </div>
</template>
