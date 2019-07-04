const merge = require('webpack-merge')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const base = require('./base')
// 用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题
const TerserJSPlugin = require('terser-webpack-plugin')
// 清空dist目录
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge.smart(base, {
  mode: 'production',
  // entry: path.resolve(__dirname, '../src/main.js'),
  // output: {
  //     filename: '[name].[hash:8].js',
  //     path: path.resolve(__dirname, '../dist'),
  //     publicPath: ''
  // },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: 4,
        terserOptions: {
          output: {
            comments: false
          }
        }
      }), 
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      })
    ]
  },
  module: {
    // rules:[
    //   {
    //     test: /\.(scss|css)$/,
    //     use: [
    //       {
    //         loader: MiniCssExtractPlugin.loader
    //       },
    //       'css-loader'
    //     ]
    //   }
    // ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['main', 'vendors'],
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html')
    }),
    new CopyWebpackPlugin(
      [{
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }]
    ),
    new CleanWebpackPlugin(['dist']), //实例化，参数为目录
    // new MiniCssExtractPlugin({
    //   filename: '[name].[hash].css',
    //   chunkFilename: '[id].[hash].css',
    // }),
    // 开启打包分析
    new BundleAnalyzerPlugin()
  ]
})



