import { createSSRApp } from 'vue';
import uviewPlus from 'uview-plus';
import App from './App.vue';
import uniExtends from '@/utils/uni.extends';
export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus);
  Object.keys(uniExtends).map((item) => {
    uni[`$${item}`] = uniExtends[item];
    app.config.globalProperties[`$${item}`] = uniExtends[item];
  });
  return {
    app,
  };
}
