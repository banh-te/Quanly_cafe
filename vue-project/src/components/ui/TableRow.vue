<template>
  <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" v-bind="$attrs">
    <slot />
  </tr>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default { inheritAttrs: false }
</script>
