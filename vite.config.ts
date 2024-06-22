import { defineConfig } from 'vite';
import { resolve } from 'path';
import * as pkg from './package.json';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: command == 'serve' ? '/' : `https://storage.szline9.com/frontend/unionh5/${pkg.version}`,
}));
