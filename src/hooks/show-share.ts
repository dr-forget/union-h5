import useStore from '@/store';
import { onShow, onUnload } from '@dcloudio/uni-app';
import { ProxyLevelEnum } from '@/enum/proxy';
export default function showShare() {
  const { useUserData } = useStore();
  onShow(() => {
    if (useUserData.userinfo.token) {
      uni?.showShareMenu?.();
    } else {
      try {
        // @ts-ignore
        uni?.hideShareMenu?.();
      } catch (err) {
        console.log(err, 10);
      }
    }
  });
  onUnload(() => {
    uni.offCopyUrl?.();
  });
}
