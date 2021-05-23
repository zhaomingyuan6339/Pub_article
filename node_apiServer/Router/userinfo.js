const express = require('express');
const router = express.Router();

/*导入获取用户基本信息的处理函数 *//**导入更新用户基本信息的处理函数 */
const getUser_info = require('../Router_handler/userinfo');

/**导入验证数据合法性的中间件*/
const expressJoi = require('@escook/express-joi');

/**导入需要的验证规则对象*/
const reg_update_schema = require('../schema/user');

const update_schema = reg_update_schema.reg_update_schema;

const update_password_schema = reg_update_schema.update_password_schema;
/**导入验证用户头像信息的规则对象 */

const update_user_avatar = reg_update_schema.update_avatar_schema;

/**获取用户信息的路由模块 */
router.get('/userinfo', getUser_info.getUserInfo);


/**更新用户基本信息的路由 */
router.post('/userinfo', expressJoi(update_schema), getUser_info.updateUserInfo);

/**重置用户密码的路由 */
router.post('/updatepwd', expressJoi(update_password_schema), getUser_info.updateUserPassword);

/**更换用户头像的路由 */
router.post('/update/avatar', expressJoi(update_user_avatar), getUser_info.updateAvatar);
module.exports = router