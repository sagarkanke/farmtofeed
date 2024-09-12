<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { mapGetters, useStore } from 'vuex';
import Breadcrumb from '../components/Breadcrumb.vue';

const { layoutConfig, onMenuToggle } = useLayout();
const router = useRouter();
const store = useStore();

// State and refs
const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }]);

// Computed properties
const logoUrl = computed(() => {
  return `/demo/images/${layoutConfig.darkTheme.value ? 'sidebar-logo' : 'sidebar-logo'}.svg`;
});

const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  };
});

const name = computed(() => store.getters.name);
const avatarLetter = computed(() => name.value ? name.value.charAt(0).toUpperCase() : '');

// Methods
const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
  router.push('/auth/login');
};

const onSettingsClick = () => {
  topbarMenuActive.value = false;
  router.push('/documentation');
};

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value);
    outsideClickListener.value = null;
  }
};

const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector('.layout-topbar-menu');
  const topbarEl = document.querySelector('.layout-topbar-menu-button');

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

// Lifecycle hooks
onMounted(() => {
  bindOutsideClickListener();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

</script>

<template>
    <div class="layout-topbar flex justify-content-between  ">
        <router-link to="/" class="layout-topbar-logo" >
            <img :src="logoUrl" alt="logo" :style="{height: 'auto !important'}"/>
        </router-link>
        <div class=" flex w-full ">
            <div class=" pl-3 flex-1 flex justify-content-start">
                <Breadcrumb />
            </div>
            <div class=" pr-3 flex-1 flex justify-content-end ">
                <div class="layout-topbar-menu" :style="{'align-items':'center'}" :class="topbarMenuClasses">
                    <button class="p-link layout-menu-button layout-topbar-button"  @click="onMenuToggle()">
                        <i class="pi pi-bell"></i>
                    </button>
                        <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button"  :style="{'margin-left':'0px !important'}">
                            <!-- <i class="pi pi-user"></i> -->
                            <div class="avatar">{{ avatarLetter }}</div>
                        </button>
                        <span class="layout-menu-button" :style="{'margin-left':'0px !important' , 'font-size': '1rem','color':'#122C20','font-weight':'500'}">{{name}}</span>
                    </div>
            </div>
            </div>
<!-- <div class="col-6"> -->
            <!-- <div>
                 <Breadcrumb />
            </div> -->
        <!-- </div> -->
    
       
    </div>
</template>

<style lang="scss" scoped>
.avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #122C20; /* or any other preferred color */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    margin-right: 10px;
  }
</style>
