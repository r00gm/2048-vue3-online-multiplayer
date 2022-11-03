<template>
  <nav class="the-nav">
    <ul class="the-nav__list">
      <li v-for="{ name, label } in nav" :key="name">
        <RouterLink class="the-nav__link" :to="{ name }">{{ label }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ROUTES } from '@/constants';

const nav = [
  { name: ROUTES.HOME, label: 'How to Play' },
  { name: ROUTES.SINGLE_PLAYER, label: 'Single Player' },
  { name: ROUTES.MULTI_PLAYER, label: 'Multi Player Online' },
];
</script>

<style scoped>
.the-nav {
  @apply py-3;
}
.the-nav__list {
  @apply flex flex sm:justify-center space-x-4;
}
.the-nav__link {
  @apply block rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 border-2 border-transparent;
}

.the-nav__link.router-link-active {
  @apply border-cyan-500;
}
</style>
