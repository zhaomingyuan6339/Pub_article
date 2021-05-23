$(function () {
    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    const layer = layui.layer;
    const q = {
        pagenum: 1,//页码值，默认请求第一页的数据，
        pagesize: 2,//每页显示几条数据，默认每页显示2条
        cate_id: '',//文章分类的Id
        state: ''//文章的发布状态
    }

    /**定义美化事件的过滤器 */
    template.defaults.imports.dateFormat = (date) => {
        const dt = new Date(date);

        // 年月日
        var YY = dt.getFullYear();
        var MM = addZero(dt.getMonth() + 1);
        var DD = addZero(dt.getDate());
        // 时分秒
        var HH = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var ss = addZero(dt.getSeconds());
        return `${YY}-${MM}-${DD} ${HH}:${mm}:${ss} `;

    }
    /**定义补零函数 */
    const addZero = (n) => {
        return n < 10 ? '0' + n : n;
    }


    initTable();
    initCate();
    /**获取文章列表数据的方法 */
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            // data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 2 });
                }
                /**导入模板引擎渲染数据 */
                // console.log(res);
                const htmlStr = template('tpl-table', res);
                $('#getArticleDetailInformation').html(htmlStr);
            }
        })
    }

    /**动态渲染文章分类列表到下拉菜单 */
    //发起获取文章分类的ajax请求
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 6 })
                }
                /**定义模板引擎 */
                const htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                layui.form.render();
            }
        })
    }


    /**为筛选表单绑定submit事件 */
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选项中的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        /**根据最新的筛选条件，重新渲染表格中的数据 */
        initTable();
    })

    /**通过代理的形式为删除按钮绑定 */
    $('#getArticleDetailInformation').on('click', '#btn_delete', function () {
        const id = $(this).attr('data-id');
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除文章成功！', { icon: 3 });
                    initTable();
                }
            })
            layer.close(index)
        })
    })
})

