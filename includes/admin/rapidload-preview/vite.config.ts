import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const isDevelopment = configEnv.mode === "development";
  const generateSourceMaps = process.env.GENERATE_SOURCE_MAPS === 'true';
  const outDir = generateSourceMaps ? 'dist-debug' : 'dist';
  return{
    plugins: [react()],
    build: {
      outDir: outDir,
      sourcemap: generateSourceMaps,
      rollupOptions: {
        output: {
          manualChunks: {
            ['core-vendor']: [
              'react',
              'react-dom',
            ],
            vendor: [

            ],
            animations: [

            ],
          },
          // entryFileNames: `assets/[name].js`,
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    },
  }
})
