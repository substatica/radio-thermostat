// webpack.config.js

const webpack = require('webpack')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('dotenv').config({ path: './config.env' }); 

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, "build"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ]
    },
    mode: "production",
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Radio Thermostat',
            template: "public/index.html",
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env),
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static' }
            ]
        })
    ],
    devServer: {
        proxy: {
            '/tstat': {
                 target: 'http://localhost:8080',
                 router: () => `http://${process.env.THERMOSTAT_IP_ADDRESS}`,
            }
         }
    }
};