  const path = require('path');       // node路径模块
  const HTMLWebpackPlugin = require('html-webpack-plugin');   // HTML导出模块
  const VueLoaderPlugin = require('vue-loader/lib/plugin');   // vue解析模块
  const MiniCssExtractPlugin = require("mini-css-extract-plugin") ;   // css提取模块
  
  module.exports = {
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          '@': path.resolve(__dirname, '../src'),
          'vue$': 'vue/dist/vue.esm.js'// 这个去掉就报错 加上吧
        }
      },
      entry: path.resolve(__dirname, '../src/main.js'),
      output: {
          filename: 'static/js/[name].[hash:8].js',
          path: path.resolve(__dirname, '../dist'),
          publicPath: ''
      },
      plugins: [
          new VueLoaderPlugin(),  // vue解析器
          new MiniCssExtractPlugin({ // 提取样式到单独的文件中
              filename: "static/css/[name].[hash:8].css",
              chunkFilename: "[id][hash].css"
          }),
          new HTMLWebpackPlugin({
            filename: 'index.html', // 生成到dist目录下的html文件名称，支持多级目录（eg: `${item.page}/index.html`）
            template: path.resolve(__dirname, '../index.html'), // 模板文件，不同入口可以根据需要设置不同模板
            minify: {
                collapseWhitespace: true,    // 压缩空白
                removeAttributeQuotes: true  // 删除属性双引号
            }
          })
      ],
      module: {
          // 对于性能开销大的loader 增加 cache-loader 把结果缓存到磁盘中 可以提高构建速度
          rules: [
              {
                  test: /\.vue$/,
                  exclude: /node_modules/,
                  use: [
                    'cache-loader',
                    'vue-loader'
                  ]
              },
              {
                  test: /\.css$/,
                  exclude: /node_modules/,
                  include: path.join(__dirname, '../src'),
                  use: [
                      {
                          loader: MiniCssExtractPlugin.loader, // 提取scss为单独的样式文件\
                          options: {
                          }
                      }, 
                      'css-loader',
                      'postcss-loader'
                  ]
              },
              // {
              //     test:/\.less$/,
              //     exclude: /node_modules/,
              //     include: path.join(__dirname, '../src'),
              //     use:[
              //         {
              //             loader: MiniCssExtractPlugin.loader, // 提取less为单独的样式文件\
              //             options: {
              //                 publicPath: '../'
              //             }
              //         }, 
              //         'css-loader',
              //         'postcss-loader',
              //         'less-loader'
              //     ] 
              // },
              {
                  test: /\.js$/,
                  exclude: /node_modules/,
                  include: path.join(__dirname, '../src'),
                  use: [
                        'cache-loader',
                        'babel-loader'
                    ]
              },
              {
                  test: /\.(png|jpg|jpeg|gif)$/,
                  exclude: /node_modules/,
                  include: path.join(__dirname, '../src'),
                  use: [{
                      loader: "url-loader",
                      options: {
                          name: 'static/img/[name].[hash:7].[ext]',
                          limit: 10000, // 表示小于10kb的图片转为base64，否则为路径
                          outputPath: "images"
                      }
                  },
                {	//压缩图片要在url-loader之后使用
                  loader:'image-webpack-loader',
                      options:{
                          bypassOnDebug: true
                      }
                }]
              },
              {
                  test: /\.(eot|svg|ttf|woff)$/,
                  exclude: /node_modules/,
                  include: path.join(__dirname, '../src'),
                  use: ['url-loader']
              }
          ]
      },
      // 对控制台输出日志的简化
      stats: {
          modules: false, // 是否添加构建模块信息
          children: false // 是否添加 children 信息
      }
  }