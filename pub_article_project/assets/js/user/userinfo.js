$(function () {
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        nickname: (value) => {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间！';
            }
        }
    })
    initUserInfo();

    /**绑定重置按钮的操作 */
    $('#btnReset').on('click', (e) => {
        e.preventDefault();
        initUserInfo();
    })


    /**发起请求更新用户的信息 */
    /**监听form表单的提交行为 */
    $('#formData').on('submit', function (e) {
        e.preventDefault();
        //发起ajax请求更新用户信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message, { icon: 5 });
                }
                layer.msg(res.message, { icon: 1 });
                top.window.parent.getUserinfo()
            }
        })
    })
})

/**初始化用户的基本信息 */
const initUserInfo = () => {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: (res) => {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！', { icon: 5 });
            }
            // console.log(res);
            $('.layui-form [name=id]').val(res.data.id);
            $('.layui-form [name=username]').val(res.data.username);
            $('.layui-form [name=nickname]').val(res.data.nickname);
            $('.layui-form [name=email]').val(res.data.email);
        }
    })
}



