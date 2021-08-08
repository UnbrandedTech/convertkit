import path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

import pkg from './package.json'

export default {
    input: path.join(__dirname, 'src/index.js'),
    output: [
        {
            file: pkg.module,
            format: 'es'
        },
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'auto'
        }
    ],
    external: [
        'stream',
        'https',
        'zlib',
        'http',
        'url',
        'util'
    ],
    plugins: [
        resolve(),
        getBabelOutputPlugin({ configFile: path.resolve(__dirname, 'babel.config.js') }),
        commonjs({
            include: 'node_modules/axios/**'
        }),
    ]
}
