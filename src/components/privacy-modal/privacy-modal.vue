<template>
  <u-modal :show="useAppConfig.privacymodal" title="用户隐私保护提示" width="600rpx">
    <view class="c-999 f-28">
      感谢您使用本小程序，在使用前您应当阅读并同意
      <text class="c-url" @tap.stop="useAgreement">《用户隐私保护指引》</text>
      当点击同意并继续时，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力；如您不同意，将无法继续使用小程序相关功能
    </view>
    <template #confirmButton>
      <view class="flex flex-between items-center">
        <view class="btn-class flex-1">
          <u-button shape="circle" @click="cancelPrivacy">取消</u-button>
        </view>
        <view class="mx-24"></view>
        <view class="btn-class flex-1">
          <u-button type="primary" shape="circle" throttle-time="300" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="agreePrivacy">同意</u-button>
        </view>
      </view>
    </template>
  </u-modal>
</template>
<script setup lang="ts">
import lineHook from '@/hooks/uni-hook';
import useStore from '@/store';
import { WebviewUrl, inquire_webview_link } from '@/enum/comm';

const { useAppConfig } = useStore();

const { Toast, router } = lineHook();

const emit = defineEmits(['confirm', 'cancel']);

const cancelPrivacy = () => {
  emit('cancel');
  useAppConfig.privacymodal = false;
};

const agreePrivacy = (e) => {
  if (e.detail.errMsg == 'agreePrivacyAuthorization:ok') {
    useAppConfig.privacymodal = false;
    emit('confirm');
    return;
  }
  Toast(e.detail.errMsg);
};

// 用户协议
const useAgreement = () => {
  router.to(`/pages/webview/webview?src=${inquire_webview_link(WebviewUrl.USER_AGREEMENNET)}`);
};
</script>

<style lang="scss" scoped>
.c-url {
  color: #053ebf;
}
</style>
