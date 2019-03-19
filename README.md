├── index.html                      入口页面
    ├── build                           构建脚本目录
    │   ├── build-server.js                 运行本地构建服务器，可以访问构建后的页面
    │   ├── build.js                        生产环境构建脚本
    │   ├── dev-client.js                   开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
    │   ├── dev-server.js                   运行本地开发服务器
    │   ├── utils.js                        构建相关工具方法
    │   ├── webpack.base.conf.js            wabpack基础配置
    │   ├── webpack.dev.conf.js             wabpack开发环境配置
    │   └── webpack.prod.conf.js            wabpack生产环境配置
    ├── config                          项目配置
    │   ├── dev.env.js                      开发环境变量
    │   ├── index.js                        项目配置文件
    │   └── prod.env.js                     生产环境变量
    │
    ├── package.json                    npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
    ├── src                             项目源码目录
    │   ├── main.js                         入口js文件
    │   ├── app.vue                         根组件
    │   ├── index.html                      项目入口文件
    │   ├── assets                          静态资源文件
    │   │   ├── img                            项目所需图片
    │   │   └── font                           项目所需字体库
    │   ├── components                      公共组件目录
    │   │   ├── baseInfo.vue
    │   │   ├── deploy.vue
    │   │   ├── detail.vue
    │   │   ├── myApprove.vue
    │   │   ├── myPut.vue
    │   │   ├── requestNote.vue
    │   │   ├── screen.vue
    │   │   ├── selecton.vue
    │   │   └── selectonMyput.vue
    │   ├── routes                          前端路由
    │   │   └── index.js
    │   ├── store                           vuex状态控制
    │   │   └── index.js
    │   ├── utils                           工具文件
    │   │   └── ajax.js                         封装ajax
    │   └── views                           页面目录
    │       ├── approvalRecord.vue
    │       ├── baseInfoLs.vue
    │       ├── bottomBtn.vue
    │       ├── contractInfo.vue
    │       ├── hcontractLs.vue
    │       ├── deployForm.vue
    │       ├── licenseApplicationForm.vue
    │       ├── list.vue
    │       ├── listBtn.vue
    │       ├── modal.vue     未选择item,模态框提示组件
    │       ├── navBar.vue
    │       ├── photos.vue    第三方图片查看插件
    │       ├── screenInfo.vue
    │       ├── selectonInfo.vue  我的审批组件
    │       ├── selectonInfoMyput.vue   我的提交组件
    │       └── user-list.vue
