<template>
  <u-popup title="选择地区" closeable round="16rpx" :show="state.showmodal" @close="emit('update:modelValue', false)">
    <view class="w-full py-32">
      <picker-view v-if="!state.loading" :indicator-style="state.indicatorStyle" :value="state.selectKeys" style="height: 500rpx; width: 100%" immediate-change @change="pickerChange">
        <picker-view-column>
          <view v-for="(item, i) in state.citysarr" :key="i" class="flex items-center flex-center f-28">
            <text class="u-line-1">{{ item.name }} </text>
          </view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item, i) in state.citys" :key="i" class="flex items-center flex-center f-28">
            <text class="u-line-1">{{ item.name }}</text>
          </view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item, i) in state.streets" :key="i" class="flex items-center flex-center f-28">
            <text class="u-line-1">{{ item.name }} </text>
          </view>
        </picker-view-column>
      </picker-view>
    </view>
    <view class="flex items-center flex-center px-80 mb-24 mt-32">
      <view class="flex-1">
        <u-button type="info" shape="circle" @click="emit('update:modelValue', false)">取消</u-button>
      </view>
      <view class="flex-1 ml-36">
        <u-button type="primary" shape="circle" @click="confirm">确定</u-button>
      </view>
    </view>
  </u-popup>
</template>
<script setup lang="ts">
import useHookData from './hooks';
import { onMounted, watch } from 'vue';

interface Isprops {
  modelValue: boolean;
}

const props = withDefaults(defineProps<Isprops>(), {
  modelValue: false,
});

const { state, onGetprovinceAndcity, designateCity } = useHookData(props);

const emit = defineEmits(['update:modelValue', 'change']);

watch(
  () => props.modelValue,
  (val) => {
    state.showmodal = val;
  }
);

const pickerChange = (e) => {
  const [provinceIndex, cityIndex, streetIndex] = e.detail.value;
  const [oldprovinceIndex, oldcityIndex, oldstreetIndex] = state.selectKeys;
  if (provinceIndex !== oldprovinceIndex) {
    state.selectKeys = [provinceIndex, 0, 0];
  }
  if (cityIndex !== oldcityIndex) {
    state.selectKeys = [provinceIndex, cityIndex, 0];
  }
  if (streetIndex !== oldstreetIndex) {
    state.selectKeys = [provinceIndex, cityIndex, streetIndex];
  }
  const { cityArr, streetArr } = designateCity();
  state.citys = cityArr;
  state.streets = streetArr;
};

const confirm = () => {
  const [provinceIndex, cityIndex, streetIndex] = state.selectKeys;
  // const { provinceArr, cityArr, streetArr } = designateCity();
  const data = [state.citysarr[provinceIndex], state.citys[cityIndex], state.streets[streetIndex]];
  emit('change', data);
};

onMounted(() => {
  onGetprovinceAndcity();
});
</script>
