<template>
  <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0" v-bind="$attrs">
    <slot />
  </td>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default { inheritAttrs: false }
</script>
