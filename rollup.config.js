import path from 'path'
import ts from 'rollup-plugin-typescript2'
import nodeResolve from "@rollup/plugin-node-resolve";
export default {
    input: './src/index.ts',
    output: {
        format: 'umd',
        name: 'Vue',
        file: path.resolve('dist/vue.js'),
        sourceMap: true
    },
    plugins: [
        ts({
            tsconfig: path.resolve('tsconfig.json')
        }),
        nodeResolve({
            extensions: ['.js', '.js']
        })
    ]
}