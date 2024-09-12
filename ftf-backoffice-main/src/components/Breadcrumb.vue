<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <i v-if="breadcrumbs.length > 0" class="pi pi-box pr-2"></i>

      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item" :class="{ 'active': index === breadcrumbs.length - 1 }">
        <router-link v-if="index !== breadcrumbs.length - 1" :to="crumb.path">{{ crumb.meta.breadcrumb }}</router-link>
        <span v-else>{{ crumb.meta.breadcrumb }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p);
  const breadcrumbArray = [];
  
  pathArray.reduce((prev, curr) => {
    const path = `${prev}/${curr}`;
    const routeMatch = route.matched.find(r => r.path === path);
    if (routeMatch && routeMatch.meta.breadcrumb) {
      breadcrumbArray.push({ path, meta: routeMatch.meta });
    }
    return path;
  }, '');

  return breadcrumbArray;
});
</script>

<style scoped>
.breadcrumb {
  margin-left: 0;
}

.breadcrumb-item {
  display: inline-block;
}

.breadcrumb-item + .breadcrumb-item::before {
  display: inline-block;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  color: #6c757d; /* Grey color for separator */
  content: ">";
}

.breadcrumb-item > router-link {
  color: #808080 !important; /* Grey color for past pages */
  text-decoration: none;
}

.breadcrumb-item > router-link:hover {
  text-decoration: underline;
}

.breadcrumb-item.active > span {
  color: #004d00 !important; /* Dark green for current page */
}

/* Styling for the icon */
.pi-box {
  color: #ccc; /* Default grey color for the icon */
}

.breadcrumb-item:first-child .pi-box {
  color: #004d00; /* Dark green if breadcrumbs are present */
}

/* Ensure icon is grey when there are no breadcrumbs */
.breadcrumb:not(:has(.breadcrumb-item)) .pi-box {
  color: #ccc; /* Grey when no breadcrumbs */
}

.breadcrumb-item.sales > router-link,
.breadcrumb-item.orders > router-link {
  font-weight: bold !important; /* Make text bold */
  font-size: 1.2rem !important; /* Increase font size */
}
</style>
