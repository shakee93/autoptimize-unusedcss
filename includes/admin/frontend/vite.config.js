import { fileURLToPath, URL } from 'node:url'
import {dynamicBase} from "vite-plugin-dynamic-base";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  alias: {
    '@tailwindcss': 'tailwindcss/tailwind.css',
  },
  plugins: [
      vue(),
    dynamicBase({
      publicPath : 'window.rapidload_admin.frontend_base'
    }),

  ],
  base: "/__dynamic_base__/",
  mode: 'es2015',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@tailwindcss': 'tailwindcss/tailwind.css',
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].min.js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
})
