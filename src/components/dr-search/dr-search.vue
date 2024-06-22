<template>
  <view class="dr-search-box flex items-center bg-white" :style="{ height: props.height }">
    <input
      v-if="!props.disabled"
      v-model="state.searchKey"
      type="text"
      class="flex-1"
      confirm-type="search"
      :focus="props.focus"
      :placeholder="props.placeholder"
      @input="inputChange"
      @confirm="$emit('search', state.searchKey)"
    />
    <view v-else class="c-999 w-full pl-24 t-left" @click="emit('click')">{{ props.placeholder }}</view>
    <view class="flex-shrink flex items-center search-box-btn mr-4">
      <line-icon v-if="state.searchKey" name="nine9-a-guanbixiao1 f-40 c-999 mr-8" @click="clearInput"></line-icon>
      <view class="flex items-center flex-center search-btn" @click="$emit('search', state.searchKey)">
        <u-icon name="search" size="42rpx" color="#fff"></u-icon>
        <text>搜索</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import useState from '@/hooks/useState';
import { watch } from 'vue';
interface Isprops {
  placeholder: string;
  height?: string;
  disabled?: boolean;
  modelValue?: string;
  focus?: boolean;
}

const props = withDefaults(defineProps<Isprops>(), {
  placeholder: '',
  disabled: false,
  modelValue: '',
  height: '64rpx',
  focus: false,
});

const emit = defineEmits(['click', 'search', 'clean', 'update:modelValue']);

const { state } = useState({
  searchKey: props.modelValue,
});

const inputChange = () => {
  emit('update:modelValue', state.searchKey);
};
const clearInput = () => {
  state.searchKey = '';
  emit('update:modelValue', '');
  emit('clean');
};

watch(
  () => props.modelValue,
  (val) => {
    state.searchKey = val;
  }
);
</script>

<style lang="scss" scoped>
.dr-search-box {
  border: 1px solid $u-primary;
  width: 100%;
  border-radius: 40rpx;
  height: 64rpx;
  font-weight: normal;
  box-sizing: border-box;

  input {
    /* border: 1px solid red; */
    text-align: left;
    font-size: 28rpx;
    padding: 0 0rpx 0 28rpx;
  }

  .search-box-btn {
    /* height: 56rpx; */
    height: 100%;
  }

  .search-btn {
    background: $u-primary;
    color: #fff;
    border-radius: 50rpx;
    min-width: 130rpx;
    box-sizing: border-box;
    height: calc(100% - 8rpx);
    padding: 0rpx 20rpx;
    /* height: 56rpx; */
    /* padding: 6rpx 18rpx; */
  }
}
</style>
