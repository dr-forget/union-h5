<template>
  <view class="relative">
    <view class="flex items-center flex-shrink custom-tabs" :class="{ relative: state.showDropList }" :style="{ background: state.background, zIndex: props.warpZindex }">
      <view class="flex-1" style="overflow: auto hidden">
        <scroll-view scroll-x class="scroll-view" scroll-with-animation :scroll-left="state.scrollLeft">
          <view class="flex items-center relative">
            <view
              v-for="(item, i) in state.tabList"
              :key="i"
              class="scroll-tab-item flex items-center flex-center"
              :class="[`scroll-item-${i}`, props.scrollable ? '' : 'flex-1']"
              @click="tabItemClick(i)"
            >
              <slot name="item" :item="item" :index="i" class="w-full">
                <view v-if="!item.tagImage" class="flex items-center flex-center">
                  <image v-if="item.programIcon" :src="item.programIcon" class="tabs-left-icon" @load="ImageLoad"> </image>
                  <text :class="state.currentIndex == i ? 'c-primary f-bold' : 'c-333'">{{ item.name }}</text>
                  <view v-if="item.sort_options" :style="{ backgroundImage: `url(${item.sortIcon || state.sortIcon})` }" class="sort-icon"></view>
                </view>
                <view v-else>
                  <image :src="item.tagImage" mode="heightFix" :style="{ height: (item.height || 36) + 'rpx' }" @load="ImageLoad"></image>
                </view>
              </slot>
            </view>
            <view
              v-if="props.isShowLine"
              class="active-line"
              :style="{ width: state.lineWidth + 'px', transform: `translateX(${state.lineOffsetLeft}px)`, transitionDuration: `${state.isFirst ? 0 : 300}ms` }"
            >
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- <view v-if="state.showDropList" class="" > -->
      <scroll-view class="drop-list drop-list-mark" :class="state.isAnimate ? 'max-height-show' : 'max-height-hide'" scroll-y>
        <view class="flex pb-24 px-12 flex-wrap" :style="{ background: props.dropbackgroud }">
          <slot name="drop">
            <view v-for="(item, i) in state.tabList" :key="i" class="drop-view py-12" @click="tabItemClick(i)">
              <view class="drop-item" :class="{ 'active-item': state.currentIndex == i }">
                <text class="f-28">{{ item.name }}</text>
              </view>
            </view>
          </slot>
        </view>
      </scroll-view>
      <!-- </view> -->
      <slot name="right"></slot>
    </view>
    <u-overlay :show="state.showDropList" :z-index="99" @click="emit('update:drop', false)"></u-overlay>
  </view>
</template>

<script setup lang="ts">
import useStore from '@/store';
import useHookData from './hook';
import { debounce } from 'lodash';
import { GetRect } from '@/utils/tool';
import { onMounted, watch, getCurrentInstance, nextTick } from 'vue';

interface Isprops {
  tabList: CustomTabItem[];
  currentIndex: number;
  isShowLine?: boolean;
  scrollable?: boolean;
  activeColor?: string;
  drop?: boolean;
  background?: string;
  dropbackgroud?: string;
  warpZindex?: number;
}

const props = withDefaults(defineProps<Isprops>(), {
  tabList: () => [],
  currentIndex: 0,
  isShowLine: true,
  scrollable: true,
  activeColor: '#333',
  background: 'transparent',
  drop: false,
  dropbackgroud: '#fff',
  warpZindex: 100,
});

const emit = defineEmits(['change', 'update:drop']);

const { state, setData, tabItemClick, allNodes } = useHookData(props, emit);

const { useAppConfig } = useStore();

const instance = getCurrentInstance();

const ImageLoad = debounce((e) => {
  allNodes(true);
}, 600);

const resize = async () => {
  const res = await GetRect('.scroll-view', instance);
  setData({
    scrollboxWidth: res.width,
    lineWidth: 0,
    itemnodes: [],
  });
};

onMounted(() => {
  // #ifdef H5
  resize();
  nextTick(() => {
    uni.$sleep(400, () => {
      tabItemClick(state.currentIndex);
    });
  });
  // #endif
});

watch(
  () => props.tabList,
  (val) => {
    state.tabList = val;
    resize();
    nextTick(() => {
      uni.$sleep(400, () => {
        tabItemClick(state.currentIndex);
      });
    });
  }
);
watch(
  () => props.currentIndex,
  (val) => {
    state.currentIndex = val;
    tabItemClick(state.currentIndex);
  }
);
watch(
  () => props.drop,
  (val) => {
    state.showDropList = val;
    nextTick(() => {
      state.isAnimate = val;
    });
  }
);
</script>

<style lang="scss" scoped>
.custom-tabs {
  height: 88rpx;
}

.scroll-view {
  -webkit-overflow-scrolling: touch;
  flex: 1;
}

.tabs-box {
  flex-wrap: nowrap;
}

.scroll-tab-item {
  padding: 0rpx 16rpx;
  flex-shrink: 0;
  height: 88rpx;
  box-sizing: border-box;
  /* overflow: hidden; */
  /* border: 1px solid transparent; */
}

.tabs-left-icon {
  width: 32rpx;
  height: 32rpx;
}

.active-line {
  position: absolute;
  left: 0;
  bottom: 8rpx;
  border-radius: 25rpx;
  height: 6rpx;
  background: rgb(255, 64, 13);
  width: 80rpx;
  z-index: 100;
}

.sort-icon {
  width: 20rpx;
  height: 80rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50%;
  border: 1px solid red;
}

.drop-list-mark {
  position: absolute;
  left: 0;
  top: 80rpx;
  right: 0;
  border-radius: 0rpx 0rpx 20rpx 20rpx;
  background: #fff;
  z-index: 100;

  .drop-list {
    width: 100%;
    width: 100%;
  }

  .drop-view {
    flex-wrap: wrap;
    width: 25%;
    /* border: 1px solid red; */
  }

  .drop-item {
    text-align: center;
    padding: 10rpx 0;
    margin: 0 10rpx;
    background: #fff;
    border-radius: 12rpx;
    border: 1px solid transparent;
  }

  .active-item {
    border: 1px solid $uni-color-primary;
    background: rgba(249, 123, 145, 0.15);
    color: $uni-color-primary;
    font-weight: bold;
  }
}

.max-height-hide {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
}

.max-height-show {
  max-height: 800rpx;
  overflow: hidden;
  transition: max-height 0.2s ease-in;
}
</style>
