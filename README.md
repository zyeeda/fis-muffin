# fis-muffin
FIS browerify 解决方案

## 特点
* 命令行简化（'mfn start' = 'mfn server start'）
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

## 进行中
* 考虑支持编译预处理
* 考虑支持引入 amd 、cmd、node 、global 方式的代码库
* 考虑发布后支持三种引入方式 `requirejs-seed` 、`browserify-seed`、`global-seed`

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

> 建议是这种文件夹目录，当然你可以通过 fis-conf.js 修改。在index.html的 head末尾加入
> 以下代码 <!-- @require index.css --><!--STYLE_PLACEHOLDER-->，body末尾加入
> 以下代码<!-- @require app --><!--SCRIPT_PLACEHOLDER--><!--RESOURCEMAP_PLACEHOLDER-->

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