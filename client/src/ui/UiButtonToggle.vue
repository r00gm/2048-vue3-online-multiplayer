<script setup lang="ts">
import { defineEmits } from 'vue';

defineProps({
  modelValue: {
    type: [String, Number],
  },
  options: {
    type: Array<{ label: string; value: string | number }>,
    default: 4,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="inline-flex rounded-md shadow-sm" role="group">
    <button
      v-for="({ value, label }, index) in options"
      :key="value"
      type="button"
      :class="{
        toggle: true,
        'toggle--first': index === 0,
        'toogle--last': index === options.length - 1,
        'toogle--active': modelValue === value,
      }"
      @click="emit('update:modelValue', value)"
    >
      {{ label }}
    </button>
  </div>
</template>

<style scoped>
.toggle {
  @apply py-2 px-4 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white;
}

.toggle--first {
  @apply rounded-l-lg;
}
.toogle--last {
  @apply rounded-r-md;
}

.toogle--active {
  @apply bg-gray-900 text-white;
}
</style>
