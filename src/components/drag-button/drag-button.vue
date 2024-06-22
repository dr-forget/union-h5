<template>
  <view
    v-show="state.showbtn"
    id="_drag_button"
    class="drag"
    :style="{ left: state.left + 'px', top: state.top + 'px', zIndex: props.zIndex }"
    @touchmove.stop.prevent="touchmove"
    @touchend="touchend"
    @click="clickEvent"
  >
    <slot></slot>
  </view>
</template>
<script setup lang="ts">
import useState from '@/hooks/useState';
import useStore from '@/store';
import { GetRect } from '@/utils/tool';
import { onMounted, getCurrentInstance, nextTick } from 'vue';
interface Isprops {
  isDock: boolean;
  existTabBar?: boolean;
  top?: number;
}
interface Isstate {
  top: number;
  left: number;
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
  windowWidth: number;
  windowHeight: number;
  isMove: boolean;
  edge: number;
  text: string;
  showbtn: boolean;
  zIndex?: number;
}
const instance = getCurrentInstance();
const emit = defineEmits(['click']);
const { useAppConfig } = useStore();
const props = withDefaults(defineProps<Isprops>(), {
  isDock: false,
  existTabBar: false,
  isCustomPage: false,
  top: 0,
  zIndex: 10075,
});
const { state, setData } = useState<Isstate>({
  top: useAppConfig.systemConfig.windowHeight,
  left: 0,
  width: 0,
  height: 0,
  offsetWidth: 0,
  offsetHeight: 0,
  windowWidth: 0,
  windowHeight: 0,
  isMove: true,
  edge: uni.upx2px(20), //安全边距
  text: '按钮',
  showbtn: false,
});
onMounted(async () => {
  const windowHeight = useAppConfig.systemConfig.windowHeight - useAppConfig.systemConfig.navbarHeight - props.top || 0;
  const area = useAppConfig.systemConfig.safeAreaInsets?.bottom || 0;
  setData({
    windowWidth: useAppConfig.systemConfig.windowWidth,
    windowHeight: windowHeight + useAppConfig.systemConfig?.windowTop,
  });
  const reslut: any = await GetRect('#_drag_button', instance);
  setData({
    width: reslut.width,
    height: reslut.height,
    offsetWidth: reslut.width / 2,
    offsetHeight: reslut.height / 2,
    left: state.windowWidth - reslut.width - state.edge,
    // #ifdef H5
    top: state.windowHeight - reslut.height - state.edge + useAppConfig.systemConfig.navbarHeight - 54,

    // #endif
    // #ifndef H5
    // @ts-ignore
    top: state.windowHeight - reslut.height - state.edge + useAppConfig.systemConfig.navbarHeight - area,
    // #endif
  });
  nextTick(() => {
    state.showbtn = true;
  });
});
const clickEvent = () => {
  emit('click');
};
const touchmove = (e) => {
  // 单指触摸
  if (e.touches.length !== 1) {
    return false;
  }

  state.isMove = true;
  const left = e.touches[0].clientX - state.offsetWidth;

  state.left = left < 0 ? 0 : left;

  let clientY = e.touches[0].clientY - state.offsetHeight;
  // #ifdef H5
  clientY += state.height;
  // #endif
  let edgeBottom = state.windowHeight - state.height - state.edge + useAppConfig.systemConfig.navbarHeight;
  // #ifdef H5
  edgeBottom = edgeBottom - 54;
  // #endif

  // 上下触及边界
  if (props.isCustomPage && clientY < useAppConfig.systemConfig.navbarHeight) {
    state.top = useAppConfig.systemConfig.navbarHeight;
  } else if (clientY < state.edge) {
    state.top = state.edge;
  } else if (clientY > edgeBottom) {
    state.top = edgeBottom;
  } else {
    state.top = clientY;
  }
};
const touchend = () => {
  if (props.isDock) {
    let edgeRigth = state.windowWidth - state.width - state.edge;

    if (state.left < state.windowWidth / 2 - state.offsetWidth) {
      state.left = state.edge < 0 ? 0 : state.edge;
    } else {
      state.left = edgeRigth < 0 ? 0 : edgeRigth;
    }
  }

  state.isMove = false;
};
</script>
<style lang="scss" scoped>
.drag {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;

  &.transition {
    transition: left 0.3s ease, top 0.3s ease;
  }
}
</style>
