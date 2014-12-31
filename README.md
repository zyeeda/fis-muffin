# fis-muffin
FIS browerify 解决方案

## 特点
* FIS 集成 browerify，具备两工具功能，前端代码从此可以用 node 框架进行测试了
* 简化命令行（`mfn = fis release`）并支持自定义，妈妈再也不用担心我 release 和 server 敲混了
* `coffee`、`react`、`coffee&react` 语言支持，没有插件支持的告诉我，我来帮你写
* `sass`、`less` 样式语言支持
* 采用 node 方式代码模块化，写前端跟写 nodejs 后端一样的爽
* 代码库采用 npm 管理，`npm install jquery --save` 一条命令搞定一个库
* 所有 js 压缩打包成一个，不只；所有 css 压缩也能打包成一个，静态资源的路径自动更新哟
* 图片优化压缩、碎小图片支持内嵌，fis 有的它都有
* 发布后日志语句自动删除
* 发布目录通过配置重新整理，还你干干净净
* 支持 `watch` 方式开发，一边敲代码，一旁浏览器即时刷新；最重要的是编译性能非常之快
* 支持在 js 中直接引入 css，没想到 css 也能模块化了，也不用担心忘记加载了

## 进行中
* 考虑支持编译预处理
* 考虑支持引入 amd 、cmd、node 、global 的代码库
* 考虑发布后提供 `requirejs-seed` 、`browserify-seed`、`global-seed`

## 安装 & 插件安装
npm install -g fis-muffin

npm install -g fis-postpackager-autoload

npm install -g fis-postpackager-simple

npm install -g browserify

npm install -g watchify

...
## 使用
### 目录结构
    webapp
      --assets
        --index.css
        --bg.png
      --src (模块化代码库)
        --index.js
      --fis-conf.js
      --index.html

> 建议用此目录结构，当然你可以通过 fis-conf.js 修改

> 在index.html的 head末尾加入以下代码 <!-- @require index.css --><!--STYLE_PLACEHOLDER--> 表示引入 css，
> body末尾加入以下代码<!-- @require app --><!--SCRIPT_PLACEHOLDER--><!--RESOURCEMAP_PLACEHOLDER--> 表示引入 js

### 命令映射
    module.exports = {
        settings: {
            command: {
                '': 'release -b',
                'w': 'release -bw',
                'wL': 'release -bwL',
                'op': 'release -bop',
                'opm': 'release -bopm',
                'start': 'server start',
                'stop': 'server stop',
                'open': 'server open'
                'clean': 'server clean'
            },
            browserify: {
                ...
            }
        },
        roadmap: {
            ext: {
                coffee: 'js'
            },
            path: [
                {
                  ... 
                }
            ]
        }
    }
    fis.config.set('project.exclude', [...]);

<table>
  <tr>
    <th>FIS 命令</th><th>Muffin 对应命令</th><th>作用</th>
  </tr>
  <tr>
    <td>fis release</td><td>mfn</td><td>简单发布</td>
  </tr>
  <tr>
    <td>fis release -w</td><td>mfn w</td><td>发布并监视</td>
  </tr>
  <tr>
    <td>fis release -wL</td><td>mfn wL</td><td>发布并监视浏览器刷新</td>
  </tr>
  <tr>
    <td>fis release -op</td><td>mfn op</td><td>压缩打包</td>
  </tr>
  <tr>
    <td>fis release -opm</td><td>mfn opm</td><td>压缩打包并加上md5文件戳</td>
  </tr>
  <tr>
    <td>fis server start</td><td>mfn start</td><td>启动服务打开浏览器</td>
  </tr>
  <tr>
    <td>fis server stop</td><td>mfn stop</td><td>停止服务</td>
  </tr>
  <tr>
    <td>fis server open</td><td>mfn open</td><td>打开发布目录</td>
  </tr>
  <tr>
    <td>fis server clean</td><td>mfn clean</td><td>清理发布目录</td>
  </tr>
</table>


### browserify 配置
    module.exports = {
        settings: {
            browserify: {
                main: 'index.coffee',
                output: '_app.js',  //不建议修改
                transform: 'coffee-reactify',
                extension: '.coffee'
            }
        }
    }


> 如果使用 browserify 的插件，如 coffee-reactify，需另外安装：npm install coffee-reactify --save-dev
