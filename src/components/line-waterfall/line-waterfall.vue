<template>
  <view class="u-waterfall">
    <view id="u-left-column" class="u-column">
      <slot name="left" :left-list="state.leftList"></slot>
    </view>
    <view id="u-right-column" class="u-column">
      <slot name="right" :right-list="state.rightList"></slot>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { watch, computed, onMounted, getCurrentInstance, h } from 'vue';
import { GetRect } from '@/utils/tool';
import useState from '@/hooks/useState';
interface Isprops {
  leftList?: any[];
  rightList?: any[];
  modelValue?: any[];
  addTime?: number;
  idKey?: string;
}
interface IsStateType {
  leftList: any[];
  rightList: any[];
  tempList: any[];
  children: any[];
}
const props = withDefaults(defineProps<Isprops>(), {
  modelValue: () => [],
  leftList: () => [],
  rightList: () => [],
  addTime: 0,
  idKey: 'id',
});
const emit = defineEmits(['update:modelValue', 'end']);
const { state, setData } = useState<IsStateType>({
  leftList: [],
  rightList: [],
  tempList: [],
  children: [],
});
const instance = getCurrentInstance();
const cloneData = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};
const copyFlowList = computed(() => {
  return cloneData(props.modelValue);
});
const clear = () => {
  state.leftList = [];
  state.rightList = [];
  state.tempList = [];
  emit('update:modelValue', []);
};
const splitData = async () => {
  if (!state.tempList.length) return;
  let leftRect: any = await GetRect('#u-left-column', instance);
  let rightRect: any = await GetRect('#u-right-column', instance);
  // 如果左边小于或等于右边，就添加到左边，否则添加到右边
  let item = state.tempList[0];
  // 解决多次快速上拉后，可能数据会乱的问题，因为经过上面的两个await节点查询阻塞一定时间，加上后面的定时器干扰
  // 数组可能变成[]，导致此item值可能为undefined
  if (!item) return;
  if (leftRect.height < rightRect.height) {
    const leftList = state.leftList;
    leftList.push(item);
    setData({ leftList });
  } else if (leftRect.height > rightRect.height) {
    const rightList = state.rightList;
    rightList.push(item);
    setData({ rightList });
  } else {
    // 这里是为了保证第一和第二张添加时，左右都能有内容
    // 因为添加第一张，实际队列的高度可能还是0，这时需要根据队列元素长度判断下一个该放哪边
    if (state.leftList.length <= state.rightList.length) {
      const leftList = state.leftList;
      leftList.push(item);
      setData({ leftList });
    } else {
      const rightList = state.rightList;
      rightList.push(item);
      setData({ rightList });
    }
  }
  // 移除临时列表的第一项
  state.tempList.splice(0, 1);
  // 如果临时数组还有数据，继续循环
  if (state.tempList.length) {
    setTimeout(() => {
      splitData();
    }, props.addTime);
  }
  emit('end');
};
// const splitData = () => {
//     if (!state.tempList.length) return;
//     let leftList: any[] = []
//     let rightList: any[] = []
//     state.tempList.map(item => {
//         if (leftList.length <= rightList.length) {
//             leftList.push(item)
//             return
//         } else {
//             rightList.push(item)
//         }

//     })
//     setData({ leftList, rightList })
// }
watch(
  () => copyFlowList.value,
  (nVal, oVal) => {
    // 取差值，即这一次数组变化新增的部分
    let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
    // 拼接上原有数据
    const tempList = state.tempList.concat(cloneData(nVal.slice(startIndex)));
    setData({ tempList });
    splitData();
  }
);
onMounted(() => {
  const tempList = cloneData(copyFlowList.value);
  setData({ tempList });
  splitData();
});
defineExpose({ clear });
</script>
<style lang="scss" scoped>
.u-waterfall {
  /* @include vue-flex; */
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.u-column {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: auto;
}

.u-image {
  width: 100%;
}
</style>
