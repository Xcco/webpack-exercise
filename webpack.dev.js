const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugin = []
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js' ))

    Object.keys(entryFiles)
        .map(i=>{
            const ef = entryFiles[i]
            const match = ef.match(/src\/(.*)\/index\.js/)
            const pageName = match && match[1]
            entry[pageName] = ef
            htmlWebpackPlugin.push(
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, `src/${pageName}/index.html`),
                    filename: `${pageName}.html`,
                    chunks: [pageName ],
                    inject: true,
                    minify: {
                        html5: true,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false,
                        preserveLineBreaks: false,
                        collapseWhitespace: true,
                    }
                }),
            )
        })
    return {
        entry,
        htmlWebpackPlugin
    }
}

const {
    entry,
    htmlWebpackPlugin
} = setMPA()

module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: 'file-loader'
            },
        ]
    }, 
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugin),
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    }
};
