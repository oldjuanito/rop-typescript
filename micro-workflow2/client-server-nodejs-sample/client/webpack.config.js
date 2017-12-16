module.exports = {
    devtool: 'inline-source-map',
    entry: './src/client.ts',
    output: {
        filename: './dist/scripts/app-bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            { test: /_test\.ts$/, loader: 'ignore-loader' },
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}