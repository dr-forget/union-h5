<template>
  <view>
    <u-skeleton :rows="useAppConfig.systemConfig.rows" :loading="state.pageLoading" :title="false">
      <slot></slot>
      <slot name="content" :navbar-height="useAppConfig.systemConfig.navbarHeight"></slot>
      <view v-if="props.safeAreaInsetBottom" class="safe-area-inset-bottom"></view>
    </u-skeleton>
  </view>
</template>
<script lang="ts" setup>
import useStore from '@/store';
import useState from '@/hooks/useState';
import { provide, watch } from 'vue';
interface Isprops {
  state?: any;
  loading?: boolean;
  safeAreaInsetBottom?: boolean;
}

interface StateType {
  pageLoading: boolean;
}
const { useAppConfig } = useStore();

const props = withDefaults(defineProps<Isprops>(), {
  state: {},
  safeAreaInsetBottom: true,
  loading: false,
});

provide('state', props.state);

const { state } = useState<StateType>({ pageLoading: props.loading });

watch(
  () => props.loading,
  (val) => {
    state.pageLoading = val;
  }
);
</script>
