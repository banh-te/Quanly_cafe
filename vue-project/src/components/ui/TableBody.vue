<template>
  <tbody class="[&_tr:last-child]:border-0" v-bind="$attrs">
    <slot />
  </tbody>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default { inheritAttrs: false }
</script>
