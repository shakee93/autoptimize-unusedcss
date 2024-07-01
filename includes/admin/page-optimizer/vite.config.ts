import {defineConfig} from "vite";
import {resolve} from "path";
import react from "@vitejs/plugin-react";
// @ts-ignore
import packageJson from './package.json';
import {dynamicBase} from "vite-plugin-dynamic-base";
export default defineConfig((configEnv) => {
    const isDevelopment = configEnv.mode === "development";
    const generateSourceMaps = process.env.GENERATE_SOURCE_MAPS === 'true';
    const outDir = generateSourceMaps ? 'dist-debug' : 'dist';

    const getBasePath = () => {
        return typeof window !== 'undefined' && window.rapidload_optimizer && window.rapidload_optimizer.page_optimizer_package_base
            ? window.rapidload_optimizer.page_optimizer_package_base
            : "/";
    };

    return {
        base: process.env.NODE_ENV === "production" ? "/__dynamic_base__/" : "/",
        plugins: [
            react(),
            dynamicBase({
                publicPath: getBasePath(),
                transformIndexHtml:  false
            })
        ],
        define: {
            '__OPTIMIZER_VERSION__': JSON.stringify(packageJson.version),
        },
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
            outDir: outDir,
            sourcemap: generateSourceMaps,
            rollupOptions: {
                output: {
                    manualChunks: {
                        ['core-vendor']: [
                            'react',
                            'react-dom',
                            'tailwind-merge',
                            'webfontloader'
                        ],
                        vendor: [
                            'prism-react-renderer',
                            '@tanstack/react-table',
                            '@radix-ui/react-toast',
                            '@radix-ui/react-select',
                            'focus-lock'
                        ],
                        animations: [
                            'framer-motion',
                        ],
                    },
                    // entryFileNames: `assets/[name].js`,
                    entryFileNames: `assets/[name].js`,
                    chunkFileNames: `assets/[name].js`,
                    assetFileNames: `assets/[name].[ext]`
                }
            }
        },
    };
});
