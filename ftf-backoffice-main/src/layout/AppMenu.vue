<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            {
                label: 'Sales', icon: 'pi pi-shopping-bag',
                items: [
                    { label: 'Orders', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/orders' },
                    { label: 'Invoices', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/invoices' },
                    { label: 'Rejects', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/rejects' },
                    { label: 'Flash Sales', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/flash-sales' },
                    { label: 'Coupons', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/coupons' },
                    { label: 'Customers', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/customers' },
                    { label: 'Lead', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/leads' },
                    { label: 'Commissions', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/commissions' },
                    { label: 'Commissions - Admin', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/commissions-admin' },
                    { label: 'Feedback', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sales/feedback' },
                    { label: 'Charities', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/uikit/table' },
                ]
            },
            {
                label: 'Inventory', icon: 'pi pi-fw pi-home',

                items: [
                    { label: 'Products', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/inventory/products' },
                    { label: 'Pricing', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/inventory/pricing'  },
                    { label: 'Customer Pricing', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/inventory/customer-pricing' },
                    { label: 'Real Time Inventory', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/inventory/real-time-inventory'  },
                    { label: 'Forecasting', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/inventory/forecasting'  },
                    { label: 'Deductions',icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/inventory/deductions' },
                    { label: 'Stock Movement', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/inventory/stock-movements'  },
                ]
            },
            {
                label: 'Sourcing', icon: 'pi pi pi-table',

                items: [
                    { label: 'Sourcing List', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sourcing/sourcing-list' },
                    { label: 'Farmer Orders', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sourcing/farmer-orders'  },
                    { label: 'Purchase Receive', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sourcing/purchase-receive' },
                    { label: 'Bills', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sourcing/bills'  },
                    { label: 'Farmers',icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sourcing/farmers' },
                    { label: 'Suppliers', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sourcing/suppliers'  },
                    { label: 'Market Place', icon: 'pi pi-circle-fill', iconStyle: "font-size: 0.35rem", to: '/sourcing/market-place'  },

                ]
            },
            { label: 'Dispatch', icon: 'pi pi-directions', to: '/uikit/table' },
            {
                label: 'Logistics', icon: 'pi pi-truck',
                items: [
                    { label: 'Driver', icon: 'pi pi-user', style: "font-size: 1rem", to: '/logistics/drivers' },
                    { label: 'Vehicles', icon: 'pi pi-car', to: '/logistics/vehicles' },
                    { label: 'Mileage', icon: 'pi pi-truck',to: '/logistics/mileage'},
                    { label: "PODs", icon: 'pi pi-file',to: '/logistics/pods' },
                ]
            },
            {
                label: 'Finance', icon: 'pi pi-wallet',
                items: [
                    { label: 'Logistics Expense', icon: 'pi pi-dollar', style: "font-size: 1rem ", to: '/finance/logistics/expense' },
                ]
            },
            { label: 'Users', icon: 'pi pi-fw pi-users', to: '/uikit/list' },
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <!-- <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped>
.large-icon .pi {
    font-size: 24px;
}
</style>