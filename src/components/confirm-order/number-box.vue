<template>
  <view class="flex items-center number-box flex-end">
    <button v-if="state.value > 0" class="handle-item desc-item flex items-center flex-center" :class="{ 'handle-item-disabled': props.disabled }" @tap.stop="desc">
      <u-icon name="minus" color="#FA505A"></u-icon>
    </button>
    <view v-if="state.value > 0" class="modelValue mx-8">{{ state.value }} </view>
    <button class="handle-item add-item flex items-center flex-center" :class="{ 'disable-color': state.value >= state.max || state.disabled }" @tap.stop="add">
      <u-icon name="plus" color="#fff"></u-icon>
    </button>
  </view>
</template>
<script lang="ts" setup>
import useState from '@/hooks/useState';
import { throttle } from 'lodash';
import { watch } from 'vue';

interface Isprops {
  modelValue: number;
  max?: number;
  min?: number;
  disabled?: boolean;
  asyncChange?: boolean;
}

interface Isstate {
  value: number;
  max: number;
  disabled: boolean;
}

const props = withDefaults(defineProps<Isprops>(), {
  max: 9999,
  min: 1,
  disabled: true,
  modelValue: 0,
  asyncChange: false,
});

const emit = defineEmits(['update:modelValue', 'change', 'add']);

const { state, setData } = useState<Isstate>({
  value: props.modelValue,
  max: props.max,
  disabled: props.disabled,
});

const desc = () => {
  if (state.disabled) return;
  if (!props.asyncChange) {
    state.value = state.value - 1;
    change('desc');
  } else {
    emit('change', { value: state.value - 1, remark: 'desc' });
  }
};

const add = (event) => {
  if (state.disabled) return;
  if (state.value >= state.max) {
    return;
  }
  state.value = state.value + 1;
  emit('add', event);
  change('add');
};

const inputChange = throttle(() => {
  const value = parseInt(state.value.toString());
  if (value >= state.max) {
    state.value = state.max;
    change('change');
    return;
  }
  state.value = value || 0;
  change('change');
}, 500);

const change = (remark: string) => {
  // emit('update:modelValue', state.value);
  emit('change', { value: state.value, remark });
};

watch([() => props.max, () => props.disabled], ([max, disabled]) => {
  if (disabled) {
    state.value = 0;
  }
  setData({ max, disabled });
});
watch(
  () => props.modelValue,
  (val) => {
    state.value = val;
  }
);
</script>
<style lang="scss" scoped>
.number-box {
  width: 176rpx;
}

.handle-item {
  width: 52rpx;
  height: 52rpx;
  background: #f4f5f6;
  border-radius: 12rpx;
  padding: 0;
  margin: 0;
}
.handle-item::after {
  border: none;
}

.modelValue {
  min-width: 50rpx;
  text-align: center;
  flex-shrink: 0;
  input {
    max-width: 70rpx;
    background: #f4f5f6;
    height: 52rpx;
    border-radius: 8rpx;
  }
}

.add-item {
  background: $uni-color-primary;
  color: #fff;
  border: 1px solid transparent;
}

.disable-color {
  background: rgba($color: $uni-color-primary, $alpha: 0.5);
}

.desc-item {
  border: 1px solid $uni-color-primary;
}
</style>
