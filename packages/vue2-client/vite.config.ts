import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';

export default defineConfig({
  plugins: [createVuePlugin()],
  server: {
    port: 8080
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@platform8/web-ui/src/styles/_variables.scss";`
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false
  },
  define: {
    'process.env': process.env
  }
});
