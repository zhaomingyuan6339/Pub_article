$(function () {
    const form = layui.form;
    const layer = layui.layer;

    /**校验表单验证 */
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '与原来密码重复！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('.layui-form [name=oldPwd]').val(),
                newPwd: $('.layui-form [name=newPwd]').val(),
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更改密码成功！', { icon: 1 })
                $('.layui-form')[0].reset();
                // console.log(res);
            }
        })
    })
})
