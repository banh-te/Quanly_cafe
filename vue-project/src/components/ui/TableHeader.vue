<template>
  <thead class="[&_tr]:border-b" v-bind="$attrs">
    <slot />
  </thead>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default { inheritAttrs: false }
</script>
