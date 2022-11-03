<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import FixedHeaderAndFooterLayout from '@/layouts/FixedHeaderAndFooterLayout.vue';
import TheNav from '@/components/TheNav.vue';
</script>

<template>
  <FixedHeaderAndFooterLayout class="h-screen">
    <template v-slot:header>
      <TheNav />
    </template>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <!-- main content -->
          <component :is="Component"></component>

          <!-- loading state -->
          <template #fallback> Loading... </template>
        </Suspense>
      </template>
    </RouterView>
    <template v-slot:footer>
      <div class="py-2 bg-gray-700 text-center text-white">Made with ♥</div>
    </template>
    <!-- <RouterView /> -->
  </FixedHeaderAndFooterLayout>
</template>

<style scoped></style>
