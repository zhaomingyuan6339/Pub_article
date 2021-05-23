/*用户信息验证规则模块 */
const joi = require('@hapi/joi');
/*定义验证规则 */

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

//1.用户名的验证规则
const username = joi.string().min(1).max(10).required();

//2.密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required();


/**用户表单信息的验证规则 */
const id = joi.number().integer().min(1).required();//id验证规则

const nickname = joi.string().required();//昵称验证规则

const email = joi.string().email().required();//邮箱验证规则

/**用户头像信息的验证规则 */
const avatar = joi.string().dataUri().required();

//3.注册和登录表单的验证规则对象
exports.reg_login_schema = {
    /*表示要对req.body中的数据对象进行验证 */
    body: {
        username,
        password
    }
}

/**向外共享用户信息的表单的验证规则对象 */
exports.reg_update_schema = {
    body: {
        id: id,
        nickname: nickname,
        email: email
    }
}

/**向外共享重置密码的表单数据验证规则对象 */
exports.update_password_schema = {
    body: {
        /**使用password这个验证规则，验证req.body.oldPwd的值 */
        oldPwd: password,
        /**
         * 使用joi.not(joi.ref('oldPwd)).concat(password)规则，验证req.body.newPwd的值，
         * 解读：
         * 1.joi.ref('oldPwd)表示newPwd的值必须和oldPwd的值保持一致
         * 2.joi.not(joi.ref('oldPwd))表示newPwd的值不能等于oldPwd的值
         * 3..concat()用于合并两条验证规则
         */
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

/**向外共享验证用户头像信息的规则对象 */
exports.update_avatar_schema = {
    body: {
        avatar: avatar,
    }
}