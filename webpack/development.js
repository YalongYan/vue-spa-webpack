const path = require("path");
const merge = require("webpack-merge");
const webpackConfigBase = require("./base.js");
const webpack = require('webpack')

const webpackConfigDev = {
    devtool: 'cheap-module-eval-source-map', // 指定加source-map的方式
    mode: 'development',
    devServer:{
        // 设置服务器访问的基本目录
        contentBase: path.resolve(__dirname,'../dist'), //最好设置成绝对路径
        // 设置服务器的ip地址,可以是localhost
        host: '127.0.0.1',
        // 设置端口
        port: 8080,
        // 设置自动拉起浏览器
        open: true,
        // 启用 webpack 的 模块热替换 功能 必须有HotModuleReplacementPlugin 才能完全开启
        hot: true,
        proxy: {
            '/goods':{
                target:'http://localhost:3000'
            },
            '/goods/*':{
              target:'http://localhost:3000'
            },
            '/users/**':{
              target:'http://localhost:3000'
            }
        }
    },
    // 不要开启watch : true 改动一点就自动刷新好烦人， 上面已经开启了webpack热替换功能 就不用全部刷新了。 
    // watch: true, // 开启监听文件更改，自动刷新
    watchOptions: {
        ignored: /node_modules/, // 忽略不用监听变更的目录
        aggregateTimeout: 500, // 防止重复保存频繁重新编译,500毫米内重复保存不打包
        poll:1000 // 每秒询问的文件变更的次数
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
}
module.exports = merge(webpackConfigBase, webpackConfigDev)