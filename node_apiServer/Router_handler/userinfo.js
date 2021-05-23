/*导入数据库模块 */
const db = require('../db/index');
/**导入加密模块 */
const bcrypt = require('bcryptjs');
/**定义获取用户基本信息的处理函数 */
exports.getUserInfo = (req, res) => {
    /*定义要执行的sql语句 */
    const sql = 'SELECT id, username,nickname,email,user_pic FROM ev_users WHERE id=? ';
    /*执行sql语句 */
    /**注意：
     * req对象上的user属性，是token解析成功，express-jwt中间件帮我们挂载上去的
     */
    db.query(sql, req.user.id, (err, results) => {
        if (err) {
            /**sql执行失败 */
            return res.cc(err);
        }
        /**执行成功，但是查询到的数据不存在 */
        if (results.length !== 1) {
            return res.cc('获取用户信息失败！')
        }
        // console.log(results);

        /**查询成功，将用户信息响应给客户端 */
        res.send({
            status: 0,
            message: '获取用户基本信息成功',
            data: results[0]
        })
    })
    // res.send('OK');
}

/**定义更新用户基本信息的处理函数 */
exports.updateUserInfo = (req, res) => {
    /**实现更新用户基本信息的功能 */
    /**定义要执行的sql语句 */
    const sql = `UPDATE ev_users SET ? WHERE id=? `;
    /**执行sql语句 */
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);//sql语句执行失败
        /**sql语句执行成功，但是影响行数不为1 */
        if (results.affectedRows !== 1) {
            return res.cc('修改用户信息失败');
        }
        res.send({
            status: 0,
            message: '更新用户基本信息成功！',
        })
    })
}

/**定义重置用户密码的处理函数 */
exports.updateUserPassword = (req, res) => {
    // res.send('OK');
    /**定义要执行的sql语句 根据请求头查询用户id是否存在*/

    const sql = `SELECT * FROM ev_users WHERE id=?`;
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) {
            return res.cc('用户不存在')
        }
        /*判断用户是否存在 */
        const compareReult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareReult) {
            return res.cc('原密码输入错误！')
        }
        /**原密码输入正确，则对新密码进行bcrypt加密然后更新到数据库中 */
        const sql = `UPDATE ev_users SET password=? WHERE id=?`;
        /**对新密码进行加密处理 */
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) {
                return res.cc('更新密码失败')
            }
            res.send('更新密码成功！')
        })
    })
}

/**定义更换头像的处理函数 */
exports.updateAvatar = (req, res) => {
    /**定义更换头像的sql语句 */
    const sql = `UPDATE ev_users SET user_pic=? WHERE id=?`;
    /**执行sql */
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) {
            return res.cc(err);
        }
        if (results.affectedRows !== 1) {
            return res.cc('更新用户头像失败！');
        }
        res.cc('更换用户头像成功！', 0);
    })
}