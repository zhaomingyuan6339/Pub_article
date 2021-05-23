



const path = require('path');
const db = require('../db');

/** 共享发布文章的路由处理函数*/
exports.publishArticle = (req, res) => {
    // console.log(req.body);//文本类型的数据
    // console.log('==============');
    console.log(req.file);//文件类型的数据
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面是必选参数！')
    }
    /**验证完毕，实现发布新文章的功能 */
    // 定义要进行操作的对象  处理文章信息对象
    const ArticleInfo = {
        //标题、内容、状态、所属的分类id
        ...req.body,
        //文章封面在服务器端您的存储路径
        cover_img: path.join('/uploads', req.file.fieldname),
        //文章发布时间
        pub_date: new Date(),
        //文章作者的ID
        /**
         * 这里req上面的user属性是登录成功后express-jwt中间件自动挂载上去的
         */
        author_id: req.user.id

    }
    /**定义要执行的sql语句 */
    const sql = `INSERT INTO ev_articles SET ?`;
    db.query(sql, ArticleInfo, (err, results) => {
        if (err) {
            return res.cc(err)
        }
        if (results.affectedRows !== 1) {
            return res.cc('文章发布失败！');
        }
        res.cc('文章发布成功！', 0);
    })
}

/**共享获取文章列表数据的路由处理函数 */
exports.getPublishArticle = (req, res) => {
    /**定义要执行的sql语句 */
    const sql = `SELECT * FROM ev_articles WHERE id_delete=0 ORDER BY Id ASC`;
    // const data = {
    //     cate_id: req.body.cate_id,
    //     state: req.body.state
    // }
    db.query(sql, req.body, (err, results) => {
        if (err) {
            return res.cc(err)
        }
        console.log(results);
        res.send({
            status: 0,
            message: '获取文章分类信息成功',
            data: results
        })
    })
}

/**共享根据id删除文章数据的路由处理函数 */
exports.delPublishArticle = (req, res) => {
    /**实现标记删除 */
    const sql = `UPDATE ev_articles SET id_delete=1 WHERE Id=?`;
    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        if (results.affectedRows !== 1) {
            return res.cc('删除文章失败！');
        }
        res.cc('删除文章数据成功！', 0)
    })
}

/**共享根据id获取文章详情的路由处理函数 */
exports.getArticleDetail = (req, res) => {
    /**实现根据ID获取文章详情的功能 */
    const sql = `SELECT * FROM ev_articles WHERE Id=?`;
    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        if (results.length !== 1) {
            return res.cc('获取文章详情失败！')
        }
        res.cc({
            status: 0,
            message: '获取文章详情成功！',
            data: results[0]
        })
    })
}

/**共享根据id更新文章信息的路由处理函数 */
exports.updateArticleDetail = (req, res) => {
    /**验证form-data数据 */
    console.log(req.file);
    // console.log(req.body);
    if (!req.file || req.file.fieldname !== 'cover_img') {
        return res.cc('文章封面是必选参数！');
    }
    /**验证完毕，更新文章信息 */
    const updateArticle = {
        ...req.body,
        pub_date: new Date(),
        cover_img: path.join('/uploads', req.file.fieldname),
        author_id: req.user.id,
    }
    const sql = `UPDATE ev_articles SET? WHERE Id=?`;
    db.query(sql, [updateArticle, req.body.Id], (err, results) => {
        if (err) {
            return res.cc(err)
        }
        if (results.affectedRows !== 1) {
            return res.cc('更新文章失败！')
        }
        res.cc('更新文章成功！');
    })
}
