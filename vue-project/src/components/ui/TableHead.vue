<template>
  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" v-bind="$attrs">
    <slot />
  </th>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default { inheritAttrs: false }
</script>
