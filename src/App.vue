<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
onLaunch((opts: any) => {
  const query = opts.query;
  if (query.uid) {
    uni.setStorageSync('uid', query.uid);
  }
  uni.setStorageSync('is_proxy', +query?.is_proxy || 2);

  uni.setStorageSync('host', query.env == 'dev' ? 'http://debian.hhshsq.cn:9701' : 'https://debian.hhshsq.cn:9702');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style>
page {
  background: #f4f5f7;
  font-family: 'PingFang SC', 'Microsoft YaHei', arial, 'Hiragino Sans GB', 'Hiragino Sans GB W3';
}
.safe-area-inset-bottom {
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  /* height: calc(100vh - env(safe-area-inset-bottom)); */
}
</style>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-plus/index.scss';
@import '@/static/style/globa.scss';
</style>
