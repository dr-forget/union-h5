<template>
  <view>
    <view class="relative">
      <view @click="opendrop"><slot></slot></view>
      <view class="drop-list-meun" :class="{ active: state.isActive }">
        <view v-for="(item, i) in props.list" :key="i" class="py-12 t-center" hover-class="active-hover" @click="dropChange(item)">
          <view class="f-28 px-12">{{ item.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import useState from '@/hooks/useState';

interface Isprops {
  list: { name: string; value: any }[];
}
interface IsState {
  isActive: boolean;
}

const props = withDefaults(defineProps<Isprops>(), {
  list: () => [],
});

const emit = defineEmits(['onChange']);

const { state } = useState<IsState>({
  isActive: false,
});

const opendrop = () => {
  state.isActive = !state.isActive;
};

const dropChange = (val) => {
  emit('onChange', val);
  opendrop();
};
</script>
<style lang="scss" scoped>
.drop-list-meun {
  position: absolute;
  width: 100%;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 3rpx 6rpx rgba(0, 0, 0, 0.2);
  top: 102%;
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s ease;
  z-index: 99;
}
.active {
  max-height: 520rpx;
}
.active-hover {
  background: #f4f5f6;
  color: $uni-color-primary;
}
</style>
