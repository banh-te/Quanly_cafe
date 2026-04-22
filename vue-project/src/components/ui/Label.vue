<template>
  <label
    :class="[
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      $attrs.class
    ]"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
