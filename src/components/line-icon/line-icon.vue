<template>
  <view :class="`relative ${customClass}`" @click="clickEvent">
    <text v-if="!props.colour" :class="`nine9 ${props.name} ${props.class}`" :style="props.csstyle"></text>
    <text v-else :class="`lin9applet-color ${props.name} ${props.class}`" :style="props.csstyle"></text>
  </view>
</template>
<script setup lang="ts">
interface Isprops {
  name?: string;
  class?: string;
  colour?: boolean;
  customClass?: string;
  csstyle?: any;
}
const props = withDefaults(defineProps<Isprops>(), {
  name: '',
  class: '',
  colour: false,
  customClass: 'inline-block',
  csstyle: {},
});
const emit = defineEmits(['click']);
const clickEvent = () => {
  emit('click');
};
</script>
<style lang="scss" scoped>
.content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
</style>
