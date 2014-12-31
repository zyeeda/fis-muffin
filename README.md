# fis-muffin
FIS browerify 解决方案

## 特点
* `coffee`、`react`、`coffee&react` 语言支持
* `sass`、`less` 语言支持 
* 代码模块化，采用 Node 方式
* 代码库采用 npm 管理
* 所有 css 压缩打包成一个
* 所有 js 压缩打包成一个
* 图片优化压缩、碎小图片支持内嵌
* 发布后日志语句自动删除
* 发布目录整理，图片等静态资源的引入路径自动更改
* 支持 `watch` 方式开发 
* 支持在 js 中直接引入 css 
* 编译性能非常快

## 考虑
* 考虑支持编译预处理
* 考虑支持引入 amd 、cmd、node 、global 方式的代码库
* 考虑发布后支持三种引入方式 `requirejs-seed` 、`browserify-seed`、`global-seed`

## 使用
npm install -g fis-muffin

npm install -g fis-postpackager-autoload

npm install -g fis-postpackager-simple

mfn release

mfn server start
