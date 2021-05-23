/*用户路由模块 */
/*创建路由对象 */
const express = require('express');
const router = express.Router();

/*导入用户路由处理函数模块 */
const router_handle = require('../Router_handler/user');

/*导入验证表单数据的中间件 */
const expressJoi = require('@escook/express-joi');

/*导入验证规则对象 */

const reg_login = require('../schema/user');
const reg_login_schema = reg_login.reg_login_schema;

/*注册新用户 */
/**在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
 *数据验证通过后，会把这次请求流转给后面的路由处理函数
 *数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理 */
router.post('/reguster', expressJoi(reg_login_schema), router_handle.regUser)

/*登录 */
router.post('/login', expressJoi(reg_login_schema), router_handle.login)

/*将用户路由模块导出 */
module.exports = router;