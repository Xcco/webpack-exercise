const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')


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
                    chunks: [pageName],
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
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins:()=> [
                                require('autoprefixer')({
                                    browsers: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    {
                        loader:'file-loader',
                        options: {
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            },
        ]
    }, 
    plugins: [
        new MiniCssExtractPlugin({
            filename:'[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://unpkg.com/react@16/umd/react.development.js',
        //             global: 'React',
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
        //             global: 'ReactDom',
        //         }
        //     ]
        // }),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugin),
    devtool: 'source-map'
};
