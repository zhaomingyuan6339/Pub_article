/**表单数据验证模块 */

/**实现思路
 * 通过express-joi自动验证req.body中的模块
 * 通过if else手动验证req.file中的数据
 */

/**导入express-joi中间件 */
const joi = require('@hapi/joi');


/**定义验证规则 */
const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布', '草稿').required();


/**定义获取文章列表数据的验证规则 */
const pagenum = joi.number().integer().min(1).required();
const pagesize = joi.number().integer().required();



/**验证删除文章的表单数据 */

const id = joi.number().integer().integer().min(1).required()


/**验证更新文章数据的规则 */



/**共享发布文章的规则验证对象 */
exports.publish_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

/**共享获取文章的列表数据的验证规则对象 */
exports.get_newArticle_schema = {
    body: {
        // pagenum,
        // pagesize,
        cate_id,
        state,
    }
}


/**共享删除文章数据的规则验证对象 */
exports.del_publish_article_schema = {
    params: {
        id,
    }
}

/**共享根据id获取文章数据的规则验证对象 */
exports.get_publish_article_detail_schema = {
    params: {
        id,
    }
}

/**共享更新文章数据的规则验证对象 */
exports.update_publish_detail_schema = {
    body: {
        Id: id,
        title,
        cate_id,
        content,
        state,
    }
}