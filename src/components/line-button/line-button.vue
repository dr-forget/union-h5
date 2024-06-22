<template>
  <button :class="classes" @click="handleClick">
    <view class="line9-button__warp">
      <slot></slot>
    </view>
  </button>
</template>
<script lang="ts" setup>
import { computed, defineProps, PropType, toRefs } from 'vue';
export type ButtonType = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
export type ButtonSize = 'large' | 'normal' | 'small' | 'mini';
export type ButtonShape = 'square' | 'round';
interface IsProps {
  shape?: ButtonShape;
  plain?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: ButtonType;
  size?: ButtonSize;
  block?: boolean;
}
const emit = defineEmits(['click']);
const props = withDefaults(defineProps<IsProps>(), {
  shape: 'round',
  plain: false,
  loading: false,
  disabled: false,
  type: 'default',
  size: 'normal',
  block: false,
});
const { type, size, shape, disabled, loading, plain, block } = toRefs(props);

const classes = computed(() => {
  const prefixCls = 'line9-button';
  const obj = {
    [prefixCls]: true,
    [`${prefixCls}--${type.value}`]: type.value,
    [`${prefixCls}--${size.value}`]: size.value,
    [`${prefixCls}--${shape.value}`]: shape.value,
    [`${prefixCls}--plain`]: plain.value,
    [`${prefixCls}--disabled`]: disabled.value,
    [`${prefixCls}--loading`]: loading.value,
  };
  return obj;
});
const handleClick = (event: MouseEvent) => {
  if (!loading.value && !disabled.value) {
    emit('click', event);
  }
};
</script>
<style lang="scss" scoped>
@import './line-button.scss';
</style>
