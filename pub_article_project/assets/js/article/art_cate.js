$(function () {
    initArticleList();
    /**获取文章分类的列表 */
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败！');
                }
                // console.log(res);
                /**定义数据 */
                let htmlStr = template('tpl-article', res);
                $('#getArtInformation').html(htmlStr);
            }
        })
    }

    /**为添加类别按钮绑定电机事件 */
    $('#btnAddCate').on('click', function () {
        layer.open({
            type: 1,
            area: ['500px', '300px'],
            skin: 'demo-class',
            shade: [0.4, '#393D49'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    })

    /**为form表单绑定submit事件完成添加文章分类
     * 因为我们的form表单是通过模板引擎动态渲染到页面上去的，所以不能直接为form表单绑定submit事件
     * 要通过事件委派的方式进行绑定
     */
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg('新增文章分类成功！', { icon: 1 })
                initArticleList();
            }
        })
    })

    /**通过委托的方式为编辑按钮绑定点击事件 */
    $('#getArtInformation').on('click', '#btn_edit', function () {
        layer.open({
            type: 1,
            area: ['500px', '300px'],
            skin: 'demo-class',
            shade: [0.4, '#393D49'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        });
        /**发起ajax根据ID获取文章分类信息 */
        const id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                // console.log(res);
                $('#form_edit [name=Id]').val(res.data.Id);
                $('#form_edit [name=name]').val(res.data.name);
                $('#form_edit [name=alias]').val(res.data.alias);

            }
        })
    })

    /**通过事件委派的方式为form表单添加submit事件 */
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        //发起ajax请求对文章分类数据进行更新
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg('更新文章分类成功！', { icon: 1 });
                initArticleList();
            }
        })
    })

    // /**为撤销修改按钮绑定事件 */
    // $('body').on('click', '#btn_reset', function (e) {
    //     e.preventDefault();
    //     $('#form_edit [name=Id]').val(res.data.Id);
    //     $('#form_edit [name=name]').val(res.data.name);
    //     $('#form_edit [name=alias]').val(res.data.alias);
    // })

    /**通过事件委托的方式为为删除按钮绑定点击事件 */
    $('#getArtInformation').on('click', '#btn_delete', function () {
        const id = $(this).attr('data-id');

        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            console.log(id);
            //发起ajax请求删除
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message, { icon: 6 })
                    }
                    layui.layer.msg(res.message, { icon: 1 })
                    initArticleList();
                }
            })
        })
    })
})