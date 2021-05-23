/*目的：为了保证 `路由模块` 的纯粹性，所有的 `路由处理函数`，必须抽离到对应的 `路由处理函数模块` 中 */
//在这里定义和用户相关的路由处理函数，供/router/user.js模块进行调用
//2.1.导入数据库模块
const db = require('../db/index');
/*导入加密模块 */
const bcrypt = require('bcryptjs');
/*导入jwt认证模块 */
const jwt = require('jsonwebtoken');
/*注册用户的处理函数 */
exports.regUser = (req, res) => {
    /*1.检测表单数据是否合法 */
    //1.1.获取客户端响应回来的用户信息
    const userinfo = req.body;
    //1.2.判断用户信息是否合法
    if (!userinfo.username || !userinfo.password) {
        return res.send({
            status: 1,
            msg: '用户名或密码不能为空！'
        });
    }
    /*检测数据库是否连接成功 */
    /* db.query('select 1', (err, results) => {
        if (err) {
            return console.log(err.message);
        }
        console.log(results);
    }) */
    /*2.检测用户名是否被占用 */
    // 2.2.要执行的sql语句
    const sql = 'select * from ev_users where username=?';
    //2.3.执行sql语句并判断用户名是否被占用
    db.query(sql, userinfo.username, (err, results) => {
        //sql语句执行失效返回错误信息
        if (err) {
            return res.cc(err)
        }
        //2.4.判断用户名是否被占用
        if (results.length > 0) {
            return res.send({
                status: 1,
                message: '用户名被占用，请更换其他用户名！'
            })
        }
        /*3.对密码进行加密处理 调用 `bcrypt.hashSync(明文密码, 随机盐的长度)` 方法，对用户的密码进行加密处理：*/
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        /*4.插入新用户 */
        //定义要插入的用户信息
        const user = { username: userinfo.username, password: userinfo.password };
        //4.1.定义插入用户的sql语句
        const sql = 'insert into ev_users set ?';
        //4.2.执行语句
        db.query(sql, user, (err, results) => {
            //执行sql语句失败
            if (err) {
                return res.cc(err)
            }
            //执行sql语句成功，但影响行数不为1
            if (results.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    message: '注册用户失败，请稍后再试！'
                })
            }
            //注册成功
            res.send({
                status: 0,
                message: '注册成功！'
            })
        })
    })

    // res.send('regUser OK');
}

/*登录模块的处理函数 */
exports.login = (req, res) => {
    /** 接收表单数据*/
    const userinfo = req.body;
    /*定义要执行的sql语句 */
    const sql = 'SELECT * FROM ev_users WHERE username=?';
    /*执行sql语句 */
    db.query(sql, userinfo.username, (err, results) => {
        if (err) {//执行sql语句失败
            return res.cc(err);
        }
        if (results.length !== 1) {
            return res.cc('用户名不存在，登陆失败！')
        }
        // console.log(results);
        /*验证密码是否正确 */
        const compareReult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareReult) {
            return res.cc('用户输入密码错误');
        }
        /*登录提交，生成token字符串 */
        /**对用户信息进行处理，剔除密码和头像信息 */
        const user = { ...results[0], password: "", user_pic: '' };
        // console.log(user);
        /*导入jwtSecretKey字符串 */
        const config = require('../config');
        /**生成token字符串 */
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        // console.log(`Bearer ${tokenStr}`);
        /*将生成的token字符串响应给客户端 */
        res.send({
            status: 0,
            message: '登录成功',
            token: `Bearer ${tokenStr}`
        })
    })



}
