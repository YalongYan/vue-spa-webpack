// 自动添加CSS浏览器前缀，配置文件，设置支持的浏览器类型
// 需要安装 postcss-loader autoprefixer 两个插件
module.exports = {
    plugins: [
        require('autoprefixer')({
            "`overrideBrowserslist`": [
                "defaults",
                "not ie < 11",
                "last 2 versions",
                "> 1%",
                "iOS 7",
                "last 3 iOS versions"
            ]
        })
    ]
}