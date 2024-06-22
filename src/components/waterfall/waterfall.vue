<template>
  <view class="waterfall">
    <view class="waterfall_col">
      <view v-for="(item, index) in state.columnData" :key="index" class="waterfall-item">
        <slot v-if="index % 2 == 0" name="left" :item="item" :index="index"></slot>
      </view>
    </view>
    <view class="waterfall_col">
      <view v-for="(item, i) in state.columnData" :key="i" class="waterfall-item">
        <slot v-if="i % 2 !== 0" name="left" :item="item" :index="i"></slot>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import useState from '@/hooks/useState';
import { watch, nextTick, getCurrentInstance } from 'vue';
import { GetRect } from '@/utils/tool';

interface IsProps {
  modelValue: any[];
}
interface IsState {
  columnData: any[];
}

const props = withDefaults(defineProps<IsProps>(), {
  modelValue: () => [],
});

const { state } = useState<IsState>({
  columnData: [],
});

watch(
  () => props.modelValue,
  (val) => {
    state.columnData = val;
  },
  {
    immediate: true,
  }
);
</script>
<style lang="scss" scoped>
.waterfall {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
}
</style>
