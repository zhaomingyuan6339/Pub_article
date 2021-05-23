/**文章分类管理 路由模块*/
/**导入express */
const express = require('express');
const router = express.Router();
const getArticle = require('../Router_handler/article');
/**导入 express验证中间件*/
const expressJoi = require('@escook/express-joi');

/**导入文章分类的验证规则文件 */
const ArticleCates_schema = require('../schema/article');


/*创建获取文章列表的路由 */
router.get('/cates', getArticle.getArticleCates);

/**创建新增文章分类的路由 */
router.post('/addcates', expressJoi(ArticleCates_schema.add_article_cates_schema), getArticle.addArticleCates);


/**创建根据id删除文章分类的路由 */
router.get('/deletecate/:id', expressJoi(ArticleCates_schema.del_article_catesById_schema), getArticle.delArticleCatesById);

/**创建根据id获取文章分类的路由 */
router.get('/cates/:id', expressJoi(ArticleCates_schema.get_article_catesById_schema), getArticle.getArticleCatesById);

/**创建根据id更新文章分类的路由 */
router.post('/updatecate', expressJoi(ArticleCates_schema.update_article_catesById_schema), getArticle.updateArticleCatesById);

/**共享路由 */
module.exports = router;