<template>
  <button type="button" class="ui-button" @click="emit('click', $event)">
    {{ props.label }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: [String, Number],
  },
  color: {
    type: String,
  },
});
const emit = defineEmits(['click']);
</script>

<style scoped>
.ui-button {
  @apply inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900;
}
</style>
