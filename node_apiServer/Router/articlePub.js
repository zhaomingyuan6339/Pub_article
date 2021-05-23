/**发布文章路由模块 */
const express = require('express');
const router = express.Router();
const ArticlePublish = require('../Router_handler/articlePub');

/**导入解析formdata格式的数据包 */
const multer = require('multer');
/**导入处理路径的核心模块 */
const path = require('path');

/**导入express-joi中间件解析表单验证规则 */
const expressJoi = require('@escook/express-joi');


/**创建multer的实例对象，通过dest属性指定文件的存放路径 */
const upload = multer({ dest: path.join(__dirname, '../uploads') });

/**导入表单数据验证规则对象 */
const publishArticleSchema = require('../schema/articlePub');



/**发布新文章的路由 */
/**
 * upload.single()是一个局部生效的中间件，用来解析FormData格式的表单数据
 * 将文件类型的数据没解析并挂载到req.file属性中
 * 将文本类型的数据，解析并挂载到re.body的属性中
 */
router.post('/add', upload.single('cover_img'), expressJoi(publishArticleSchema.publish_article_schema), ArticlePublish.publishArticle);

/**获取文章的列表数据的路由 */
router.get('/list', ArticlePublish.getPublishArticle);

/**根据id删除文章数据的路由 */
router.get('/delete/:id', expressJoi(publishArticleSchema.del_publish_article_schema), ArticlePublish.delPublishArticle);

/**根据id获取文章详情路由  */
router.get('/:id', expressJoi(publishArticleSchema.get_publish_article_detail_schema), ArticlePublish.getArticleDetail)

/**根据id更新文章信息路由 */
router.post('/edit', upload.single('cover_img'), expressJoi(publishArticleSchema.update_publish_detail_schema), ArticlePublish.updateArticleDetail)


module.exports = router