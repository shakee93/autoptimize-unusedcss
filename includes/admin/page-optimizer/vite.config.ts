import {defineConfig} from "vite";
import {resolve} from "path";
import react from "@vitejs/plugin-react";
import {vitePlugin as utwm} from 'unplugin-tailwindcss-mangle'
// @ts-ignore
import packageJson from './package.json';
export default defineConfig((configEnv) => {
    const isDevelopment = configEnv.mode === "development";

    return {
        plugins: [react(), utwm({
            classSetOutput: true,
            classMapOutput: true
        })],
        define: {
            '__OPTIMIZER_VERSION__': JSON.stringify(packageJson.version),
        },
        base: "http://rapidload.local/",
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
            target: 'es2015',
            rollupOptions: {
                output: {
                    manualChunks: {
                        ['core-vendor']: [
                          'tailwind-merge'
                        ],
                        vendor: [
                            'prism-react-renderer',
                            '@tanstack/react-table',
                            '@radix-ui/react-toast',
                            '@radix-ui/react-select',

                        ]
                    },
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
