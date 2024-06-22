<template>
  <view>${name}</view>
</template>
<script setup lang="ts">
interface Isprops {}
const props = withDefaults(defineProps<Isprops>(), {});
</script>
<style lang="scss" scoped></style>
