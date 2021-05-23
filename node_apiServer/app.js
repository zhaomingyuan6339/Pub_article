/*1.初始化项目
1.1 创建基本的web服务器 */
//导入express模块
const express = require('express');
const app = express();
/*导入express-jwt解析token的中间件 */
const expressJWT = require('express-jwt');
/*导入@hapi_joi包 */

const joi = require('@hapi/joi');
const config = require('./config');
/*1.2.配置cors解决跨域问题中间件 */
const cors = require('cors');


//将cors注册为全局中间件
app.use(cors());


/*1.3.配置解析表单数据的中间件 */
app.use(express.urlencoded({ extended: false }))


/*优化res.send()代码，在处理函数中，需要多次调用 `res.send()` 向客户端响应 `处理失败` 的结果，为了简化代码，可以手动封装一个 res.cc() 函数 */

app.use(function (req, res, next) {
    //status=0为成功，status=1为失败；默认将status的值设置为1，方便处理失败的情况
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next();
})
/*在所有路由之前注册解析token的中间件 */
/*导入配置文件 */

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }));
/*1.5.初始化用户路由模块 */
// 导入并使用用户路由模块
const userRouter = require('./Router/user');
app.use('/api', userRouter);

/**导入个人中心路由处理模块 */
const userinfoRouter = require('./Router/userinfo');
app.use('/my', userinfoRouter)

/**导入并使用文章分类管理路由模块 */
const articleRouter = require('./Router/article');
app.use('/my/article', articleRouter);


/**导入并使用发布文章管理的路由模块 */
const articlePublishRouter = require('./Router/articlePub');
app.use('/my/article', articlePublishRouter);

/**托管静态资源文件 */

app.use('/uploads', express.static('./uploads'));

/**注册表单数据验证--全局错误级别中间件 捕获验证失败的错误，并把验证失败的结果响应给客户端：*/
/*错误级别中间件必须写在所有路由之后 */
app.use((err, req, res, next) => {
    /*数据验证失败 */
    if (err instanceof joi.ValidationError) {
        return res.cc(err);
    }
    /*在错误级别中间件里，捕获并处理token认证失败后得错误 */
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败');
    }
    // 未知错误
    res.cc(err);
})

//调用app.listen方法绑定端口号，启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})