module.exports = {
    entry: {
        'sample': './sample/script/sample.tsx',
        'ReactSample': './sample/script/ReactSample',
        'FocusOutShellSample': './sample/script/FocusOutShellSample'
    },
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: __dirname + '/sample/script',
        publicPath: '/sample/script/',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.svg', '.'],
        modules: [
            './packages',
            './node_modules'
        ]
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.svg$/,
                loader: 'url-loader',
                options: {
                    mimetype: 'image/svg+xml'
                }
            }
        ]
    },
    watch: true,
    stats: "minimal",
    devServer: {
        host: "0.0.0.0", // This makes the server public so that others can test by http://hostname ...
        port: 3003,
        open: true,
        openPage: "sample",
        public: "localhost:3003"
    }
}