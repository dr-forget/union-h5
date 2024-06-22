<template>
  <view :style="navBarstyle" class="nav-bar">
    <view v-if="!isshowSlot.isshowleftSlot && !isshowSlot.isshowcenterSlot" class="menu-nav" :style="{ height: useAppConfig.systemConfig.appletInfo.height + 'px' }">
      <view v-if="state.isback" class="nav-back">
        <line-icon name="nine9-fanhui f-bold f-34 inline-block" :style="{ color: state.navigationColor }"></line-icon>
      </view>
      <view :style="navbarCenter" class="nav-center flex items-center flex-center">
        <slot name="title">
          <text class="title f-30 f-middle">{{ state.title }}</text>
        </slot>
      </view>
    </view>
    <view v-if="isshowSlot.isshowleftSlot" class="left-full w-full" :style="leftFullWidth">
      <slot name="leftFull" :width="leftFullWidth.width"> </slot>
    </view>
    <view v-if="isshowSlot.isshowcenterSlot" :style="centerFullWidth">
      <slot name="centerFull" :width="leftFullWidth.width"> </slot>
    </view>
  </view>
</template>
<script setup lang="ts">
import useStore from '@/store';
import useState from '@/hooks/useState';
import { computed, CSSProperties, watch, useSlots, ref, onMounted, getCurrentInstance } from 'vue';

interface Isprops {
  title?: string;
  isback?: boolean;
  background?: string;
  navigationColor?: string;
  navigationbgImage?: string;
  iscustomPage?: boolean; //custom-page 组件因为默认传入  不能使用slot来判断  所以需要传入此参数
  leftSlot?: boolean;
  centerSlot?: boolean;
  fixed?: boolean; //是否采用固定定位
}

const { useAppConfig } = useStore();

const props = withDefaults(defineProps<Isprops>(), {
  title: '',
  isback: true,
  background: '#fff',
  navigationColor: '#333',
  navigationbgImage: '',
  leftSlot: false,
  centerSlot: false,
  iscustomPage: false,
});

const { state, setData } = useState<Isprops>({
  isback: props.isback,
  title: props.title,
  background: props.background,
  navigationColor: props.navigationColor,
});

const slots = ref(useSlots());
const instance = getCurrentInstance();

const isshowSlot = computed(() => {
  const obj = {
    isshowleftSlot: props.leftSlot,
    isshowcenterSlot: props.centerSlot,
  };
  // 如果是自定义组件 直接读props即可
  if (props.iscustomPage) {
    return obj;
  }
  if (props.title) {
    return {
      isshowleftSlot: false,
      isshowcenterSlot: false,
    };
  }
  return {
    isshowleftSlot: slots.value.leftFull,
    isshowcenterSlot: slots.value.centerFull,
  };
});

const navBarstyle = computed((): CSSProperties => {
  return {
    height: useAppConfig.systemConfig.navbarHeight + 'px',
    boxSizing: 'border-box',
    paddingTop: useAppConfig.systemConfig.appletInfo.top + 'px',
    border: '1px solid red',
    background: state.background,
    color: state.navigationColor,
    backgroundImage: props.navigationbgImage ? `url(${props.navigationbgImage})` : '',
    position: props.fixed ? 'fixed' : 'relative',
  };
});

const centerFullWidth = computed((): CSSProperties => {
  const rightPadding = useAppConfig.systemConfig.screenWidth - useAppConfig.systemConfig.appletInfo.left - useAppConfig.systemConfig.appletInfo.width;
  const width = useAppConfig.systemConfig.screenWidth - (useAppConfig.systemConfig.appletInfo.width + rightPadding) * 2;
  return {
    width: width + 'px',
    marginLeft: useAppConfig.systemConfig.appletInfo.width + rightPadding + 'px',
    // border:'1px solid red'
    // paddingRight: (useAppConfig.Appsystem.MenuButtonInfo.width + rightPadding) + 'px',
  };
});

const leftFullWidth = computed((): CSSProperties => {
  const rightPadding = useAppConfig.systemConfig.screenWidth - useAppConfig.systemConfig.appletInfo.left - useAppConfig.systemConfig.appletInfo.width;
  const width = useAppConfig.systemConfig.screenWidth - useAppConfig.systemConfig.appletInfo.width - rightPadding * 2;
  return {
    width: width + 'px',
    marginBottom: useAppConfig.systemConfig.appletInfo.bottom + 'px',
  };
});

const navbarCenter = computed((): CSSProperties => {
  const rightPadding = useAppConfig.systemConfig.screenWidth - useAppConfig.systemConfig.appletInfo.left - useAppConfig.systemConfig.appletInfo.width;
  const width = useAppConfig.systemConfig.screenWidth - (useAppConfig.systemConfig.appletInfo.width + rightPadding);
  return {
    width: width + 'px',
    // border:'1px solid red'
    // paddingRight: (useAppConfig.Appsystem.MenuButtonInfo.width + rightPadding) + 'px',
  };
});

onMounted(() => {
  const slot = useSlots();
  console.log(instance, 93);
});

watch([() => props.title, () => props.isback], ([title, isback]) => {
  setData({ title, isback });
});
// 背景颜色渐变
watch([() => props.background, () => props.navigationColor], ([background, navigationColor]) => {
  setData({ background, navigationColor });
});
</script>

<style lang="scss" scoped>
.menu-nav {
  box-sizing: border-box;
  display: flex;
  position: relative;
}

.nav-bar {
  z-index: 10076;
  box-sizing: border-box;
  background-size: 100% !important;
  position: reactive;
  left: 0;
  top: 0;
  width: 100%;
}

.nav-back {
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 12px;
}

.nav-center {
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.left-full {
  height: 100%;
}
</style>
