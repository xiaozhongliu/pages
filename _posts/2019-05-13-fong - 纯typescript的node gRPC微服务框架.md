---
layout: post
title: fong - 纯typescript的node gRPC微服务框架
key: 20190513
tags: grpc grpc-node microservice framework typescript
---

# 简介
**fong**: A service **f**ramework **o**f **n**ode **g**RPC.  
github: [https://github.com/xiaozhongliu/fong](https://github.com/xiaozhongliu/fong)  
fong是一个完全用typescript编写的node gRPC框架, 可以基于它很方便地编写gRPC微服务应用. 一般是用来编写service层应用, 以供bff层或前端层等调用.  

# 优点
1.纯typescript编写, typescript的好处不用多说了. 这个框架还做到了写框架和用户使用框架包括查看定义等都是ts源码, 用户使用框架完全感受不到type definition文件.  
2.效仿[egg.js](https://eggjs.org/zh-cn/intro/index.html)的『约定优于配置』原则, 按照统一的约定进行应用开发, 项目风格一致, 开发模式简单, 上手速度极快.  
如果用过egg, 就会发现一切都是那么熟悉.

# 对比

目前能找到的开源node gRPC框架很少, 跟其中star稍微多点的mali简单对比一下:  

|对比方面          |mali       |fong       |
|:---         |:---       |:---       |
|项目风格约定   |           |√          |
|定义查看跳转   |definition |源代码      |
|编写语言      |javascript |typescript |
|proto文件加载 |仅能加载一个 |按目录加载多个|
|代码生成      |           |√          |
|中间件        |√          |√          |
|配置          |           |√          |
|日志          |           |√          |
|controller加载|           |√          |
|service加载   |           |即将支持, 目前可以自己import即可 |
|util加载      |           |即将支持, 目前可以自己import即可 |
|入参校验       |           |即将支持    |
|插件机制       |           |打算支持    |
|更多功能       |           |TBD        |

# 示例

# 使用

### 目录约定
不同类型文件只要按以下目录放到相应的文件夹即可自动加载.  
**root**  
├── **proto**  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── greeter.proto  
├── **config**  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── config.default.ts  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── config.dev.ts  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── config.prod.ts  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── config.stage.ts  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── config.test.ts  
├── **midware**  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── logger.ts  
├── **controller**  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── greeter.ts  
├── **service**  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── sample.ts  
├── **util**  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── sample.ts  
└── typings  
   ├── enum.ts  
   ├── greeter  
   └── indexed.d.ts  
├── **log**  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── common.20190512.log  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── common.20190513.log  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── request.20190512.log  
&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── request.20190513.log  
├── **app.ts**  
├── **package.json**  
├── **tsconfig.json**  
└── **tslint.json**  

### 入口文件
```typescript
import App from 'fong'
new App().start()
```

### 配置示例
默认配置config.default.ts与环境配置config.<NODE_ENV>.ts必须, 运行时会合并.  
配置可从ctx.config和app.config获取.  

```typescript
import { AppInfo, Config } from 'fong'

export default (appInfo: AppInfo): Config => {
    return {
        // basic
        PORT: 50051,

        // log
        COMMON_LOG_PATH: `${appInfo.rootPath}/log/common`,
        REQUEST_LOG_PATH: `${appInfo.rootPath}/log/request`,
    }
}
```

### 中间件示例
注: req没有放到ctx, 是为了方便在controller中支持强类型.
```typescript
import { Context } from 'fong'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')

export default async (ctx: Context, req: object, next: Function) => {
    const start = dayjs()
    await next()
    const end = dayjs()

    ctx.logger.request({
        '@duration': end.diff(start, 'millisecond'),
        controller: `${ctx.controller}.${ctx.action}`,
        metedata: JSON.stringify(ctx.metadata),
        request: JSON.stringify(req),
        response: JSON.stringify(ctx.response),
    })
}

```

### controller示例
```typescript
import { Controller, Context } from 'fong'
import HelloReply from '../typings/greeter/HelloReply'

export default class GreeterController extends Controller {

    async sayHello(ctx: Context, req: HelloRequest): Promise<HelloReply> {
        return new HelloReply(
            `Hello ${req.name}`,
        )
    }

    async sayGoodbye(ctx: Context, req: HelloRequest): Promise<HelloReply> {
        return new HelloReply(
            `Goodbye ${req.name}`,
        )
    }
}
```

### 日志
日志文件  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求日志: ./log/request.yyyyMMdd.log  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他日志: ./log/common.yyyyMMdd.log

### 代码生成
代码生成器还未单独封包, 现在放在codegen目录下.


### 定义查看跳转
Peek Definition直接指向源码.
![](/assets/posts/20190513/peek.jpg)

# 近期计划

### service加载

### util加载

### 入参校验
