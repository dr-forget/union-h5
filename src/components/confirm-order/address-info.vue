<template>
  <view class="w-full">
    <view class="flex items-center">
      <view class="mr-16">
        <line-icon name="nine9-a-zu12874 c-primary f-48"></line-icon>
      </view>
      <view class="w-full" :class="{ 'flex items-center': !state.address }">
        <view v-if="!state.address" class="f-32">请手动添加地址</view>
        <view v-else class="f-32 u-line-2">
          <text>{{ state.name }},</text>
          <text class="ml-16">{{ state.mobile }},</text>
          <text class="ml-12">{{ state.address }}</text>
        </view>
      </view>
      <view v-if="props.isArrow" class="ml-16">
        <u-icon name="arrow-right"></u-icon>
      </view>
    </view>
    <slot></slot>
  </view>
</template>
<script lang="ts" setup>
import useState from '@/hooks/useState';
import { watch } from 'vue';
interface Isprops {
  name: string;
  mobile: string;
  address: string;
  isArrow?: boolean;
}

interface Isstate {
  name: string;
  mobile: string;
  address: string;
}

const props = withDefaults(defineProps<Isprops>(), {
  name: '',
  mobile: '',
  address: '',
  isArrow: true,
});

const { state, setData } = useState<Isstate>({
  name: props.name,
  mobile: props.mobile,
  address: props.address,
});

watch([() => props.name, () => props.mobile, () => props.address], ([name, mobile, address]) => {
  setData({ name, mobile, address });
});
</script>
