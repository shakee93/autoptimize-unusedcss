import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import inject from 'rollup-plugin-inject'; // <-- add this line

export default {
    input: 'src/index.ts',
    output: {
        // dir: 'dist',
        file: './dist/page-optimizer-data.min.js',
        format: 'iife',
        name: 'RapidLoad',
        intro: 'window.rapidload = window.rapidload || {};',
    },
    plugins: [
        json(),
        resolve({
            preferBuiltins: false, // Disable the preference for built-in modules
        }),
        commonjs({
            requireReturnsDefault: 'auto', // <---- this solves default issue
        }),
        typescript({
            include: ["src/**/*.ts", "types.d.ts"]
        }),
        terser(),
        nodePolyfills(),
    ],
    external: [],
};
