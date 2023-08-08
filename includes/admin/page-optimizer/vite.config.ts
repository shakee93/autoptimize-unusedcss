import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { vitePlugin as utwm } from 'unplugin-tailwindcss-mangle'

export default defineConfig((configEnv) => {
  const isDevelopment = configEnv.mode === "development";

  return {
    plugins: [react(), utwm({
      classSetOutput: true,
      classMapOutput: true
    })],
    resolve: {
      alias: {
        app: resolve(__dirname, "src", "app"),
        components: resolve(__dirname, "src", "components"),
        '@/components': resolve(__dirname, "src", "components"),
        hooks: resolve(__dirname, "src", "hooks"),
        lib: resolve(__dirname, "src", "lib"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    },
    css: {
      modules: {
        hashPrefix: 'rl---',
        generateScopedName: true
          ? "[name]__[local]__[hash:base64:5]"
          : "[hash:base64:5]",
      },
    },
  };
});
