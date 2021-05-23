/**验证文章分类的表单数据 */

/**导入验证文章分类的中间件 */
const joi = require('@hapi/joi');

/**定义验证新增文章分类的表单数据验证规则 */

const name = joi.string().required();

const alias = joi.string().required();

/**定义根据id删除文章分类的数据验证规则 */
const id = joi.number().integer().min(1).required();






/**向外共享新增文章分类的表单验证规则 */
exports.add_article_cates_schema = {
    body: {
        name,
        alias
    }
}

/**向外共享删除文章分类的表单验证规则对象 */
exports.del_article_catesById_schema = {
    params: {
        id: id,
    }
}

/**共享根据id获取文章分类信息的表单验证规则对象 */
exports.get_article_catesById_schema = {
    params: {
        id,
    }
}


/**共享根据id更新文章分类数据信息的表单验证规则对象 */
exports.update_article_catesById_schema = {
    body: {
        Id: id,
        name,
        alias,
    }
}