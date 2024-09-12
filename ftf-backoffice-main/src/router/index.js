import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const routes = [
  {
    path: '/',
    component: AppLayout,
    history: createWebHistory('/frontend/'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'logistics',
        meta: { breadcrumb: 'Logistics' },
        children: [
          {
            path: 'drivers',
            name: 'logistics-drivers',
            component: () => import('@/views/Logistics/Driver/List.vue'),
            meta: { breadcrumb: 'Drivers' }
          },
          {
            path: 'vehicles',
            name: 'logistics-vehicles',
            component: () => import('@/views/Logistics/Vehicles/List.vue'),
            meta: { breadcrumb: 'Vehicles' }
          },
          {
            path: 'mileage',
            name: 'logistics-mileage',
            component: () => import('@/views/Logistics/Mileage/List.vue'),
            meta: { breadcrumb: 'Mileage' }
          },
          {
            path: 'pods',
            name: 'logistics-pods',
            component: () => import('@/views/Logistics/PODs/List.vue'),
            meta: { breadcrumb: 'PODs' }
          },
          {
            path: 'vehiclesAdd',
            name: 'logistics-vehiclesAdd',
            component: () => import('@/views/Logistics/Vehicles/Add.vue'),
            meta: { breadcrumb: 'Vehicles > Add' }
          },
          {
            path: 'vehiclesEdit/:vehicleId',
            name: 'logistics-vehiclesEdit',
            component: () => import('@/views/Logistics/Vehicles/Edit.vue'),
            meta: { breadcrumb: 'Vehicles > Edit' }
          }
        ]
      },
      {
        path: 'finance',
        meta: { breadcrumb: 'Finance' },
        children: [
          {
            path: 'logistics/expense',
            name: 'finance-logistics-expense',
            component: () => import('@/views/Finance/LogisticsExpense/List.vue'),
            meta: { breadcrumb: 'Logistics Expense' }
          }
        ]
      },
      {
        path: 'sales',
        meta: { breadcrumb: 'Sales' },
        children: [
          {
            path: 'orders',
            name: 'sales-orders',
            component: () => import('@/views/Sales/Orders/List.vue'),
            meta: { breadcrumb: 'Orders' }
          },
          {
            path: 'new-orders',
            name: 'NewOrders',
            component: () => import('@/views/Sales/Orders/Add.vue'),
            meta: { breadcrumb: 'New Order' }
          },
          {
            path: 'edit-order',
            name: 'editOrder',
            component: () => import('@/views/Sales/Orders/Edit.vue'),
            meta: { breadcrumb: 'Edit Order' }
          },
          {
            path: 'invoices',
            name: 'sales-invoices',
            component: () => import('@/views/Sales/Invoices/List.vue'),
            meta: { breadcrumb: 'Invoices' }
          },
          {
            path: 'rejects',
            name: 'sales-rejects',
            component: () => import('@/views/Sales/Rejects/List.vue'),
            meta: { breadcrumb: 'Rejects' }
          },
          {
            path: 'flash-sales',
            name: 'flash-sales',
            component: () => import('@/views/Sales/FlashSales/List.vue'),
            meta: { breadcrumb: 'Flash Sales' }
          },
          {
            path: 'coupons',
            name: 'coupons',
            component: () => import('@/views/Sales/Coupons/List.vue'),
            meta: { breadcrumb: 'Coupons' }
          },
          {
            path: 'customers',
            name: 'customers',
            component: () => import('@/views/Sales/Customer/List.vue'),
            meta: { breadcrumb: 'Customers' }
          },
          {
            path: 'new-customers',
            name: 'NewCustomers',
            component: () => import('@/views/Sales/Customer/Add.vue'),
            meta: { breadcrumb: 'New Customer' }
          },
          {
            path: 'edit-customer',
            name: 'EditCustomers',
            component: () => import('@/views/Sales/Customer/Edit.vue'),
            meta: { breadcrumb: 'Edit Customer' }
          },
          {
            path: 'customer-details',
            name: 'CustomerDetails',
            component: () => import('@/views/Sales/Customer/Details.vue'),
            meta: { breadcrumb: 'Customer Details' }
          },
          {
            path: 'leads',
            name: 'leads',
            component: () => import('@/views/Sales/Lead/List.vue'),
            meta: { breadcrumb: 'Leads' }
          },
          {
            path: 'new-lead',
            name: 'NewLead',
            component: () => import('@/views/Sales/Lead/Add.vue'),
            meta: { breadcrumb: 'New Lead' }
          },
          {
            path: 'edit-lead',
            name: 'EditLead',
            component: () => import('@/views/Sales/Lead/Edit.vue'),
            meta: { breadcrumb: 'Edit Lead' }
          },
          {
            path: 'order-details/:orderId/:orderNumber',
            name: 'orderDetails',
            component: () => import('@/views/Sales/Orders/Details.vue'),
            meta: { breadcrumb: 'Order Details' },
            props: route => ({
              orderId: route.params.orderId,
              orderNumber: route.params.orderNumber
            })
          },
          {
            path: 'commissions',
            name: 'commissions',
            component: () => import('@/views/Sales/Commissions/List.vue'),
            meta: { breadcrumb: 'Commissions' }
          },
          {
            path: 'commissions-admin',
            name: 'commissionsAdmin',
            component: () => import('@/views/Sales/CommissionsAdmin/List.vue'),
            meta: { breadcrumb: 'Commissions Admin' }
          },
          {
            path: 'commissions-admin-details/:id/:leadOwner',
            name: 'commissionsAdminDetails',
            component: () => import('@/views/Sales/CommissionsAdmin/Details.vue'),
            meta: { breadcrumb: 'Commissions Admin' },
            props: route => ({
              id: route.params.id,
              leadOwner: route.params.leadOwner
            })
          },
          {
            path: 'commissions-admin-lead-details/:id/:month/:leadOwner',
            name: 'commissionsAdminLeadDetails',
            component: () => import('@/views/Sales/CommissionsAdmin/LeadDetails.vue'),
            meta: { breadcrumb: 'Lead' },
            props: route => ({
              id: route.params.id,
              month: route.params.month,
              leadOwner: route.params.leadOwner
            })
          },
          {
            path: 'feedback',
            name: 'feedback',
            component: () => import('@/views/Sales/Feedback/List.vue'),
            meta: { breadcrumb: 'Feedback' }
          }
          // Add more Sales child routes here
        ]
      },
      {
        path: 'uikit/formlayout',
        name: 'Logistics',
        component: () => import('@/views/uikit/FormLayout.vue')
      },
      {
        path: 'inventory',
        meta: { breadcrumb: 'Inventory' },
        children: [
          {
            path: 'products',
            name: 'products',
            component: () => import('@/views/Inventory/Products/List.vue'),
            meta: { breadcrumb: 'Products' }
          },
          {
            path: 'new-product',
            name: 'newProduct',
            component: () => import('@/views/Inventory/Products/Add.vue'),
            meta: { breadcrumb: 'New Product' }
          },
          {
            path: 'pricing',
            name: 'pricing',
            component: () => import('@/views/Inventory/Pricing/List.vue'),
            meta: { breadcrumb: 'Pricing' }
          },
          {
            path: 'customer-pricing',
            name: 'customerPricing',
            component: () => import('@/views/Inventory/CustomerPricing/List.vue'),
            meta: { breadcrumb: 'Customer Pricing' }
          },
          {
            path: 'customer-pricing-details',
            name: 'customerPricingDetails',
            component: () => import('@/views/Inventory/CustomerPricing/Details.vue'),
            meta: { breadcrumb: 'Customer Pricing' },
            props: route => ({
              data: route.query.data ? JSON.parse(decodeURIComponent(route.query.data)) : null
            })
          },
          {
            path: 'real-time-inventory',
            name: 'realTimeInventory',
            component: () => import('@/views/Inventory/RealTimeInventory/List.vue'),
            meta: { breadcrumb: 'Real Time Inventory' }
          },
          {
            path: 'forecasting',
            name: 'forecasting',
            component: () => import('@/views/Inventory/Forecasting/List.vue'),
            meta: { breadcrumb: 'Forecasting' }
          },
          {
            path: 'deductions',
            name: 'deductions',
            component: () => import('@/views/Inventory/Deductions/List.vue'),
            meta: { breadcrumb: 'Deductions' }
          },
          {
            path: 'stock-movements',
            name: 'stock-movements',
            component: () => import('@/views/Inventory/StockMovements/List.vue'),
            meta: { breadcrumb: 'Stock Movements' }
          },
        ]
      },
      {
        path: 'sourcing',
        meta: { breadcrumb: 'Sourcing' },
        children:[
          {
            path: 'sourcing-list',
            name: 'sourcing-list',
            component: () => import('@/views/Sourcing/SourcingList/List.vue'),
            meta: { breadcrumb: 'Sourcing List' },
            children : [
             
            ]
          },
          {
            path: 'new-farmer-orders',
            name: 'NewFarmerOrders',
            component: () => import('@/views/Sourcing/SourcingList/Add.vue'),
            meta: { breadcrumb: 'New Order' }
          },
          {
            path: 'farmer-orders',
            name: 'farmer-orders',
            component: () => import('@/views/Sourcing/FarmerOrders/List.vue'),
            meta: { breadcrumb: 'Farmer Orders' },
            children : [
             
            ]
          },
          {
            path: 'purchase-receive',
            name: 'purchase-receive',
            component: () => import('@/views/Sourcing/PurchaseReceive/List.vue'),
            meta: { breadcrumb: 'Purchase Receive' },
            children : [
             
            ]
          },
          {
            path: 'new-receive',
            name: 'purchaseReceive',
            component: () => import('@/views/Sourcing/PurchaseReceive/Add.vue'),
            meta: { breadcrumb: 'Pushase Receive' },
            children : [
             
            ]
          },
          {
            path: 'receive-details',
            name: 'purchaseReceiveDetails',
            component: () => import('@/views/Sourcing/PurchaseReceive/Details.vue'),
            meta: { breadcrumb: 'Pushase Receive' },
            children : [
             
            ]
          },
          {
            path: 'bills',
            name: 'bills',
            component: () => import('@/views/Sourcing/Bills/List.vue'),
            meta: { breadcrumb: 'Bills' },
            children : [
             
            ]
          },
          {
            path: 'farmers',
            name: 'farmers',
            component: () => import('@/views/Sourcing/Farmers/List.vue'),
            meta: { breadcrumb: 'Farmers' },
            children : [
             
            ]
          },
          {
            path: 'new-farmer',
            name: 'newFarmer',
            component: () => import('@/views/Sourcing/Farmers/Add.vue'),
            meta: { breadcrumb: 'New Farmer' },
            children : [
             
            ]
          },
          {
            path: 'edit-farmer',
            name: 'editFarmer',
            component: () => import('@/views/Sourcing/Farmers/Edit.vue'),
            meta: { breadcrumb: 'Edit Farmer' },
            children : [
             
            ]
          },
          {
            path: 'farmer-details',
            name: 'farmerDetails',
            component: () => import('@/views/Sourcing/Farmers/Details.vue'),
            meta: { breadcrumb: 'Farmer Details' },
            children : [
             
            ]
          },
          {
            path: 'suppliers',
            name: 'suppliers',
            component: () => import('@/views/Sourcing/Suppliers/List.vue'),
            meta: { breadcrumb: 'Suppliers' },
            children : [
             
            ]
          },
          {
            path: 'new-suppliers',
            name: 'newSuppliers',
            component: () => import('@/views/Sourcing/Suppliers/Add.vue'),
            meta: { breadcrumb: 'New Supplier' },
            children : [
             
            ]
          },
          {
            path: 'edit-supplier',
            name: 'editSuppliers',
            component: () => import('@/views/Sourcing/Suppliers/Edit.vue'),
            meta: { breadcrumb: 'Edit Supplier' },
            children : [
             
            ]
          },
          {
            path: 'supplier-details',
            name: 'supplierDetails',
            component: () => import('@/views/Sourcing/Suppliers/Details.vue'),
            meta: { breadcrumb: 'Supplier Details' },
            children : [
             
            ]
          },
          {
            path: 'market-place',
            name: 'market-place',
            component: () => import('@/views/Sourcing/MarketPlace/List.vue'),
            meta: { breadcrumb: 'Market Place' },
            children : [
             
            ]
          },
          
    
        ]
      },
    ]
  },
  {
    path: '/auth/login',
    component: () => import('@/views/pages/auth/Login.vue')
  },
  {
    path: '/auth/forgot-password',
    component: () => import('@/views/pages/auth/ForgetPassword.vue')
  },
  {
    path: '/auth/reset-password',
    component: () => import('@/views/pages/auth/ResetPassword.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/auth',
    component: () => import('@/views/pages/auth/Error.vue')
  }
];

const router = createRouter({
  history: createWebHistory('/frontend/'),
  routes
});

export default router;
