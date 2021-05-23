/**文章分类管理路由处理函数 */

const db = require("../db");

/**导出获取文章分类列表的路由处理函数 */
exports.getArticleCates = (req, res) => {
    /**获取文章分类列表 */
    const sql = `SELECT * FROM ev_article_cate WHERE is_delete=0 ORDER BY id ASC `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results,
        })
    })
}


/**导出新增文章分类的路由处理函数 */
exports.addArticleCates = (req, res) => {
    /**判断文章分类名称和别名是否被占用 */
    /**待执行的sql语句 */
    const sql = 'SELECT * FROM ev_article_cate WHERE name=? OR alias=?';
    /**执行sql语句 */
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) {
            return res.cc(err);//sql语句执行失败
        }
        console.log(results);
        /**当文章分类名称和别名分别被占用 异位占用 */
        if (results.length === 2) {
            return res.cc('文章分类名称和分类别名均被占用，请更换后重试！');
        }
        /**当文章分类名称和分类别名均被占用，同位占用，即一条数据的name或alias相同 */
        if (results.length === 1 && req.body.name === results[0].name && req.body.alias === results[0].alias) {
            return res.cc('文章分类名称和分类别名均被占用，请更换后重试！')
        }
        if (results.length === 1 && req.body.name === results[0].name) {
            return res.cc('文章分类名称被占用，请更换后重试')
        }
        if (results.length === 1 && res.body.alias === results[0].alias) {
            return res.cc('文章分类别名被占用，请更换后重试!');
        }

        /**实现插入文章分类的功能 */
        // 定义sql语句
        const sql = 'INSERT INTO  ev_article_cate SET ?';
        db.query(sql, req.body, (err, results) => {
            if (err) {
                return res.cc(err);
            }
            if (results.affectedRows !== 1) {
                return res.cc('新增文章分类失败');
            }
            res.cc('新增文章分类成功！', 0);
        })
    })

}

/**导出根据id删除文章分类的路由处理函数 */
exports.delArticleCatesById = (req, res) => {
    /**实现标记删除的功能 */
    /**定义标记删除的sql语句 */
    const sql = `UPDATE ev_article_cate SET is_delete=1 WHERE id=?`;
    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        if (results.affectedRows !== 1) {
            return res.cc('删除文章分类失败！')
        }
        res.cc('删除文章分类成功！', 0);
    })
}


/**导出根据id获取文章分类列表的路由处理函数 */
exports.getArticleCatesById = (req, res) => {
    /**实现 */
    const sql = `SELECT * FROM ev_article_cate WHERE id= ?`;
    db.query(sql, req.params.id, (err, results) => {
        if (err) {
            return res.cc(err);
        }
        if (results.length !== 1) {
            return res.cc('获取文章分类失败！');
        }
        console.log(results[0]);
        res.send({
            status: 0,
            message: '获取文章分类成功！',
            data: results[0],
        })
    })
}

/**导出根据id更新文章分类的路由处理函数 */
exports.updateArticleCatesById = (req, res) => {
    /**查询文章分类名称和别名是否已经被占用 */
    const sql = `SELECT * FROM ev_article_cate WHERE id<>? AND (name=? OR alias=?)`;
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) {
            return res.cc(err);
        }
        if (results.length === 2) {
            return res.cc('文章类名和别名冲突，请更换后重试')
        }
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('文章分类名与别名均冲突，请更换后重试！');
        }
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('文章分类名冲突，请更换后重试！');
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('文章分类别名冲突，请更换后重试！')
        }
        /**检查无冲突，进行更新的操作 */
        /**定义待执行的更新sql语句 */
        const sql = `UPDATE ev_article_cate SET ? WHERE id=?`;
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if (err) {
                return res.cc(err);
            }
            if (results.affectedRows !== 1) {
                return res.cc('更新文章内容失败！');
            }
            res.cc('更新文章内容成功', 0);
        })
    })
}