<script>
import { useStore } from 'vuex';
import { computed, ref, onMounted } from 'vue';
import { PrimeIcons } from 'primevue/api';
import { useRouter } from 'vue-router';
import AddDriverFrom from './Add.vue';
import Filters from './filters.vue';

export default {
    name: 'DriverData',
    components: {
        AddDriverFrom,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const display = ref(false);
        const loading = ref(true);

        const drivers = computed(() => store.getters['pods/data']);
        const isLoading = computed(() => store.getters['pods/loading']);
        const error = computed(() => store.getters['pods/error']);

        const fetchPodsData = async () => {
            try {
                console.log('api call')
                await store.dispatch('pods/fetchPodsData');
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchPodsData);

        const open = () => {
            display.value = true;
        };

        const close = () => {
            display.value = false;
        };

        const navigateTo = (path) => {
            console.log(`Navigating to ${path}`);
            router.push(path); // Navigate to the specified path
        };

        return {
            display,
            open,
            close,
            drivers,
            isLoading,
            navigateTo,
        };
    },
};
</script>
<template>
    <div class="card" :style="{ marginLeft: '-26px' }">
        <h5>PODs </h5>
        <div class=" flex justify-content-between">
            <IconField iconPosition="left">
                <InputText type="text" placeholder="Search" />
                <InputIcon class="pi pi-search" />
            </IconField>
            <div>
                <Filters />
            </div>
            <div class="flex-col ">
                <Button label="Export" icon="pi pi-file-export" class=" flex-1 mr-2 mb-2"></Button>
                <Button @click="open" label="Add PODs" icon="pi pi-plus"
                    class=" custom-green-900-button  flex-1  mr-2 mb-2"></Button>

            </div>
        </div>

        <div>
            <Dialog class=" h-full " header="Add PODs" v-model:visible="display" :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '60vw', height: '70vw' }" :modal="true">
                <AddDriverFrom :close="close"></AddDriverFrom>
                <!-- <SampleForm /> -->

                <!-- <template #footer>
                    <Button label="Ok" @click="close" icon="pi pi-check" class="p-button-outlined" />
                </template> -->
            </Dialog>
            <DataTable :value="drivers" :rows="5" :paginator="true" responsiveLayout="scroll">
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
                <Column field="phone_number" header="Phone Number" :sortable="false">
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
                <Column field="code_of_conduct" header="Code of conduct" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.code_of_conduct }}
                    </template>
                </Column>
                <Column field="driver_license" header="Driver license" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.driver_license }}
                    </template>
                </Column>
                <Column field="food_handling_certificates" header="Food handling certificates" :sortable="false">
                    <template #body="slotProps">
                        {{ slotProps.data.food_handling_certificates }}
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
