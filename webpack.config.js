const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin'); // Плагин для Html страниц
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // Плагин для очистки папки dist от неиспользуемых файлов
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Плагин для копирования файлов из src в dist
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Плагин для преобразование css в файл
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // Минификация css файлов
const TerserWebpackPlugin = require('terser-webpack-plugin'); // Минификация js файлов

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const optimization = () => {
    const config =  {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProduction) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const filename = ext => isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = ext => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDevelopment,
                reloadAll: true,
            },
        },
        'css-loader'
    ]

    if (ext) {
        loaders.push(ext);
    }

    return loaders;
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]

    if (isDevelopment) {
        loaders.push('eslint-loader');
    }

    return loaders;
}

const babelOptions = (preset) => {
    const options = {
        presets: [
            '@babel/preset-env'
        ]
    }

    if (preset) {
        options.presets.push(preset);
    }

    return options;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: ['@babel/polyfill','./index.js']
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDevelopment
    },
    devtool: isDevelopment ? 'source-map' : '',
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProduction,
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript'),
                }
            }
        ]
    }
}